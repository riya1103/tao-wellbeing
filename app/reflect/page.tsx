"use client";

import { useEffect, useRef, useState } from "react";
import Enso from "@/components/Enso";
import FloatingElements from "@/components/FloatingElements";
import PageTransition from "@/components/PageTransition";
import FeedbackButton from "@/components/FeedbackButton";
import { addJournal } from "@/lib/storage";
import {
  isSlmAvailable,
  getSlmStatus,
  generateSlmReflection,
  detectCrisisLocally,
} from "@/lib/slm-browser";
import { matchReflection } from "@/lib/reflections";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";

const DELIM = "\f";

type Phase = "idle" | "reflecting" | "done";
type SlmState = "idle" | "loading" | "ready" | "error";

export default function ReflectPage() {
  const [issue, setIssue] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [principle, setPrinciple] = useState("");
  const [reflection, setReflection] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [engine, setEngine] = useState("");
  const [slmState, setSlmState] = useState<SlmState>("idle");
  const [crisisMode, setCrisisMode] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const reflectionRef = useRef("");

  // Load SLM on mount
  useEffect(() => {
    async function loadSlm() {
      const status = getSlmStatus();
      if (status === "ready") {
        setSlmState("ready");
        return;
      }
      if (status === "loading") {
        setSlmState("loading");
        return;
      }

      setSlmState("loading");
      const available = await isSlmAvailable();
      setSlmState(available ? "ready" : "error");
    }
    loadSlm();
  }, []);

  // Local crisis detection — instant, no API needed
  const checkCrisis = (text: string): boolean => {
    return detectCrisisLocally(text);
  };

  // Generate reflection using on-device SLM
  const generateLocally = async (text: string): Promise<void> => {
    const grounding = matchReflection(text);
    setPrinciple(grounding.principle);

    const userPrompt = buildUserPrompt(text, grounding);
    const result = await generateSlmReflection(userPrompt, SYSTEM_PROMPT);

    reflectionRef.current = result;
    setReflection(result);
    setEngine("slm-local");
    setPhase("done");
  };

  // Generate reflection using server API (streaming)
  const generateViaApi = async (text: string): Promise<void> => {
    const controller = new AbortController();
    abortRef.current = controller;

    const res = await fetch("/api/reflect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issue: text }),
      signal: controller.signal,
    });

    if (!res.ok || !res.body) {
      throw new Error("The stream could not be opened.");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let headerParsed = false;
    let streamBuffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      streamBuffer += decoder.decode(value, { stream: true });

      if (!headerParsed) {
        const idx = streamBuffer.indexOf(DELIM);
        if (idx === -1) continue;
        const header = streamBuffer.slice(0, idx);
        streamBuffer = streamBuffer.slice(idx + 1);
        try {
          const meta = JSON.parse(header);
          if (meta?.principle) setPrinciple(meta.principle);
          if (meta?.engine) setEngine(meta.engine);
        } catch {
          /* header malformed */
        }
        headerParsed = true;
      }

      if (headerParsed && streamBuffer.length > 0) {
        const chunk = streamBuffer;
        reflectionRef.current += chunk;
        setReflection(reflectionRef.current);
        streamBuffer = "";
      }
    }
  };

  const submit = async () => {
    const text = issue.trim();
    if (!text || phase === "reflecting") return;

    setPhase("reflecting");
    setPrinciple("");
    setReflection("");
    reflectionRef.current = "";
    setError("");
    setSaved(false);
    setEngine("");
    setCrisisMode(false);

    // 1. Check for crisis locally (instant, no API)
    if (checkCrisis(text)) {
      setCrisisMode(true);
      setPhase("idle");
      return;
    }

    try {
      // 2. Try on-device SLM first
      if (slmState === "ready") {
        await generateLocally(text);
      } else {
        // 3. Fall back to server API
        await generateViaApi(text);
      }

      setPhase("done");
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      console.error(err);

      // If SLM failed, try API as fallback
      if (slmState === "ready" && engine === "") {
        try {
          reflectionRef.current = "";
          setReflection("");
          await generateViaApi(text);
          setPhase("done");
          return;
        } catch {
          // Both failed
        }
      }

      setError("The stream was interrupted. Let the water settle, and try again.");
      setPhase("idle");
    } finally {
      abortRef.current = null;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const begin = () => {
    abortRef.current?.abort();
    setIssue("");
    setPhase("idle");
    setPrinciple("");
    setReflection("");
    setError("");
    setSaved(false);
    setEngine("");
    setCrisisMode(false);
  };

  const saveToJournal = () => {
    if (reflection && issue.trim()) {
      addJournal(issue.trim(), reflection, principle, engine || "offline");
      setSaved(true);
    }
  };

  return (
    <PageTransition>
      <main className="page">
        <FloatingElements count={10} speed="slow" />

        <div className="center">
          <Enso />

          <h1 className="prompt">what troubles you?</h1>

          {/* SLM status indicator */}
          <div className="slm-status">
            {slmState === "loading" && (
              <span className="slm-badge slm-loading">loading on-device AI…</span>
            )}
            {slmState === "ready" && (
              <span className="slm-badge slm-ready">on-device AI ready</span>
            )}
            {slmState === "error" && (
              <span className="slm-badge slm-fallback">using cloud AI</span>
            )}
          </div>

          <div className="field">
            <textarea
              className="input"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="say it plainly…"
              rows={2}
              spellCheck
              disabled={phase === "reflecting"}
              aria-label="Describe what troubles you"
            />
            <div className="field-foot">
              {phase === "idle" && (
                <button
                  type="button"
                  className="reflect-btn"
                  onClick={submit}
                  disabled={!issue.trim()}
                >
                  reflect
                </button>
              )}
              {phase === "reflecting" && !reflection && (
                <span className="settling">the water settles…</span>
              )}
              {phase === "done" && (
                <div className="done-actions">
                  {!saved && (
                    <button
                      type="button"
                      className="reflect-btn"
                      onClick={saveToJournal}
                    >
                      save to journal
                    </button>
                  )}
                  {saved && (
                    <span className="saved-note">saved</span>
                  )}
                  <button
                    type="button"
                    className="reflect-btn"
                    onClick={begin}
                  >
                    begin again
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Crisis mode */}
          {crisisMode && (
            <div className="crisis-card" role="alert">
              <p className="crisis-title">You matter. Please reach out.</p>
              <p className="crisis-text">
                What you're feeling is real, and you don't have to go through it alone.
              </p>
              <div className="crisis-resources">
                <p><strong>988 Suicide & Crisis Lifeline</strong></p>
                <p>Call or text <strong>988</strong> (US)</p>
                <p><a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">findahelpline.com</a> (International)</p>
              </div>
              <button type="button" className="reflect-btn" onClick={begin}>
                begin again
              </button>
            </div>
          )}

          {error && <p className="error">{error}</p>}

          {(reflection || principle) && (
            <section className="response" aria-live="polite">
              {principle && <p className="principle">{principle}</p>}
              <div className="reflection">
                {reflection.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              {phase === "done" && reflection && (
                <FeedbackButton
                  input={issue}
                  principle={principle}
                  engine={engine || "offline"}
                />
              )}
            </section>
          )}
        </div>

        <footer className="foot">
          <p className="foot-note">
            A place for reflection, not a substitute for care. In crisis, reach a
            person who can help — in the US, call or text 988.
          </p>
        </footer>
      </main>
    </PageTransition>
  );
}
