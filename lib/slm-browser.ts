// On-device SLM — runs language models in the browser via ONNX Runtime.
// Free. Private. Works offline. No API key needed.

import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = true;

// Model registry

export type ModelId = "distilgpt2" | "qwen2-0.5b";

interface ModelConfig {
  id: ModelId;
  modelPath: string;
  sizeLabel: string;
  quality: "basic" | "good";
}

const MODELS: Record<ModelId, ModelConfig> = {
  distilgpt2: {
    id: "distilgpt2",
    modelPath: "Xenova/distilgpt2",
    sizeLabel: "~80MB",
    quality: "basic",
  },
  "qwen2-0.5b": {
    id: "qwen2-0.5b",
    modelPath: "Xenova/Qwen2-0.5B-Instruct",
    sizeLabel: "~200MB",
    quality: "good",
  },
};

export const DEFAULT_MODEL: ModelId = "distilgpt2";

// State

let activeModel: ModelId | null = null;
let generator: Awaited<ReturnType<typeof pipeline>> | null = null;
let loading = false;
let loadError: string | null = null;
let loadProgress: { status: string; progress: number } | null = null;
let onProgressCallback: ((progress: { status: string; progress: number }) => void) | null = null;

const MAX_NEW_TOKENS = 300;

// Public API

export function getModelConfig(id: ModelId): ModelConfig {
  return MODELS[id];
}

export function onSlmProgress(cb: (progress: { status: string; progress: number }) => void): () => void {
  onProgressCallback = cb;
  return () => { onProgressCallback = null; };
}

export function getSlmStatus(): "ready" | "loading" | "error" | "idle" {
  if (generator) return "ready";
  if (loading) return "loading";
  if (loadError) return "error";
  return "idle";
}

export function getActiveModel(): ModelId | null {
  return activeModel;
}

export function getLoadProgress() {
  return loadProgress;
}

export async function isSlmAvailable(): Promise<boolean> {
  if (generator) return true;
  if (loading) return false;
  await loadModel(DEFAULT_MODEL);
  return generator !== null;
}

export async function loadModel(modelId: ModelId): Promise<boolean> {
  if (generator && activeModel === modelId) return true;
  if (loading) return false;

  const config = MODELS[modelId];
  if (!config) return false;

  loading = true;
  loadError = null;
  loadProgress = { status: "downloading", progress: 0 };
  onProgressCallback?.(loadProgress);

  try {
    generator = await pipeline("text-generation", config.modelPath, {
      quantized: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      progress_callback: (progress: any) => {
        if (progress.status === "downloading") {
          const pct = typeof progress.progress === "number" ? Math.round(progress.progress) : 0;
          loadProgress = { status: "downloading", progress: pct };
          onProgressCallback?.(loadProgress);
        } else if (progress.status === "loading") {
          loadProgress = { status: "loading", progress: 100 };
          onProgressCallback?.(loadProgress);
        }
      },
    } as any);

    activeModel = modelId;
    loading = false;
    loadProgress = { status: "ready", progress: 100 };
    onProgressCallback?.(loadProgress);
    return true;
  } catch (err) {
    loading = false;
    loadError = (err as Error).message || "Failed to load model";
    loadProgress = null;
    console.warn("SLM: model load failed:", loadError);
    onProgressCallback?.({ status: "error", progress: 0 });
    return false;
  }
}

export async function generateSlmReflection(
  userMessage: string,
  systemPrompt: string,
): Promise<string> {
  if (!generator) {
    throw new Error("SLM not available");
  }

  let prompt: string;

  if (activeModel === "qwen2-0.5b") {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (generator as any)(messages, {
      max_new_tokens: MAX_NEW_TOKENS,
      temperature: 0.85,
      do_sample: true,
    });
    const output = result?.[0]?.generated_text;
    if (!output) throw new Error("SLM returned empty output");
    if (Array.isArray(output)) {
      const lastMsg = output[output.length - 1];
      return lastMsg?.content || "";
    }
    return String(output);
  }

  // DistilGPT2 — no chat format, use raw prompt
  prompt = `Taoist guide: ${systemPrompt}\n\nPerson: ${userMessage}\n\nResponse:`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (generator as any)(prompt, {
    max_new_tokens: MAX_NEW_TOKENS,
    temperature: 0.85,
    do_sample: true,
    top_k: 50,
    top_p: 0.95,
  });
  const text = result?.[0]?.generated_text;
  if (!text) throw new Error("SLM returned empty output");

  // Strip the prompt prefix from output
  const marker = "Response:";
  const idx = text.indexOf(marker);
  if (idx !== -1) {
    return text.slice(idx + marker.length).trim();
  }
  return text.trim();
}

export function detectCrisisLocally(input: string): boolean {
  const text = input.toLowerCase().trim();

  const crisisPatterns = [
    "want to die", "want to end it", "end my life", "kill myself",
    "suicide", "suicidal", "self harm", "hurt myself", "cut myself",
    "overdose", "pills", "no reason to live", "better off dead",
    "want to disappear", "don't want to be here", "can't go on",
    "can't take it anymore", "final goodbye", "last message",
    "no hope", "hopeless", "nothing matters", "pointless",
    "no point", "give up on life", "tired of living",
    "hurt someone", "kill someone", "want revenge", "make them pay",
    "going to hurt", "going to kill",
  ];

  return crisisPatterns.some((pattern) => text.includes(pattern));
}

export function resetSlm(): void {
  generator = null;
  activeModel = null;
  loading = false;
  loadError = null;
  loadProgress = null;
}
