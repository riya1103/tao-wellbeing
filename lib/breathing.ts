// Breathing pattern definitions inspired by Taoist qi gong practice.

export interface BreathingPhase {
  name: "inhale" | "hold" | "exhale" | "rest";
  label: string;
  duration: number; // seconds
}

export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  phases: BreathingPhase[];
}

export const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: "gentle",
    name: "gentle",
    description: "A calm, steady rhythm for everyday ease.",
    phases: [
      { name: "inhale", label: "breathe in", duration: 4 },
      { name: "hold", label: "hold gently", duration: 4 },
      { name: "exhale", label: "breathe out", duration: 6 },
      { name: "rest", label: "rest", duration: 2 },
    ],
  },
  {
    id: "qi-gong",
    name: "qi gong",
    description: "Traditional qi gong breath for deep restoration.",
    phases: [
      { name: "inhale", label: "draw in", duration: 4 },
      { name: "hold", label: "hold", duration: 7 },
      { name: "exhale", label: "release slowly", duration: 8 },
      { name: "rest", label: "rest", duration: 0 },
    ],
  },
  {
    id: "box",
    name: "box",
    description: "Equal rhythm — a square of breath.",
    phases: [
      { name: "inhale", label: "breathe in", duration: 4 },
      { name: "hold", label: "hold", duration: 4 },
      { name: "exhale", label: "breathe out", duration: 4 },
      { name: "rest", label: "rest", duration: 4 },
    ],
  },
  {
    id: "ocean",
    name: "ocean",
    description: "Long exhale like waves receding from shore.",
    phases: [
      { name: "inhale", label: "wave comes in", duration: 4 },
      { name: "hold", label: "pause at the shore", duration: 2 },
      { name: "exhale", label: "wave recedes", duration: 6 },
      { name: "rest", label: "sand is still", duration: 2 },
    ],
  },
];

/** Total seconds for one full cycle of a pattern. */
export function cycleDuration(pattern: BreathingPattern): number {
  return pattern.phases.reduce((sum, p) => sum + p.duration, 0);
}

/** Default meditation durations in minutes. */
export const MEDITATION_DURATIONS = [3, 5, 10, 15, 20] as const;
