"use client";

import { useState } from "react";
import { saveFeedback, type FeedbackEntry } from "@/lib/feedback";

interface FeedbackButtonProps {
  input: string;
  principle: string;
  engine: string;
}

export default function FeedbackButton({ input, principle, engine }: FeedbackButtonProps) {
  const [submitted, setSubmitted] = useState<FeedbackEntry | null>(null);

  const handleFeedback = (helpful: boolean) => {
    const entry = saveFeedback({ input, principle, engine, helpful });
    setSubmitted(entry);
  };

  if (submitted) {
    return (
      <div className="feedback-thanks">
        {submitted.helpful ? "Glad it helped." : "Noted. We'll keep improving."}
      </div>
    );
  }

  return (
    <div className="feedback-row">
      <span className="feedback-label">Was this helpful?</span>
      <button
        className="feedback-btn"
        onClick={() => handleFeedback(true)}
        aria-label="Yes, this was helpful"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
      </button>
      <button
        className="feedback-btn"
        onClick={() => handleFeedback(false)}
        aria-label="No, this was not helpful"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: "rotate(180deg)" }}>
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
      </button>
    </div>
  );
}
