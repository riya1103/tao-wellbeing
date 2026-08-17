// Type-safe localStorage wrapper for mood history and journal entries.
// All functions are safe to call from SSR (they no-op silently).

export interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  label: string;
  note?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  issue: string;
  reflection: string;
  principle: string;
  engine: string;
}

function safeGet<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function safeSet<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* storage full or unavailable */
  }
}

// ── Mood ──────────────────────────────────────────────────────────────────────

const MOOD_KEY = "tao-mood-history";

export function getMoodHistory(): MoodEntry[] {
  return safeGet<MoodEntry>(MOOD_KEY);
}

export function addMood(mood: number, label: string, note?: string): MoodEntry {
  const entry: MoodEntry = {
    id: crypto.randomUUID?.() ?? Date.now().toString(36),
    date: new Date().toISOString(),
    mood,
    label,
    note,
  };
  const history = getMoodHistory();
  history.unshift(entry);
  safeSet(MOOD_KEY, history);
  return entry;
}

export function getTodayMood(): MoodEntry | null {
  const today = new Date().toDateString();
  const history = getMoodHistory();
  return history.find((e) => new Date(e.date).toDateString() === today) ?? null;
}

export function clearMoodHistory() {
  safeSet(MOOD_KEY, []);
}

// ── Journal ───────────────────────────────────────────────────────────────────

const JOURNAL_KEY = "tao-journal";

export function getJournal(): JournalEntry[] {
  return safeGet<JournalEntry>(JOURNAL_KEY);
}

export function addJournal(
  issue: string,
  reflection: string,
  principle: string,
  engine: string,
): JournalEntry {
  const entry: JournalEntry = {
    id: crypto.randomUUID?.() ?? Date.now().toString(36),
    date: new Date().toISOString(),
    issue,
    reflection,
    principle,
    engine,
  };
  const journal = getJournal();
  journal.unshift(entry);
  safeSet(JOURNAL_KEY, journal);
  return entry;
}

export function removeJournal(id: string) {
  const journal = getJournal().filter((e) => e.id !== id);
  safeSet(JOURNAL_KEY, journal);
}

export function clearJournal() {
  safeSet(JOURNAL_KEY, []);
}
