"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MEDITATION_DURATIONS } from "@/lib/breathing";

export default function MeditationTimer() {
  const [duration, setDuration] = useState(5);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = duration * 60;

  const start = useCallback(() => {
    setDone(false);
    setRemaining(totalSeconds);
    setRunning(true);
  }, [totalSeconds]);

  const pause = useCallback(() => {
    setRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const resume = useCallback(() => {
    setRunning(true);
  }, []);

  const reset = useCallback(() => {
    pause();
    setRemaining(0);
    setDone(false);
  }, [pause]);

  useEffect(() => {
    if (!running) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setRunning(false);
          setDone(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [running]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = totalSeconds > 0 ? remaining / totalSeconds : 1;

  // SVG circle props
  const r = 120;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference * (1 - progress);

  const hasStarted = remaining > 0 || running || done;

  return (
    <div className="meditation-area">
      <div className="timer-ring-container">
        <svg
          className="timer-ring-svg"
          width="280"
          height="280"
          viewBox="0 0 280 280"
        >
          {/* Background track */}
          <circle
            cx="140"
            cy="140"
            r={r}
            fill="none"
            stroke="var(--line)"
            strokeWidth="2"
          />
          {/* Progress arc */}
          <circle
            cx="140"
            cy="140"
            r={r}
            fill="none"
            stroke="var(--bamboo)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 140 140)"
            className="timer-progress"
          />
        </svg>

        <div className="timer-center">
          {done ? (
            <span className="timer-text timer-done-text">peace</span>
          ) : hasStarted ? (
            <span className="timer-text">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          ) : (
            <span className="timer-text timer-duration-text">{duration}m</span>
          )}
        </div>
      </div>

      {done && (
        <p className="meditation-complete-quote">
          &ldquo;To the mind that is still, the whole universe surrenders.&rdquo;
        </p>
      )}

      {!hasStarted && (
        <div className="duration-select">
          {MEDITATION_DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              className={`duration-btn ${d === duration ? "duration-btn-active" : ""}`}
              onClick={() => setDuration(d)}
            >
              {d}m
            </button>
          ))}
        </div>
      )}

      <div className="meditation-controls">
        {!hasStarted && (
          <button type="button" className="reflect-btn" onClick={start}>
            sit
          </button>
        )}
        {running && (
          <button type="button" className="reflect-btn" onClick={pause}>
            pause
          </button>
        )}
        {!running && hasStarted && !done && remaining > 0 && (
          <div className="breath-done-actions">
            <button type="button" className="reflect-btn" onClick={resume}>
              continue
            </button>
            <button type="button" className="reflect-btn" onClick={reset}>
              end
            </button>
          </div>
        )}
        {done && (
          <div className="breath-done-actions">
            <button type="button" className="reflect-btn" onClick={() => { setDone(false); setRemaining(0); }}>
              return
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
