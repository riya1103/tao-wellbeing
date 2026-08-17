// Anonymous feedback storage — everything stays in localStorage.
// No accounts. No tracking. No cloud.

export interface FeedbackEntry {
  id: string;
  timestamp: string;
  input: string;
  principle: string;
  engine: string;
  helpful: boolean;
}

const STORAGE_KEY = "tao-feedback";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function saveFeedback(entry: Omit<FeedbackEntry, "id" | "timestamp">): FeedbackEntry {
  const full: FeedbackEntry = {
    ...entry,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };

  const existing = getFeedback();
  existing.push(full);

  // Keep last 500 entries
  const trimmed = existing.slice(-500);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

  return full;
}

export function getFeedback(): FeedbackEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getFeedbackStats(): {
  total: number;
  helpful: number;
  notHelpful: number;
  byPrinciple: Record<string, { helpful: number; notHelpful: number }>;
  byEngine: Record<string, { helpful: number; notHelpful: number }>;
} {
  const entries = getFeedback();
  const byPrinciple: Record<string, { helpful: number; notHelpful: number }> = {};
  const byEngine: Record<string, { helpful: number; notHelpful: number }> = {};

  let helpful = 0;
  let notHelpful = 0;

  for (const e of entries) {
    if (e.helpful) helpful++;
    else notHelpful++;

    if (!byPrinciple[e.principle]) byPrinciple[e.principle] = { helpful: 0, notHelpful: 0 };
    if (e.helpful) byPrinciple[e.principle].helpful++;
    else byPrinciple[e.principle].notHelpful++;

    if (!byEngine[e.engine]) byEngine[e.engine] = { helpful: 0, notHelpful: 0 };
    if (e.helpful) byEngine[e.engine].helpful++;
    else byEngine[e.engine].notHelpful++;
  }

  return { total: entries.length, helpful, notHelpful, byPrinciple, byEngine };
}

export function exportFeedback(): string {
  const entries = getFeedback();
  return JSON.stringify(entries, null, 2);
}

export function importFeedbackFromExport(json: string): number {
  const incoming: FeedbackEntry[] = JSON.parse(json);
  const existing = getFeedback();
  const existingIds = new Set(existing.map((e) => e.id));

  let added = 0;
  for (const entry of incoming) {
    if (!existingIds.has(entry.id)) {
      existing.push(entry);
      added++;
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(-500)));
  return added;
}
