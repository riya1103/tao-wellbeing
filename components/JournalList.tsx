"use client";

import { useEffect, useState } from "react";
import {
  getJournal,
  getMoodHistory,
  removeJournal,
  type JournalEntry,
  type MoodEntry,
} from "@/lib/storage";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

type Tab = "reflections" | "moods";

export default function JournalList() {
  const [tab, setTab] = useState<Tab>("reflections");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEntries(getJournal());
    setMoods(getMoodHistory());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="journal-area">
      <div className="journal-tabs">
        <button
          type="button"
          className={`journal-tab ${tab === "reflections" ? "journal-tab-active" : ""}`}
          onClick={() => setTab("reflections")}
        >
          reflections
        </button>
        <button
          type="button"
          className={`journal-tab ${tab === "moods" ? "journal-tab-active" : ""}`}
          onClick={() => setTab("moods")}
        >
          moods
        </button>
      </div>

      {tab === "reflections" && (
        <div className="journal-list">
          {entries.length === 0 ? (
            <div className="journal-empty">
              <p>Your journal is quiet.</p>
              <p className="journal-empty-sub">Begin by reflecting.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className={`journal-card ${expanded === entry.id ? "journal-card-expanded" : ""}`}
              >
                <button
                  type="button"
                  className="journal-card-header"
                  onClick={() =>
                    setExpanded(expanded === entry.id ? null : entry.id)
                  }
                >
                  <span className="journal-card-date">
                    {formatDate(entry.date)}
                  </span>
                  <span className="journal-card-principle">
                    {entry.principle}
                  </span>
                </button>
                {expanded === entry.id && (
                  <div className="journal-card-body">
                    <p className="journal-card-issue">&ldquo;{entry.issue}&rdquo;</p>
                    <div className="journal-card-reflection">
                      {entry.reflection.split("\n\n").map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                    <div className="journal-card-actions">
                      <span className="journal-card-engine">{entry.engine}</span>
                      <button
                        type="button"
                        className="reflect-btn journal-card-delete"
                        onClick={() => {
                          removeJournal(entry.id);
                          setEntries(getJournal());
                          setExpanded(null);
                        }}
                      >
                        remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === "moods" && (
        <div className="mood-timeline">
          {moods.length === 0 ? (
            <div className="journal-empty">
              <p>No moods recorded yet.</p>
              <p className="journal-empty-sub">Check in from the home page.</p>
            </div>
          ) : (
            <div className="mood-timeline-list">
              <div className="mood-timeline-line" />
              {moods.map((m) => (
                <div key={m.id} className="mood-entry">
                  <div className="mood-entry-dot" />
                  <div className="mood-entry-content">
                    <span className="mood-entry-label">{m.label}</span>
                    <span className="mood-entry-time">
                      {formatDate(m.date)} · {formatTime(m.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
