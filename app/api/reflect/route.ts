import Anthropic from "@anthropic-ai/sdk";
import { matchReflection } from "@/lib/reflections";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";
import { getDistilBertGrounding } from "@/lib/distilbert";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DELIM = "\f";
const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "smollm2";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

function encoder() {
  return new TextEncoder();
}

// ---------- Groq (free, hosted) ----------

async function isGroqAvailable(): Promise<boolean> {
  return !!process.env.GROQ_API_KEY;
}

async function streamGroq(
  controller: ReadableStreamDefaultController,
  prompt: string,
  grounding: ReturnType<typeof matchReflection>,
) {
  const enc = encoder();
  const header = JSON.stringify({ principle: grounding.principle, engine: "groq" });
  controller.enqueue(enc.encode(header + DELIM));

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      stream: true,
      temperature: 0.85,
      max_tokens: 512,
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Groq responded with ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    // SSE: lines starting with "data: {...}"
    for (const line of chunk.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") continue;
      try {
        const obj = JSON.parse(data);
        const token = obj.choices?.[0]?.delta?.content;
        if (token) controller.enqueue(enc.encode(token));
      } catch {
        /* partial */
      }
    }
  }
}

// ---------- Ollama (local) ----------

async function isOllamaAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, {
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function streamOllama(
  controller: ReadableStreamDefaultController,
  prompt: string,
  grounding: ReturnType<typeof matchReflection>,
) {
  const enc = encoder();
  const header = JSON.stringify({ principle: grounding.principle, engine: "ollama" });
  controller.enqueue(enc.encode(header + DELIM));

  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      system: SYSTEM_PROMPT,
      prompt,
      stream: true,
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Ollama responded with ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split("\n")) {
      if (!line.trim()) continue;
      try {
        const obj = JSON.parse(line);
        if (obj.response) controller.enqueue(enc.encode(obj.response));
      } catch {
        /* partial line */
      }
    }
  }
}

// ---------- Curated ----------

function streamCurated(
  controller: ReadableStreamDefaultController,
  grounding: ReturnType<typeof matchReflection>,
  engine: "curated" | "curated-fallback",
) {
  const enc = encoder();
  const header = JSON.stringify({ principle: grounding.principle, engine });
  controller.enqueue(enc.encode(header + DELIM));

  const text = `${grounding.body}\n\n— ${grounding.line}`;

  let i = 0;
  const step = () => {
    if (i >= text.length) {
      controller.close();
      return;
    }
    const chunk = text.slice(i, i + 4);
    controller.enqueue(enc.encode(chunk));
    i += 4;
    setTimeout(step, 12);
  };
  step();
}

// ---------- Fallback text ----------

function fallbackText(grounding: ReturnType<typeof matchReflection>): string {
  return `${grounding.body}\n\n— ${grounding.line}`;
}

function serveFallback(
  controller: ReadableStreamDefaultController,
  grounding: ReturnType<typeof matchReflection>,
  emittedText: boolean,
) {
  if (!emittedText) {
    const text = fallbackText(grounding);
    controller.enqueue(new TextEncoder().encode(text));
  }
  controller.close();
}

// ---------- Handler ----------

export async function POST(req: Request) {
  let issue = "";
  try {
    const body = await req.json();
    issue = typeof body?.issue === "string" ? body.issue : "";
  } catch {
    return new Response("Invalid request.", { status: 400 });
  }

  issue = issue.trim();
  if (!issue) {
    return new Response("Nothing was shared.", { status: 400 });
  }
  if (issue.length > 4000) {
    issue = issue.slice(0, 4000);
  }

  const grounding = matchReflection(issue);
  const hasAnthropicKey =
    !!process.env.ANTHROPIC_API_KEY || !!process.env.ANTHROPIC_AUTH_TOKEN;

  let localGrounding = grounding;
  if (!hasAnthropicKey) {
    try {
      localGrounding = await getDistilBertGrounding(issue);
    } catch {
      localGrounding = grounding;
    }
  }

  const prompt = buildUserPrompt(issue, localGrounding);

  // 1. Groq (free hosted LLM — best for Vercel)
  if (await isGroqAvailable()) {
    const stream = new ReadableStream({
      async start(controller) {
        let emittedText = false;
        try {
          await streamGroq(controller, prompt, localGrounding);
          emittedText = true;
          controller.close();
        } catch (err) {
          console.error("reflect: Groq failed, falling back:", err);
          serveFallback(controller, localGrounding, emittedText);
        }
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // 2. Ollama (local)
  if (await isOllamaAvailable()) {
    const stream = new ReadableStream({
      async start(controller) {
        let emittedText = false;
        try {
          await streamOllama(controller, prompt, localGrounding);
          emittedText = true;
          controller.close();
        } catch (err) {
          console.error("reflect: Ollama failed, falling back:", err);
          serveFallback(controller, localGrounding, emittedText);
        }
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // 3. Anthropic
  if (hasAnthropicKey) {
    const stream = new ReadableStream({
      async start(controller) {
        let emittedText = false;
        try {
          const client = new Anthropic();
          const enc = encoder();
          const header = JSON.stringify({
            principle: localGrounding.principle,
            engine: "claude",
          });
          controller.enqueue(enc.encode(header + DELIM));

          const messageStream = client.messages.stream({
            model: "claude-opus-4-8",
            max_tokens: 1024,
            thinking: { type: "adaptive" },
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: prompt }],
          });

          messageStream.on("text", (delta) => {
            emittedText = true;
            controller.enqueue(enc.encode(delta));
          });

          await messageStream.finalMessage();
          controller.close();
        } catch (err) {
          console.error("reflect: Anthropic failed, serving curated:", err);
          serveFallback(controller, localGrounding, emittedText);
        }
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // 4. Curated fallback
  const stream = new ReadableStream({
    start(controller) {
      streamCurated(controller, localGrounding, "curated");
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
