"use client";

import { useEffect, useState } from "react";
import Enso from "@/components/Enso";
import FloatingElements from "@/components/FloatingElements";
import PageTransition from "@/components/PageTransition";
import FeedbackButton from "@/components/FeedbackButton";
import { addJournal } from "@/lib/storage";
import {
  isSlmAvailable,
  getSlmStatus,
  getActiveModel,
  getLoadProgress,
  loadModel,
  onSlmProgress,
  generateSlmReflection,
  detectCrisisLocally,
  DEFAULT_MODEL,
  type ModelId,
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
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState("");
  const [activeModel, setActiveModel] = useState<ModelId | null>(null);
  const [reflecting, setReflecting] = useState(false);

  // Load SLM on mount with progress
  useEffect(() => {
    const unsub = onSlmProgress((p) => {
      setDownloadProgress(p.progress);
      setDownloadStatus(p.status);
    });

    async function init() {
      const status = getSlmStatus();
      if (status === "ready") {
        setSlmState("ready");
        setActiveModel(getActiveModel());
        return;
      }
      if (status === "loading") {
        setSlmState("loading");
        return;
      }
      setSlmState("loading");
      const ok = await isSlmAvailable();
      setSlmState(ok ? "ready" : "error");
      setActiveModel(getActiveModel());
    }
    init();

    return unsub;
  }, []);

  const checkCrisis = (text: string): boolean => {
    return detectCrisisLocally(text);
  };

  const generateLocally = async (text: string): Promise<void> => {
    const grounding = matchReflection(text);
    setPrinciple(grounding.principle);
    const userPrompt = buildUserPrompt(text, grounding);
    const result = await generateSlmReflection(userPrompt, SYSTEM_PROMPT);
    setReflection(result);
    setEngine("slm-local");
  };

  const generateViaApi = async (text: string): Promise<void> => {
    const res = await fetch("/api/reflect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issue: text }),
    });

    if (!res.ok || !res.body) {
      throw new Error("The stream could not be opened.");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let headerParsed = false;
    let streamBuffer = "";
    let fullText = "";

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
        } catch { /* malformed */ }
        headerParsed = true;
      }

      if (headerParsed && streamBuffer.length > 0) {
        fullText += streamBuffer;
        setReflection(fullText);
        streamBuffer = "";
      }
    }
  };

  const submit = async () => {
    const text = issue.trim();
    if (!text || phase === "reflecting") return;

    setPhase("reflecting");
    setReflecting(true);
    setPrinciple("");
    setReflection("");
    setError("");
    setSaved(false);
    setEngine("");
    setCrisisMode(false);

    if (checkCrisis(text)) {
      setCrisisMode(true);
      setPhase("idle");
      setReflecting(false);
      return;
    }

    try {
      if (slmState === "ready") {
        await generateLocally(text);
      } else {
        await generateViaApi(text);
      }
      setPhase("done");
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      console.error(err);

      if (slmState === "ready" && engine === "") {
        try {
          setReflection("");
          await generateViaApi(text);
          setPhase("done");
          setReflecting(false);
          return;
        } catch { /* both failed */ }
      }

      setError("The stream was interrupted. Let the water settle, and try again.");
      setPhase("idle");
    } finally {
      setReflecting(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const begin = () => {
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

  const upgradeModel = async () => {
    setSlmState("loading");
    const ok = await loadModel("qwen2-0.5b");
    setSlmState(ok ? "ready" : "error");
    setActiveModel(getActiveModel());
  };

  const isDownloading = slmState === "loading" && downloadStatus === "downloading";
  const isLoadingModel = slmState === "loading" && downloadStatus === "loading";

  return (
    <PageTransition>
      <main className="page">
        <FloatingElements count={12} speed="slow" />

        <div className="center">
          <Enso />

          <h1 className="prompt">what troubles you?</h1>

          {/* SLM status */}
          <div className="slm-status">
            {isDownloading && (
              <div className="slm-download">
                <span className="slm-badge slm-loading">
                  downloading on-device AI ({downloadProgress}%)
                </span>
                <div className="slm-progress-bar">
                  <div
                    className="slm-progress-fill"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            )}
            {isLoadingModel && !isDownloading && (
              <span className="slm-badge slm-loading">loading model…</span>
            )}
            {slmState === "ready" && activeModel === "distilgpt2" && (
              <div className="slm-ready-row">
                <span className="slm-badge slm-ready">on-device AI ready</span>
                <button
                  type="button"
                  className="slm-upgrade-btn"
                  onClick={upgradeModel}
                >
                  upgrade quality (~200MB)
                </button>
              </div>
            )}
            {slmState === "ready" && activeModel === "qwen2-0.5b" && (
              <span className="slm-badge slm-ready">on-device AI ready (enhanced)</span>
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
              {reflecting && !reflection && (
                <div className="reflecting-animation">
                  <span className="reflecting-dot" />
                  <span className="reflecting-dot" />
                  <span className="reflecting-dot" />
                </div>
              )}
              {phase === "done" && (
                <div className="done-actions">
                  {!saved && (
                    <button type="button" className="reflect-btn" onClick={saveToJournal}>
                      save to journal
                    </button>
                  )}
                  {saved && <span className="saved-note">saved</span>}
                  <button type="button" className="reflect-btn" onClick={begin}>
                    begin again
                  </button>
                </div>
              )}
            </div>
          </div>

          {crisisMode && (
            <div className="crisis-card" role="alert">
              <div className="crisis-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
              </div>
              <p className="crisis-title">you matter. please reach out.</p>
              <p className="crisis-text">
                what you&apos;re feeling is real, and you don&apos;t have to go through it alone.
              </p>
              <div className="crisis-resources">
                <p><strong>988 Suicide & Crisis Lifeline</strong></p>
                <p>call or text <strong>988</strong> (US)</p>
                <p><a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">findahelpline.com</a> (international)</p>
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
            a place for reflection, not a substitute for care. in crisis, reach a
            person who can help — in the US, call or text 988.
          </p>
        </footer>
      </main>
    </PageTransition>
  );
}
