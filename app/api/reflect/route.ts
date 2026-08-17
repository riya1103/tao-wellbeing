import Anthropic from "@anthropic-ai/sdk";
import { matchReflection } from "@/lib/reflections";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";
import { getDistilBertGrounding } from "@/lib/distilbert";
import { buildSlmReply } from "@/lib/slm";

// The Anthropic SDK needs Node, not the edge runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The response is a single text stream. The first line is a JSON metadata header
// (the matched principle + which engine produced the reply), followed by a form-feed
// delimiter (\f), then the reflection text streams token by token. The client splits
// on the first \f. This keeps one code path for both the AI and offline engines.
const DELIM = "\f";

function encoder() {
  return new TextEncoder();
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
  const hasKey =
    !!process.env.ANTHROPIC_API_KEY || !!process.env.ANTHROPIC_AUTH_TOKEN;

  let localGrounding = grounding;
  if (!hasKey) {
    try {
      localGrounding = await getDistilBertGrounding(issue);
    } catch {
      localGrounding = grounding;
    }
  }

  const enc = encoder();

  // ---- Offline / curated path -------------------------------------------------
  // Also the fallback when the AI path errors.
  const streamCurated = (
    controller: ReadableStreamDefaultController,
    engine: "curated" | "curated-fallback" | "slm",
  ) => {
    const header = JSON.stringify({ principle: localGrounding.principle, engine });
    controller.enqueue(enc.encode(header + DELIM));

    const text =
      engine === "slm"
        ? buildSlmReply(issue, localGrounding)
        : `${localGrounding.body}\n\n— ${localGrounding.line}`;

    // Reveal a few characters at a time so the offline path feels like the AI one.
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
  };

  if (!hasKey) {
    const stream = new ReadableStream({
      start(controller) {
        streamCurated(controller, "slm");
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // ---- AI path ----------------------------------------------------------------
  const stream = new ReadableStream({
    async start(controller) {
      let emittedText = false;
      try {
        const client = new Anthropic();
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
        // If the model call fails, fall back to the curated reflection so the
        // person always receives something. The header is already sent; only
        // inject the curated body if the AI produced no text before failing,
        // to avoid appending a whole second reflection onto a partial one.
        console.error("reflect: AI path failed, serving curated fallback:", err);
        try {
          if (!emittedText) {
            const text = `${localGrounding.body}\n\n— ${localGrounding.line}`;
            controller.enqueue(enc.encode(text));
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
