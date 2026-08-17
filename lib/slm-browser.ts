// On-device SLM — runs Qwen2 0.5B in the browser via ONNX Runtime.
// Free. Private. Works offline. No API key needed.

import { pipeline, env } from "@xenova/transformers";

// Don't download from remote — use local models if available
env.allowLocalModels = true;

let generator: Awaited<ReturnType<typeof pipeline>> | null = null;
let loading = false;
let loadError: string | null = null;

const MODEL_ID = "Xenova/Qwen2-0.5B-Instruct";
const MAX_NEW_TOKENS = 300;

/**
 * Load the model (lazy, one-time).
 * Returns the pipeline or null if loading fails.
 */
async function getGenerator(): Promise<Awaited<ReturnType<typeof pipeline>> | null> {
  if (generator) return generator;
  if (loadError) return null;
  if (loading) return null;

  loading = true;
  try {
    generator = await pipeline("text-generation", MODEL_ID, {
      quantized: true,
    });
    loading = false;
    return generator;
  } catch (err) {
    loading = false;
    loadError = (err as Error).message || "Failed to load SLM";
    console.warn("SLM: model load failed:", loadError);
    return null;
  }
}

/**
 * Check if the on-device SLM is available.
 */
export async function isSlmAvailable(): Promise<boolean> {
  const gen = await getGenerator();
  return gen !== null;
}

/**
 * Get the loading status.
 */
export function getSlmStatus(): "ready" | "loading" | "error" | "idle" {
  if (generator) return "ready";
  if (loading) return "loading";
  if (loadError) return "error";
  return "idle";
}

/**
 * Generate a reflection using the on-device SLM.
 * Falls back gracefully if the model isn't available.
 */
export async function generateSlmReflection(
  userMessage: string,
  systemPrompt: string,
): Promise<string> {
  const gen = await getGenerator();
  if (!gen) {
    throw new Error("SLM not available");
  }

  // Build the prompt in Qwen2 chat format
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (gen as any)(messages, {
    max_new_tokens: MAX_NEW_TOKENS,
    temperature: 0.85,
    do_sample: true,
  });

  // Extract the generated text
  const output = result?.[0]?.generated_text;
  if (!output) {
    throw new Error("SLM returned empty output");
  }

  // If output is an array of messages, get the last assistant message
  if (Array.isArray(output)) {
    const lastMsg = output[output.length - 1];
    return lastMsg?.content || "";
  }

  return String(output);
}

/**
 * Detect crisis language locally using keyword matching.
 * No model needed — fast, works offline, no false negatives.
 */
export function detectCrisisLocally(input: string): boolean {
  const text = input.toLowerCase().trim();

  const crisisPatterns = [
    // Self-harm
    "want to die", "want to end it", "end my life", "kill myself",
    "suicide", "suicidal", "self harm", "hurt myself", "cut myself",
    "overdose", "pills", "no reason to live", "better off dead",
    "want to disappear", "don't want to be here", "can't go on",
    "can't take it anymore", "final goodbye", "last message",

    // Hopelessness
    "no hope", "hopeless", "nothing matters", "pointless",
    "no point", "give up on life", "tired of living",

    // Harm to others
    "hurt someone", "kill someone", "want revenge", "make them pay",
    "going to hurt", "going to kill",
  ];

  return crisisPatterns.some((pattern) => text.includes(pattern));
}

/**
 * Reset the model (for testing or memory cleanup).
 */
export function resetSlm(): void {
  generator = null;
  loading = false;
  loadError = null;
}
