import { pipeline } from "@xenova/transformers";
import { REFLECTIONS, matchReflection, type Reflection } from "./reflections";

let zeroShotClassifier: Awaited<ReturnType<typeof pipeline>> | null = null;

export async function getDistilBertGrounding(issue: string): Promise<Reflection> {
  const text = issue.trim();
  if (!text) {
    return matchReflection(issue);
  }

  try {
    if (!zeroShotClassifier) {
      zeroShotClassifier = await pipeline(
        "zero-shot-classification",
        "Xenova/distilbert-base-uncased",
        { quantized: true },
      );
    }

    const labels = REFLECTIONS.map((reflection) => reflection.principle);
    const classifier = zeroShotClassifier as any;
    const result = await classifier(text, labels, { multi_label: false });
    const topLabel = Array.isArray(result?.labels) ? result.labels[0] : undefined;

    if (topLabel) {
      const matched = REFLECTIONS.find((reflection) => reflection.principle === topLabel);
      if (matched) {
        return matched;
      }
    }
  } catch (error) {
    console.warn("distilbert classification failed, falling back to keyword matcher:", error);
  }

  return matchReflection(issue);
}
