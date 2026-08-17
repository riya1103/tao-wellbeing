"use client";

import { useEffect, useState } from "react";
import { addMood, getTodayMood, type MoodEntry } from "@/lib/storage";

const MOODS = [
  { level: 1, label: "serene", glyph: "○" },
  { level: 2, label: "light", glyph: "◌" },
  { level: 3, label: "unsettled", glyph: "◎" },
  { level: 4, label: "heavy", glyph: "●" },
  { level: 5, label: "troubled", glyph: "◉" },
];

export default function MoodCheckIn() {
  const [today, setToday] = useState<MoodEntry | null>(null);
  const [acked, setAcked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setToday(getTodayMood());
    setMounted(true);
  }, []);

  const handleMood = (mood: (typeof MOODS)[number]) => {
    const entry = addMood(mood.level, mood.label);
    setToday(entry);
    setAcked(true);
    setTimeout(() => setAcked(false), 2400);
  };

  if (!mounted) return null;

  if (today && !acked) {
    return (
      <section className="mood-section">
        <p className="mood-prompt">you checked in earlier</p>
        <p className="mood-existing">
          feeling <span className="mood-label-inline">{today.label}</span>
        </p>
      </section>
    );
  }

  return (
    <section className="mood-section">
      {acked ? (
        <p className="mood-ack">noted — thank you</p>
      ) : (
        <>
          <p className="mood-prompt">how are you?</p>
          <div className="mood-options">
            {MOODS.map((m) => (
              <button
                key={m.level}
                type="button"
                className={`mood-option mood-level-${m.level}`}
                onClick={() => handleMood(m)}
                aria-label={m.label}
                title={m.label}
              >
                <span className="mood-glyph">{m.glyph}</span>
                <span className="mood-label">{m.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
