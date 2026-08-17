# Tao Wellbeing — System Design & Product Bible

> A complete reference for the Tao Wellbeing AI system — covering product principles, system architecture, AI design, evaluation framework, and continuous improvement loop.
>
> Written for technical, product, and business audiences.

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Product Principles](#2-product-principles)
3. [User Journey](#3-user-journey)
4. [System Architecture](#4-system-architecture)
5. [AI System Design](#5-ai-system-design)
6. [Knowledge Base](#6-knowledge-base)
7. [Reasoning & Matching](#7-reasoning--matching)
8. [Tools & Capabilities](#8-tools--capabilities)
9. [Memory & Storage](#9-memory--storage)
10. [Fine-Tuning & Prompt Engineering](#10-fine-tuning--prompt-engineering)
11. [Evaluation Driven Development (EDD)](#11-evaluation-driven-development-edd)
12. [Golden Dataset](#12-golden-dataset)
13. [Auto-Fix System](#13-auto-fix-system)
14. [Feedback Loop](#14-feedback-loop)
15. [CI/CD Pipeline](#15-cicd-pipeline)
16. [Security & Safety](#16-security--safety)
17. [Tech Stack](#17-tech-stack)
18. [Cost Analysis](#18-cost-analysis)
19. [Future Roadmap](#19-future-roadmap)

---

## 1. Product Vision

**What:** A calm, minimal web app where users share what's on their mind and receive thoughtful responses rooted in Taoist philosophy.

**Why:** Most mental wellness apps are loud, gamified, and clinical. Tao Wellbeing is the opposite — a quiet space for reflection, not diagnosis.

**Who it's for:** Anyone experiencing stress, anxiety, grief, confusion, or everyday emotional weight who wants a gentler alternative to clinical wellness apps.

**Core constraint:** No accounts. No tracking. No cloud. Everything stays in the user's browser.

---

## 2. Product Principles

| Principle | What it means in practice |
|---|---|
| **Privacy first** | No accounts, no databases, no analytics. All data lives in localStorage. No PII is ever sent to a server. |
| **AI with guardrails** | A free LLM generates responses, but a curated library of 15 hand-authored reflections ensures quality even when AI is unavailable. |
| **Continuous improvement** | User feedback (thumbs up/down) flows back into the golden dataset. Evals run on every push. The system self-heals for common failures. |
| **Accessible** | Works offline, supports screen readers, respects `prefers-reduced-motion`. No JavaScript frameworks required for core functionality. |
| **Free forever** | No paid APIs required. Groq free tier covers 14,400 requests/day. Ollama runs locally for offline use. |
| **Taoist grounding** | Every response is rooted in Taoist principles — not CBT, not clinical advice, not generic positivity. |

---

## 3. User Journey

```
1. User lands on home page
   → Sees daily Tao Te Ching quote
   → Checks in with mood (5 emotional states)
   → Sees action cards: Reflect, Breathe, Be Still

2. User taps "Reflect"
   → Types what troubles them (e.g., "I can't stop worrying about work")
   → Taps "reflect" or hits Enter

3. App processes the input:
   → Keyword matching finds the best Taoist principle
   → DistilBERT refines the match (when available)
   → System prompt + user input sent to LLM
   → Response streams in token-by-token

4. User reads the reflection
   → Taps 👍 or 👎 (feedback)
   → Saves to journal (optional)
   → Taps "begin again"

5. Feedback loop (developer side):
   → Negative feedback exported as JSON
   → Imported into golden dataset
   → Evals re-run to verify improvements
   → Changes auto-deployed via CI/CD
```

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Reflect   │  │ Breathe  │  │ Stillness│  │ Journal │ │
│  │ Page      │  │ Page     │  │ Page     │  │ Page    │ │
│  └────┬─────┘  └──────────┘  └──────────┘  └────┬────┘ │
│       │                                          │      │
│  ┌────▼─────┐                              ┌────▼────┐ │
│  │ Feedback  │                              │ Storage │ │
│  │ Button    │                              │ (LS)    │ │
│  └──────────┘                              └─────────┘ │
└───────────────┬─────────────────────────────────────────┘
                │ POST /api/reflect
                │ { issue: "..." }
                ▼
┌─────────────────────────────────────────────────────────┐
│                  SERVER (Next.js API Route)               │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │              PRIORITY ROUTER                     │    │
│  │                                                   │    │
│  │  1. Groq (free hosted) ──── stream response      │    │
│  │  2. Ollama (local)     ──── stream response      │    │
│  │  3. Anthropic (paid)   ──── stream response      │    │
│  │  4. Curated library    ──── stream response      │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │              MATCHING PIPELINE                    │    │
│  │                                                   │    │
│  │  User input ──► Keyword match ──► DistilBERT     │    │
│  │                    │                    │         │    │
│  │                    ▼                    ▼         │    │
│  │              Best principle + curated reflection  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │              PROMPT BUILDER                       │    │
│  │                                                   │    │
│  │  System prompt (Taoist guide)                    │    │
│  │  + User's input                                  │    │
│  │  + Matched principle + curated reflection        │    │
│  │  = Full prompt sent to LLM                       │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 5. AI System Design

### 5.1 Architecture Pattern

**RAG-like with curated retrieval:**
- The system retrieves a relevant Taoist principle + curated reflection
- This context is injected into the LLM prompt
- The LLM generates a personalized response using this as a "starting point"

This is NOT a pure generative system. It's a **retrieval-augmented generation** pattern where the retrieval is hand-curated, not vector-based.

### 5.2 AI Engine Priority

| Priority | Engine | Model | Cost | Latency | Where it runs |
|---|---|---|---|---|---|
| 1 | **Groq** | Llama 3.1 8B | Free (14,400 req/day) | ~1-2s | Groq cloud |
| 2 | **Ollama** | SmolLM2 1.7B | Free | ~3-5s | User's machine |
| 3 | **Anthropic** | Claude Opus 4 | ~$15/1M tokens | ~2-4s | Anthropic cloud |
| 4 | **Curated** | N/A (pre-written) | Free | ~0.5s | Offline |

The system automatically picks the first available engine. If one fails, it falls back to the next.

### 5.3 Streaming Protocol

All engines stream responses using a custom protocol:

```
[JSON header]\f[streaming text body]
```

**Header format:**
```json
{"principle": "wu wei — effortless action", "engine": "groq"}
```

**Body:** Plain text streamed token-by-token. The `\f` (form feed) delimiter separates header from body.

The client parses the header first, then appends body chunks to build the full reflection.

---

## 6. Knowledge Base

### 6.1 Taoist Principles (15 reflections)

Each reflection is hand-authored with:

| Field | Purpose |
|---|---|
| `id` | Unique identifier |
| `principle` | Taoist principle name (e.g., "wu wei — effortless action") |
| `keywords` | Array of trigger words/phrases for matching |
| `body` | 2-3 paragraph reflection in plain English |
| `line` | Closing line from or inspired by the Tao Te Ching |

**The 15 principles:**

| # | Principle | Emotional domain |
|---|---|---|
| 1 | wu wei — effortless action | Anxiety, worry |
| 2 | wu wei — yielding to what is | Control, helplessness |
| 3 | the softness of water | Anger, frustration |
| 4 | returning — the cycle of things | Grief, loss |
| 5 | wu wei — non-striving | Burnout, pressure |
| 6 | stillness before movement | Indecision, confusion |
| 7 | the value of emptiness and rest | Exhaustion, overwhelm |
| 8 | ziran — being one's own nature | Comparison, jealousy |
| 9 | yielding and trust | Fear, vulnerability |
| 10 | stillness as the root | Restlessness, boredom |
| 11 | non-contention | Conflict, relationships |
| 12 | flowing with change | Transition, instability |
| 13 | compassion and the uncarved block | Self-criticism, shame |
| 14 | unity beneath separation | Loneliness, isolation |
| 15 | the way of water | General/fallback |

### 6.2 Tao Te Ching Quotes (50+)

Rotated daily based on day-of-year. Used in the Daily Wisdom card on the home page.

### 6.3 Breathing Patterns (4)

| Pattern | Description |
|---|---|
| Gentle | 4-4-6-2 (calm rhythm) |
| Qi Gong | 4-7-8-0 (deep restoration) |
| Box | 4-4-4-4 (equal rhythm) |
| Ocean | 4-2-6-2 (wave metaphor) |

---

## 7. Reasoning & Matching

### 7.1 Keyword Matching (Primary)

The `matchReflection()` function uses a scoring algorithm:

```typescript
for each reflection:
  score = 0
  for each keyword in reflection.keywords:
    if input.includes(keyword):
      score += keyword.includes(" ") ? 3 : 1  // phrases weighted higher
  if score > bestScore:
    bestScore = score
    best = reflection
return best ?? general
```

**Scoring rules:**
- Single-word match: 1 point
- Multi-word phrase match: 3 points (higher confidence)
- Highest total score wins
- Ties go to the first match (order-dependent)
- No matches → falls back to "the way of water" (general)

### 7.2 DistilBERT Zero-Shot Classification (Secondary)

When no Anthropic key is available, the system uses a local DistilBERT model for refinement:

```typescript
pipeline("zero-shot-classification", "Xenova/distilbert-base-uncased")
```

This runs entirely in the browser/server using ONNX runtime. It classifies the input against all 15 principle labels and picks the highest-confidence match.

**When it's used:**
- Only when Anthropic key is NOT set
- As a secondary refinement after keyword matching
- Falls back to keyword matching if classification fails

### 7.3 Matching Pipeline

```
User input
    │
    ▼
Keyword match ──────────────────► Best principle (score-based)
    │
    │ (if no Anthropic key)
    ▼
DistilBERT zero-shot ──────────► Best principle (confidence-based)
    │
    ▼
Build prompt with principle + curated reflection
    │
    ▼
Send to LLM (Groq / Ollama / Anthropic)
    │
    ▼
Stream response to client
```

---

## 8. Tools & Capabilities

### 8.1 What the AI Can Do

| Capability | How |
|---|---|
| Reflect on user's input | System prompt + user prompt + curated reflection |
| Name a Taoist principle | Provided in the prompt context |
| Explain the principle in plain English | LLM generates based on system prompt |
| End with a Tao Te Ching quote | System prompt instructs this |
| Redirect crisis to resources | System prompt includes safety instructions |

### 8.2 What the AI Cannot Do

| Limitation | Why |
|---|---|
| Diagnose or give medical advice | System prompt explicitly prohibits |
| Remember past conversations | No memory/session state |
| Access external information | No tools, no web search |
| Generate images or media | Text-only responses |
| Access user data from localStorage | Server has no access to client storage |

### 8.3 External Integrations

| Integration | Purpose | Required? |
|---|---|---|
| Groq API | Free LLM hosting | No (optional) |
| Ollama | Local LLM | No (optional) |
| Anthropic API | Paid LLM | No (optional) |
| Vercel | Hosting | No (self-hostable) |
| GitHub | Source control + CI | No (for development) |

---

## 9. Memory & Storage

### 9.1 Client-Side Storage (localStorage)

All user data stays in the browser. No server-side database.

| Key | Data | Max entries |
|---|---|---|
| `tao-mood-history` | Mood check-ins (date, level, label) | Unlimited |
| `tao-journal` | Saved reflections (input, output, principle, engine) | Unlimited |
| `tao-feedback` | Thumbs up/down (input, principle, engine, helpful) | 500 |

### 9.2 Server-Side State

**None.** The server is stateless. Every request is independent. No sessions, no databases, no caching.

### 9.3 Memory Limitations

| Limitation | Impact |
|---|---|
| No conversation history | Each reflection is independent |
| No user profiles | No personalization across sessions |
| No cross-device sync | Data stays on one device |
| Storage quota (~5-10MB) | Old entries may be pruned |

---

## 10. Fine-Tuning & Prompt Engineering

### 10.1 System Prompt

```
You are a quiet guide in the Taoist tradition. A person has shared something
that is weighing on them, and you are here to reflect — not to fix.

How to speak:
- Use simple, clear English. Short sentences. Easy words.
- Calm and warm. Not preachy. Not clinical. Not like a life coach.
- Like a thoughtful friend who reads the Tao Te Ching.

What to do:
- Name one Taoist principle that fits their situation.
- Show how it connects to what they actually said.
- 2 to 4 short paragraphs. Leave space.
- Do NOT give numbered lists, steps, or clinical advice.
- End with one short line from or inspired by the Tao Te Ching.

Safety:
- You are not a doctor or therapist. Do not diagnose.
- If they talk about hurting themselves, gently ask them to reach out
  to a real person first.
```

### 10.2 User Prompt Template

```
Here is what someone shared:

"""
{user's input}
"""

A Taoist reflection that fits their situation:

Principle: {matched principle}
Reflection: {curated reflection body}
Closing line: "{curated closing line}"

Use this as a starting point. Respond in your own simple, warm words —
speaking directly to this person and what they actually said.
You may use or adapt the closing line, or choose another if it fits better.

Now offer your reflection.
```

### 10.3 Prompt Engineering Decisions

| Decision | Rationale |
|---|---|
| "Reflect — not to fix" | Sets the tone immediately. Prevents advice-giving. |
| "Like a thoughtful friend" | Avoids clinical or preachy tone. |
| "2 to 4 short paragraphs" | Prevents walls of text. Leave space. |
| "Do NOT give numbered lists" | Keeps responses human, not robotic. |
| "Use this as a starting point" | LLM adapts the curated reflection, doesn't copy it. |
| Temperature: 0.85 | Balanced — creative enough for warmth, consistent enough for quality. |
| Max tokens: 512 | Keeps responses concise. |

### 10.4 No Fine-Tuning

The system uses **prompt engineering only** — no model fine-tuning. Reasons:
- Llama 3 8B is capable enough with good prompting
- Fine-tuning requires training data, infrastructure, and cost
- Prompt engineering is faster to iterate and debug
- The curated library provides consistent quality regardless of model

---

## 11. Evaluation Driven Development (EDD)

### 11.1 What is EDD?

Evaluation Driven Development is a practice where:
1. You define evals (test cases) with clear pass/fail criteria
2. You run evals to measure quality
3. You fix failures and re-run evals
4. You only deploy when evals pass
5. Evals run continuously to catch regressions

### 11.2 Our EDD Implementation

| EDD Practice | Status | How |
|---|---|---|
| Define evals before coding | **Partial** | We built the app first, then added evals to validate |
| Golden dataset with clear criteria | **Yes** | 79 test cases with expected outputs |
| Run evals on every push | **Yes** | GitHub Actions CI |
| Block deploys on eval failure | **Yes** | Workflow fails → no merge → no deploy |
| Auto-fix common failures | **Yes** | Groq suggests keyword fixes automatically |
| Evals drive what to build next | **Yes** | Failures identify weak spots to improve |

### 11.3 Eval Types

| Eval | What it tests | Method |
|---|---|---|
| **Principle Matching** | Does the right Taoist principle get selected? | Import `matchReflection()`, compare against expected |
| **Crisis Detection** | Are crisis inputs handled with care? | Check principle isn't aggressively categorized |
| **Edge Cases** | Does it handle vague, short, or unusual inputs? | Check function returns valid reflection |
| **Adversarial Robustness** | Does it resist prompt injection and jailbreaks? | Check function doesn't crash |
| **Response Quality** | Is the AI response calm, appropriate, well-structured? | LLM-as-judge (Groq evaluating Groq) |
| **Adversarial LLM** | Does the AI stay in character under attack? | LLM-as-judge checks persona adherence |

---

## 12. Golden Dataset

### 12.1 Structure

```typescript
interface TestCase {
  id: string;                    // Unique identifier
  input: string;                 // What the user types
  expectedPrinciple: string;     // Which principle should match
  category: string;              // Emotional category
  isEdge: boolean;               // Edge case flag
  isAdversarial: boolean;        // Adversarial flag
  isCrisis: boolean;             // Crisis flag
  responseCriteria: {
    mustMentionPrinciple: boolean;
    mustBeCalmTone: boolean;
    mustNotGiveAdvice: boolean;
    mustEndWithQuote: boolean;
    mustRedirectCrisis?: boolean;
    mustNotBreakCharacter?: boolean;
  };
}
```

### 12.2 Coverage

| Category | Count | Examples |
|---|---|---|
| Normal (anxiety, grief, anger, etc.) | 42 | "I can't stop worrying", "My mother passed away" |
| Edge cases | 14 | Single words, emoji, code, non-english, whitespace |
| Adversarial | 15 | Prompt injection, jailbreak, abuse, format attacks |
| Crisis | 8 | Self-harm, hopelessness, overdose |
| **Total** | **79** | |

### 12.3 Why These Categories?

- **Normal:** Covers the 15 emotional domains the app supports
- **Edge cases:** Real users type weird things — single words, emoji, URLs
- **Adversarial:** Users will try to break the AI — we need to be resilient
- **Crisis:** Lives may depend on correct handling. Must not fail here.

---

## 13. Auto-Fix System

### 13.1 How It Works

```
Evals fail
    │
    ▼
auto-fix.ts runs
    │
    ├── For each failed test case:
    │   ├── Read the input and expected principle
    │   ├── Read existing keywords for that principle
    │   ├── Ask Groq: "Suggest 3-5 keywords to fix this"
    │   ├── Add suggested keywords to reflections.ts
    │   └── Re-run matching to verify
    │
    ▼
Re-run full evals
    │
    ├── All pass? → Auto-commit: "auto-fix: add keywords"
    └── Still failing? → Create GitHub Issue for manual review
```

### 13.2 What Can Be Auto-Fixed

| Failure type | Auto-fixable? | How |
|---|---|---|
| Missing keywords | **Yes** | Groq suggests new keywords, adds to reflections.ts |
| Wrong principle mapping | **Partial** | Can add keywords to redirect to correct principle |
| Bad AI response quality | **No** | Needs prompt or model changes — human review |
| Adversarial failure | **No** | Needs security analysis — human review |

### 13.3 Safety Mechanisms

- Auto-fix only modifies `lib/reflections.ts` (keyword arrays)
- Does NOT modify prompts, API routes, or component code
- Re-runs evals to verify fix before committing
- Creates GitHub Issue for anything it can't fix
- `[skip ci]` in commit message prevents infinite loops

---

## 14. Feedback Loop

### 14.1 User-Facing Feedback

After each reflection, users see a simple 👍/👎 button. This is:
- **One tap** — no friction
- **Anonymous** — no accounts needed
- **Local** — stored in localStorage, not sent to any server
- **Contextual** — records what they typed, what principle matched, which engine was used

### 14.2 Developer Feedback Pipeline

```
User taps 👎
    │
    ▼
Feedback stored in localStorage
    │
    ▼
Developer exports feedback (JSON download from Journal page)
    │
    ▼
Run: npx tsx tests/import-feedback.ts feedback.json
    │
    ▼
Negative feedback added to golden dataset as new test cases
    │
    ▼
npm run eval — verify improvements
    │
    ▼
Push to main — GitHub Actions runs evals + auto-fix
    │
    ▼
Deployed to production
```

### 14.3 What Feedback Captures

```json
{
  "id": "m1abc2def",
  "timestamp": "2026-08-17T12:00:00.000Z",
  "input": "I feel anxious about my future",
  "principle": "wu wei — effortless action",
  "engine": "groq",
  "helpful": false
}
```

---

## 15. CI/CD Pipeline

### 15.1 GitHub Actions Workflow

**Trigger:** Every push to `main`, every PR to `main`

**Steps:**

```
1. Checkout code
2. Install dependencies
3. Build app (npm run build)
4. Start server
5. Run evals (principle, crisis, edge, adversarial)
6. If evals fail:
   a. Run auto-fix (Groq suggests keywords)
   b. Re-run evals
   c. If still failing → Create GitHub Issue
   d. If fixed → Auto-commit the fix
7. Run quality evals (LLM-as-judge)
8. Run adversarial LLM evals
```

### 15.2 Branch Protection

- Evals must pass before PR can merge to `main`
- Auto-fix commits include `[skip ci]` to prevent infinite loops
- GitHub Issues created for unfixable failures with `eval-failure` label

### 15.3 Vercel Deployment

- Vercel auto-deploys from `main`
- Only deploys when code merges (after evals pass)
- Environment variable `GROQ_API_KEY` configured in Vercel project settings

---

## 16. Security & Safety

### 16.1 AI Safety

| Measure | Implementation |
|---|---|
| No diagnosis | System prompt: "You are not a doctor or therapist" |
| Crisis redirection | System prompt: "If they talk about hurting themselves, ask them to reach out to a real person" |
| No medical advice | System prompt: "Do NOT give numbered lists, steps, or clinical advice" |
| No data retention | Server is stateless — no conversation history stored |

### 16.2 Adversarial Defenses

| Attack type | Defense |
|---|---|
| Prompt injection | System prompt instructs staying in character |
| Jailbreak attempts | System prompt: "You are a quiet guide in the Taoist tradition" |
| Format injection | System prompt: "Do NOT give numbered lists" |
| Role confusion | System prompt: "You are not a doctor or therapist" |
| Encoding attacks | Input is processed as plain text — no special interpretation |

### 16.3 Data Privacy

| Data | Where it lives | Who can access it |
|---|---|---|
| User's reflections | localStorage | Only the user |
| Mood history | localStorage | Only the user |
| Feedback | localStorage | Only the user |
| Journal entries | localStorage | Only the user |
| API requests | Server memory (ephemeral) | No one (not logged) |

---

## 17. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Server components, API routes, streaming |
| **Language** | TypeScript | Type safety, better DX |
| **UI** | React 19 | Component model, hooks |
| **Styling** | Vanilla CSS | No framework overhead, full control |
| **AI (hosted)** | Groq + Llama 3.1 8B | Free, fast, OpenAI-compatible API |
| **AI (local)** | Ollama + SmolLM2 | Free, offline, privacy-first |
| **AI (paid)** | Anthropic Claude Opus 4 | Highest quality, optional |
| **Offline ML** | DistilBERT (Xenova) | Zero-shot classification, runs in browser |
| **Storage** | localStorage | No server needed, privacy-first |
| **CI/CD** | GitHub Actions | Free for public repos |
| **Hosting** | Vercel | Free tier, auto-deploy from GitHub |

---

## 18. Cost Analysis

### 18.1 Running Costs

| Item | Cost | Notes |
|---|---|---|
| Groq API | **$0** | Free tier: 14,400 req/day |
| Ollama | **$0** | Runs on user's machine |
| Vercel | **$0** | Hobby plan (personal projects) |
| GitHub Actions | **$0** | Free for public repos |
| Domain (optional) | ~$10/year | If you buy a custom domain |
| **Total** | **$0/month** | For typical usage |

### 18.2 Scaling Costs

| Usage level | Groq cost | Vercel cost |
|---|---|---|
| < 14,400 req/day | $0 | $0 |
| 14,400 - 100K req/day | ~$10-50/month | $0 (Hobby) |
| > 100K req/day | ~$100+/month | $20/month (Pro) |

---

## 19. Future Roadmap

### Short-term (1-2 weeks)
- [ ] Fully automate feedback → golden dataset pipeline
- [ ] Add more golden dataset cases from real user feedback
- [ ] Improve response quality eval with more criteria

### Medium-term (1-2 months)
- [ ] Add conversation memory (multi-turn reflections)
- [ ] Support multiple languages
- [ ] Add journal export (PDF/markdown)
- [ ] Implement mood analytics dashboard

### Long-term (3-6 months)
- [ ] Fine-tune a small model on curated reflections
- [ ] Add voice input for reflections
- [ ] Build a community library of Taoist reflections
- [ ] Mobile app (React Native)

---

## Appendix A: File Reference

```
tao-wellbeing/
├── app/
│   ├── page.tsx                 ← Home (daily wisdom, mood, action cards)
│   ├── reflect/page.tsx         ← Reflection tool (streaming UI)
│   ├── breathe/page.tsx         ← Breathing exercises (4 patterns)
│   ├── stillness/page.tsx       ← Meditation timer
│   ├── journal/page.tsx         ← History, mood timeline, feedback export
│   ├── globals.css              ← Full design system (~1100 lines)
│   ├── layout.tsx               ← Root layout (Nav, ThemeToggle)
│   └── api/reflect/route.ts     ← Streaming reflection API
├── components/
│   ├── FeedbackButton.tsx       ← Thumbs up/down
│   ├── FeedbackExport.tsx       ← Export feedback + view stats
│   ├── BreathingCircle.tsx      ← Animated breathing guide
│   ├── MeditationTimer.tsx      ← Timer with SVG ring
│   ├── JournalList.tsx          ← Reflection history
│   ├── MoodCheckIn.tsx          ← Daily mood tracker
│   ├── DailyWisdom.tsx          ← Rotating Tao Te Ching quote
│   ├── Nav.tsx                  ← Bottom navigation
│   ├── Enso.tsx                 ← Animated enso circle
│   ├── FloatingElements.tsx     ← Ambient floating particles
│   ├── PageTransition.tsx       ← Page transition wrapper
│   └── ThemeToggle.tsx          ← Light/dark mode toggle
├── lib/
│   ├── prompt.ts                ← AI system prompt + user prompt builder
│   ├── reflections.ts           ← 15 curated Taoist reflections + matching
│   ├── feedback.ts              ← Anonymous feedback storage
│   ├── quotes.ts                ← 50+ Tao Te Ching quotes
│   ├── breathing.ts             ← 4 breathing pattern configs
│   ├── distilbert.ts            ← Offline zero-shot classification
│   ├── slm.ts                   ← Offline reply builder (fallback)
│   └── storage.ts               ← localStorage persistence (mood + journal)
├── tests/
│   ├── golden-dataset.ts        ← 79 test cases
│   ├── run-evals.ts             ← Eval runner + history tracking
│   ├── auto-fix.ts              ← Auto-fix keyword failures
│   ├── import-feedback.ts       ← Import feedback → golden dataset
│   └── eval-history.json        ← Score trends over time
├── .github/workflows/evals.yml  ← CI: evals + auto-fix on every push
└── public/
```

---

## Appendix B: Key Metrics

| Metric | Current value |
|---|---|
| Golden dataset size | 79 test cases |
| Principle matching accuracy | 100% (42/42) |
| Crisis detection accuracy | 100% (8/8) |
| Edge case handling | 100% (14/14) |
| Adversarial robustness | 100% (15/15) |
| Curated reflections | 15 |
| Tao Te Ching quotes | 50+ |
| Breathing patterns | 4 |
| AI engines supported | 4 (Groq, Ollama, Anthropic, Curated) |
| Monthly cost | $0 |
| External dependencies | 2 (Groq, Vercel) — both free |

---

*This document is a living reference. Update it as the system evolves.*
