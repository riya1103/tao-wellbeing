<div align="center">

# ☯ Tao Wellbeing

**A calm, AI-powered space for reflection.**

*No accounts. No tracking. No cloud. No internet required.*

[![Deploy on Vercel](https://img.shields.io/badge/Deploy-on_Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/riya1103/tao-wellbeing)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Built_with-Next.js_15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
![Evals](https://img.shields.io/badge/Evals-100%25-brightgreen?style=for-the-badge)

</div>

---

## The Problem

Most mental wellness apps are loud. Gamified. Clinical.

They turn emotional well-being into a streak to maintain, a badge to earn, or a diagnosis to receive. They collect your data. They push notifications. They feel like work.

**Tao Wellbeing is the opposite.** A quiet, minimal space where you can say what's on your mind and receive a thoughtful response — not advice, not a diagnosis, just reflection.

---

## What It Does

| Feature | What the user gets |
|---|---|
| **Reflect** | Type what troubles you. Receive a calm, grounded response rooted in Taoist philosophy — explained in plain language. |
| **Breathe** | Four guided breathing patterns with an animated circle that expands and contracts with your breath. |
| **Be Still** | A meditation timer with ambient floating particles and a circular progress ring. |
| **Mood** | Check in daily with five emotional states. Track how you feel over time. |
| **Journal** | Save reflections. Browse your history. See your mood on a clean timeline. |
| **Daily Wisdom** | A rotating Tao Te Ching quote that changes each morning. |

---

## How the AI Works

```
You share what's on your mind
        ↓
Keyword matching finds the best Taoist principle:
  • wu wei (effortless action)         • ziran (naturalness)
  • the softness of water              • returning (the cycle of things)
  • stillness, emptiness, non-contention
        ↓
The principle + a curated reflection + your words are sent to the AI
        ↓
The AI generates a calm, personal response in plain English
        ↓
You tap 👍 or 👎 — feedback improves future responses
```

### AI Engine — The Offline-First Stack

The app picks the best available engine. **No internet? No problem.**

| Priority | Engine | Model | Cost | Latency | Works Offline |
|---|---|---|---|---|---|
| 1 | **On-device SLM** | Qwen2 0.5B (ONNX) | Free | ~2-5s | **Yes** |
| 2 | **Groq** | Llama 3.1 8B | Free (14,400 req/day) | ~1-2s | No |
| 3 | **Ollama** | SmolLM2 1.7B | Free (runs locally) | ~3-5s | **Yes** |
| 4 | **Curated library** | 15 hand-authored reflections | Free | ~0s | **Yes** |

**The key insight:** On-device SLM runs a real language model **in your browser** using WebAssembly. No server. No API key. No data leaves your device. Works on a plane, in a tunnel, anywhere.

### Crisis Detection — Always Local

Crisis language is detected **instantly** on-device before any AI call:

```
User types crisis language
        ↓
Local keyword detection (0ms, no API)
        ↓
Crisis resources shown immediately
        ↓
No sensitive data sent to any server
```

### The System Prompt

> You are a quiet guide in the Taoist tradition. A person has shared something that is weighing on them, and you are here to reflect — not to fix. Use simple, clear English. Short sentences. Easy words. Calm and warm. Not preachy. Not clinical. Like a thoughtful friend who reads the Tao Te Ching.

---

## Why On-Device AI Matters

| With cloud AI | With on-device SLM |
|---|---|
| Needs internet | **Works anywhere** |
| Data sent to servers | **Data never leaves your device** |
| API costs at scale | **Free forever** |
| Latency depends on network | **Consistent speed** |
| Government blocks = dead app | **Uncensorable** |

**This is what "privacy first" actually looks like.**

---

## AI Quality System

### Golden Dataset — 79 Test Cases

Every input is tested against a curated dataset covering:

| Category | Count | Examples |
|---|---|---|
| Normal inputs | 42 | Anxiety, grief, anger, burnout, loneliness, indecision |
| Edge cases | 14 | Single words, emoji, URLs, code, non-English, whitespace |
| Adversarial attacks | 15 | Prompt injection, jailbreak, abuse, format attacks |
| Crisis scenarios | 8 | Self-harm, hopelessness, overdose |

### Eval Results

| Eval | What it tests | Pass Rate |
|---|---|---|
| Principle Matching | Does the right Taoist principle get selected? | **42/42 (100%)** |
| Crisis Detection | Are crisis inputs handled with care? | **8/8 (100%)** |
| Edge Cases | Does it handle vague, short, or unusual inputs? | **14/14 (100%)** |
| Adversarial Robustness | Does it resist prompt injection and jailbreaks? | **15/15 (100%)** |

### Continuous Improvement Loop

```
User taps 👍 or 👎
        ↓
Negative feedback exported as JSON
        ↓
Auto-fix script asks Groq to suggest new keywords
        ↓
Keywords added to matching system
        ↓
Evals re-run to verify improvement
        ↓
GitHub Actions validates on every push
        ↓
Deployed to production
```

---

## Product Principles

| Principle | What it means |
|---|---|
| **Offline-first** | Full AI responses without internet. On-device SLM + curated fallback. |
| **Privacy first** | No accounts, no databases, no analytics. Everything lives in `localStorage`. No data leaves your device. |
| **AI with guardrails** | On-device SLM generates responses, but a curated library ensures quality even if the model fails. |
| **Continuous improvement** | User feedback flows into the golden dataset. Evals run on every push. The system self-heals for common failures. |
| **Accessible** | Works offline. Supports screen readers. Respects `prefers-reduced-motion`. |
| **Free forever** | No paid APIs required. On-device SLM is free. Groq free tier covers 14,400 req/day. |

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 15 | Server components, API routes, streaming |
| **Language** | TypeScript | Type safety, better DX |
| **UI** | React 19 | Component model, hooks |
| **Styling** | Vanilla CSS | No framework overhead, full control |
| **AI (on-device)** | Qwen2 0.5B (ONNX Runtime) | Runs in browser, free, private |
| **AI (hosted)** | Groq + Llama 3.1 8B | Free, fast, OpenAI-compatible API |
| **AI (local)** | Ollama + SmolLM2 | Free, offline, privacy-first |
| **Offline ML** | DistilBERT (Xenova) | Zero-shot classification, runs in browser |
| **Storage** | localStorage | No server needed, privacy-first |
| **CI/CD** | GitHub Actions + Vercel | Free for public repos |

**Monthly cost: $0**

---

## Quick Start

```bash
git clone https://github.com/riya1103/tao-wellbeing.git
cd tao-wellbeing
npm install
npm run dev
```

Open **http://localhost:3000**

### Free AI on Vercel

1. Get a free API key at [console.groq.com](https://console.groq.com) (no credit card)
2. In Vercel → your project → **Settings** → **Environment Variables**
3. Add `GROQ_API_KEY` = your key
4. Redeploy

### Free AI on your machine

```bash
# Install Ollama: https://ollama.com
ollama pull smollm2
npm run dev
```

### Run Evals

```bash
npm run eval              # all evals
npm run eval:principle    # principle matching
npm run eval:crisis       # crisis detection
npm run eval:quality      # LLM-as-judge (needs GROQ_API_KEY)
npm run eval -- --history # view score trends
npm run eval:fix          # auto-fix keyword failures
```

---

## Project Structure

```
tao-wellbeing/
├── app/
│   ├── page.tsx                 ← Home
│   ├── reflect/page.tsx         ← Reflection tool (on-device SLM + streaming)
│   ├── breathe/page.tsx         ← Breathing exercises
│   ├── stillness/page.tsx       ← Meditation timer
│   ├── journal/page.tsx         ← History, mood timeline, feedback
│   └── api/reflect/route.ts     ← Streaming reflection API (Groq/Ollama/Anthropic)
├── components/
│   ├── FeedbackButton.tsx       ← Thumbs up/down
│   ├── FeedbackExport.tsx       ← Export feedback + stats
│   ├── BreathingCircle.tsx      ← Animated breathing guide
│   ├── MeditationTimer.tsx      ← Timer with SVG ring
│   └── Nav.tsx                  ← Bottom navigation
├── lib/
│   ├── slm-browser.ts           ← On-device SLM (Qwen2 0.5B via ONNX)
│   ├── prompt.ts                ← AI system prompt
│   ├── reflections.ts           ← 15 curated Taoist reflections
│   ├── feedback.ts              ← Anonymous feedback storage
│   ├── distilbert.ts            ← Offline intent matching
│   └── storage.ts               ← localStorage persistence
├── tests/
│   ├── golden-dataset.ts        ← 79 test cases
│   ├── run-evals.ts             ← Eval runner + history
│   ├── auto-fix.ts              ← Auto-fix keyword failures
│   └── import-feedback.ts       ← Import feedback → golden dataset
├── .github/workflows/evals.yml  ← CI: evals + auto-fix
└── public/
```

---

## Why Taoism?

Most wellness apps borrow from CBT or Buddhist mindfulness.

Taoism offers something different:

- **Don't force it.** Let things unfold.
- **Be like water.** Soft things outlast hard things.
- **Emptiness has value.** Rest isn't laziness — it's where strength returns.
- **You are enough.** Stop comparing. Start being.

These aren't just ideas. They're the foundation of every response this app gives.

---

## PWA Ready

Works as a home screen app on iOS and Android. No app store needed.

---

## Crisis Resources

This is a space for reflection, not a substitute for professional care.

| Region | Contact |
|---|---|
| 🇺🇸 US | Call or text **988** |
| 🌍 International | [findahelpline.com](https://findahelpline.com) |

---

<div align="center">

*"The journey of a thousand miles begins beneath one's feet."*
— Lao Tzu, Tao Te Ching

</div>
