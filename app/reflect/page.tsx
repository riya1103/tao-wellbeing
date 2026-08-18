"use client";

import { useEffect, useRef, useState } from "react";
import Enso from "@/components/Enso";
import FloatingElements from "@/components/FloatingElements";
import PageTransition from "@/components/PageTransition";
import FeedbackButton from "@/components/FeedbackButton";
import { addJournal } from "@/lib/storage";
import {
  createConversation,
  addMessage,
  getMessagesForAI,
  getConversation,
  type Message,
} from "@/lib/conversation";
import {
  isSlmAvailable,
  getSlmStatus,
  getActiveModel,
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

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  principle?: string;
  engine?: string;
}

export default function ReflectPage() {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [engine, setEngine] = useState("");
  const [slmState, setSlmState] = useState<SlmState>("idle");
  const [crisisMode, setCrisisMode] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState("");
  const [activeModel, setActiveModel] = useState<ModelId | null>(null);
  const [reflecting, setReflecting] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load SLM on mount
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

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const checkCrisis = (text: string): boolean => {
    return detectCrisisLocally(text);
  };

  const generateLocally = async (
    text: string,
    history: { role: string; content: string }[],
  ): Promise<{ content: string; principle: string }> => {
    const grounding = matchReflection(text);
    const userPrompt = buildUserPrompt(text, grounding);

    // For multi-turn, we build a simple context
    let fullPrompt = userPrompt;
    if (history.length > 0) {
      const context = history
        .map((m) => `${m.role === "user" ? "Person" : "Guide"}: ${m.content}`)
        .join("\n\n");
      fullPrompt = `Previous conversation:\n${context}\n\nNew message:\n${userPrompt}`;
    }

    const result = await generateSlmReflection(fullPrompt, SYSTEM_PROMPT);
    return { content: result, principle: grounding.principle };
  };

  const generateViaApi = async (
    text: string,
    history: { role: string; content: string }[],
  ): Promise<{ content: string; principle: string; engine: string }> => {
    const res = await fetch("/api/reflect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issue: text, history }),
    });

    if (!res.ok || !res.body) {
      throw new Error("The stream could not be opened.");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let headerParsed = false;
    let streamBuffer = "";
    let fullText = "";
    let principle = "";
    let engineName = "";

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
          if (meta?.principle) principle = meta.principle;
          if (meta?.engine) engineName = meta.engine;
        } catch { /* malformed */ }
        headerParsed = true;
      }

      if (headerParsed && streamBuffer.length > 0) {
        fullText += streamBuffer;
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "assistant") {
            last.content = fullText;
          }
          return updated;
        });
        streamBuffer = "";
      }
    }

    return { content: fullText, principle, engine: engineName };
  };

  const submit = async () => {
    const text = input.trim();
    if (!text || phase === "reflecting") return;

    // Create conversation if new
    let convId = conversationId;
    if (!convId) {
      const conv = createConversation();
      convId = conv.id;
      setConversationId(convId);
    }

    setInput("");
    setPhase("reflecting");
    setReflecting(true);
    setError("");
    setSaved(false);
    setCrisisMode(false);

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    addMessage(convId, { role: "user", content: text });

    // Check for crisis
    if (checkCrisis(text)) {
      setCrisisMode(true);
      setPhase("idle");
      setReflecting(false);
      return;
    }

    // Add placeholder for assistant
    const assistantMsg: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, assistantMsg]);

    // Get conversation history for AI
    const history = getMessagesForAI(convId).slice(0, -1); // Exclude the just-added user message

    try {
      if (slmState === "ready") {
        const result = await generateLocally(text, history);
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "assistant") {
            last.content = result.content;
            last.principle = result.principle;
            last.engine = "slm-local";
          }
          return updated;
        });
        addMessage(convId, {
          role: "assistant",
          content: result.content,
          principle: result.principle,
          engine: "slm-local",
        });
        setEngine("slm-local");
      } else {
        const result = await generateViaApi(text, history);
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "assistant") {
            last.content = result.content;
            last.principle = result.principle;
            last.engine = result.engine;
          }
          return updated;
        });
        addMessage(convId, {
          role: "assistant",
          content: result.content,
          principle: result.principle,
          engine: result.engine,
        });
        setEngine(result.engine);
      }
      setPhase("done");
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      console.error(err);

      // Remove empty assistant message on error
      setMessages((prev) => prev.filter((m) => m.content !== ""));

      if (slmState === "ready" && engine === "") {
        try {
          const result = await generateViaApi(text, history);
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === "assistant") {
              last.content = result.content;
              last.principle = result.principle;
              last.engine = result.engine;
            }
            return updated;
          });
          addMessage(convId, {
            role: "assistant",
            content: result.content,
            principle: result.principle,
            engine: result.engine,
          });
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

  const beginNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    setInput("");
    setPhase("idle");
    setError("");
    setSaved(false);
    setEngine("");
    setCrisisMode(false);
    inputRef.current?.focus();
  };

  const saveToJournal = () => {
    if (messages.length > 0 && conversationId) {
      const userMsg = messages.find((m) => m.role === "user")?.content || "";
      const assistantMsg = messages.find((m) => m.role === "assistant");
      if (assistantMsg) {
        addJournal(
          userMsg,
          assistantMsg.content,
          assistantMsg.principle || "",
          assistantMsg.engine || "offline",
        );
        setSaved(true);
      }
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
  const hasConversation = messages.length > 0;

  return (
    <PageTransition>
      <main className="page">
        <FloatingElements count={12} speed="slow" />

        <div className="center">
          {/* Show enso only when no conversation */}
          {!hasConversation && (
            <>
              <Enso />
              <h1 className="prompt">what troubles you?</h1>
            </>
          )}

          {/* SLM status */}
          {!hasConversation && (
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
          )}

          {/* Chat messages */}
          {hasConversation && (
            <div className="chat-container">
              <div className="chat-messages">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`chat-message chat-${msg.role}`}
                  >
                    {msg.role === "assistant" && msg.principle && (
                      <span className="chat-principle">{msg.principle}</span>
                    )}
                    <div className="chat-bubble">
                      {msg.content.split("\n\n").map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                      {msg.role === "assistant" && !msg.content && reflecting && (
                        <div className="reflecting-animation">
                          <span className="reflecting-dot" />
                          <span className="reflecting-dot" />
                          <span className="reflecting-dot" />
                        </div>
                      )}
                    </div>
                    {msg.role === "assistant" && msg.content && phase === "done" && msg === messages[messages.length - 1] && (
                      <FeedbackButton
                        input={messages.find((m) => m.role === "user")?.content || ""}
                        principle={msg.principle || ""}
                        engine={msg.engine || "offline"}
                      />
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Crisis mode */}
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
              <button type="button" className="reflect-btn" onClick={beginNewConversation}>
                begin again
              </button>
            </div>
          )}

          {error && <p className="error">{error}</p>}

          {/* Input area */}
          <div className={`chat-input-area ${hasConversation ? "chat-input-compact" : ""}`}>
            <textarea
              ref={inputRef}
              className="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={hasConversation ? "continue reflecting…" : "say it plainly…"}
              rows={hasConversation ? 1 : 2}
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
                  disabled={!input.trim()}
                >
                  {hasConversation ? "continue" : "reflect"}
                </button>
              )}
              {reflecting && (
                <div className="reflecting-animation">
                  <span className="reflecting-dot" />
                  <span className="reflecting-dot" />
                  <span className="reflecting-dot" />
                </div>
              )}
              {phase === "done" && hasConversation && (
                <div className="done-actions">
                  {!saved && (
                    <button type="button" className="reflect-btn" onClick={saveToJournal}>
                      save to journal
                    </button>
                  )}
                  {saved && <span className="saved-note">saved</span>}
                  <button type="button" className="reflect-btn" onClick={beginNewConversation}>
                    new conversation
                  </button>
                </div>
              )}
            </div>
          </div>
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
