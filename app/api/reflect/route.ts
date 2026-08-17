import Anthropic from "@anthropic-ai/sdk";
import { matchReflection } from "@/lib/reflections";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";
import { getDistilBertGrounding } from "@/lib/distilbert";
import { buildSlmReply } from "@/lib/slm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DELIM = "\f";
const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "smollm2";

function encoder() {
  return new TextEncoder();
}

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
  issue: string,
  grounding: ReturnType<typeof matchReflection>,
) {
  const enc = encoder();
  const header = JSON.stringify({
    principle: grounding.principle,
    engine: "ollama",
  });
  controller.enqueue(enc.encode(header + DELIM));

  const prompt = buildUserPrompt(issue, grounding);

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
    // Ollama streams JSON lines: {"response":"token","done":false}
    for (const line of chunk.split("\n")) {
      if (!line.trim()) continue;
      try {
        const obj = JSON.parse(line);
        if (obj.response) {
          controller.enqueue(enc.encode(obj.response));
        }
      } catch {
        /* partial line */
      }
    }
  }
}

function streamCurated(
  controller: ReadableStreamDefaultController,
  issue: string,
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

  // Check for Ollama
  const ollamaUp = await isOllamaAvailable();

  // ---- Ollama path ----
  if (ollamaUp) {
    const stream = new ReadableStream({
      async start(controller) {
        let emittedText = false;
        try {
          await streamOllama(controller, issue, localGrounding);
          emittedText = true;
          controller.close();
        } catch (err) {
          console.error("reflect: Ollama failed, falling back to curated:", err);
          try {
            if (!emittedText) {
              const text = `${localGrounding.body}\n\n— ${localGrounding.line}`;
              controller.enqueue(new TextEncoder().encode(text));
            }
            controller.close();
          } catch {
            /* controller may already be closed */
          }
        }
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // ---- Anthropic path ----
  if (hasAnthropicKey) {
    const stream = new ReadableStream({
      async start(controller) {
        let emittedText = false;
        try {
          const client = new Anthropic();
          const enc = encoder();
          const header = JSON.stringify({
            principle: grounding.principle,
            engine: "claude",
          });
          controller.enqueue(enc.encode(header + DELIM));

          const messageStream = client.messages.stream({
            model: "claude-opus-4-8",
            max_tokens: 1024,
            thinking: { type: "adaptive" },
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: buildUserPrompt(issue, grounding) }],
          });

          messageStream.on("text", (delta) => {
            emittedText = true;
            controller.enqueue(enc.encode(delta));
          });

          await messageStream.finalMessage();
          controller.close();
        } catch (err) {
          console.error("reflect: AI path failed, serving curated fallback:", err);
          try {
            if (!emittedText) {
              const text = `${localGrounding.body}\n\n— ${localGrounding.line}`;
              controller.enqueue(new TextEncoder().encode(text));
            }
            controller.close();
          } catch {
            /* controller may already be closed */
          }
        }
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // ---- Curated fallback ----
  const stream = new ReadableStream({
    start(controller) {
      streamCurated(controller, issue, localGrounding, "curated");
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
