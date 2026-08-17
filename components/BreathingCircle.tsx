"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BREATHING_PATTERNS,
  cycleDuration,
  type BreathingPattern,
  type BreathingPhase,
} from "@/lib/breathing";

export default function BreathingCircle() {
  const [pattern, setPattern] = useState<BreathingPattern>(BREATHING_PATTERNS[0]);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase | null>(null);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);
  const [done, setDone] = useState(false);

  const totalCycles = 5;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cycleDurationSec = cycleDuration(pattern);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setRunning(false);
    setPhase(null);
    setPhaseIndex(0);
    setCycle(0);
    setPhaseTime(0);
  }, []);

  const start = useCallback(() => {
    stop();
    setDone(false);
    setRunning(true);
    setCycle(1);
    setPhaseIndex(0);
    setPhase(pattern.phases[0]);
    setPhaseTime(pattern.phases[0].duration);
  }, [pattern, stop]);

  useEffect(() => {
    if (!running || !phase) return;

    if (phaseTime <= 0) {
      let nextIndex = phaseIndex + 1;
      if (nextIndex >= pattern.phases.length) {
        nextIndex = 0;
        const nextCycle = cycle + 1;
        if (nextCycle > totalCycles) {
          stop();
          setDone(true);
          return;
        }
        setCycle(nextCycle);
      }
      setPhaseIndex(nextIndex);
      setPhase(pattern.phases[nextIndex]);
      setPhaseTime(pattern.phases[nextIndex].duration);
      return;
    }

    timerRef.current = setInterval(() => {
      setPhaseTime((t) => t - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [running, phase, phaseTime, phaseIndex, cycle, pattern, stop, totalCycles]);

  // Circle scale: inhale → 1.35, hold → 1.35, exhale → 1.0, rest → 1.0
  const scale =
    phase?.name === "inhale" || phase?.name === "hold" ? 1.35 : 1.0;

  const patternDuration = cycleDurationSec;

  return (
    <div className="breathing-area">
      <div className="breathing-circle-container">
        <div
          className={`breathing-circle ${running ? "breathing-circle-active" : ""}`}
          style={{
            transform: `scale(${running ? scale : 1})`,
            transition: `transform ${phase?.duration ?? 4}s ease-in-out`,
          }}
        >
          <div className="breathing-ring" />
          <div className="breathing-center">
            {running && phase ? (
              <span className="breath-phase-text" key={phase.label}>
                {phase.label}
              </span>
            ) : done ? (
              <span className="breath-phase-text">well done</span>
            ) : (
              <span className="breath-phase-text breath-phase-idle">
                {pattern.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {running && (
        <p className="breath-cycle-count">
          {cycle} of {totalCycles}
        </p>
      )}

      {done && (
        <p className="breath-complete-quote">
          &ldquo;Nature does not hurry, yet everything is accomplished.&rdquo;
        </p>
      )}

      <div className="breathing-controls">
        {!running && !done && (
          <button
            type="button"
            className="reflect-btn"
            onClick={start}
          >
            begin
          </button>
        )}
        {running && (
          <button
            type="button"
            className="reflect-btn"
            onClick={stop}
          >
            stop
          </button>
        )}
        {done && (
          <div className="breath-done-actions">
            <button
              type="button"
              className="reflect-btn"
              onClick={start}
            >
              again
            </button>
            <button
              type="button"
              className="reflect-btn"
              onClick={() => setDone(false)}
            >
              enough
            </button>
          </div>
        )}
      </div>

      {!running && !done && (
        <div className="pattern-select">
          {BREATHING_PATTERNS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`pattern-btn ${p.id === pattern.id ? "pattern-btn-active" : ""}`}
              onClick={() => setPattern(p)}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {!running && !done && (
        <p className="pattern-desc">{pattern.description}</p>
      )}
    </div>
  );
}
