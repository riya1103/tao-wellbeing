"use client";

import { useState } from "react";
import { getFeedback, getFeedbackStats } from "@/lib/feedback";

export default function FeedbackExport() {
  const [stats, setStats] = useState<ReturnType<typeof getFeedbackStats> | null>(null);

  const showStats = () => {
    setStats(getFeedbackStats());
  };

  const exportData = () => {
    const data = getFeedback();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tao-feedback-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="feedback-export">
      <div className="feedback-export-row">
        <button type="button" className="reflect-btn" onClick={showStats}>
          view feedback stats
        </button>
        <button type="button" className="reflect-btn" onClick={exportData}>
          export feedback
        </button>
      </div>

      {stats && (
        <div className="feedback-stats">
          <p className="feedback-stat-line">
            {stats.total} responses — {stats.helpful} helpful, {stats.notHelpful} not helpful
          </p>
          {Object.entries(stats.byPrinciple).length > 0 && (
            <div className="feedback-stat-section">
              <p className="feedback-stat-heading">by principle:</p>
              {Object.entries(stats.byPrinciple).map(([principle, counts]) => (
                <p key={principle} className="feedback-stat-item">
                  {principle}: {counts.helpful}✓ {counts.notHelpful}✗
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
