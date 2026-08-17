<div align="center">

# ☯ Tao Wellbeing

**A quiet place to reflect.**

*Grounded in 2,500 years of Taoist wisdom. Built for modern minds.*

[![Deploy on Vercel](https://img.shields.io/badge/Deploy-on_Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/riya1103/tao-wellbeing)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Built_with-Next.js_15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
![Evals](https://img.shields.io/badge/Evals-100%25-brightgreen?style=for-the-badge)

</div>

---

Most mental wellness apps are loud. Gamified. Clinical.

Tao Wellbeing is the opposite.

It's a calm, minimal space where you can say what's on your mind and receive a thoughtful response rooted in Taoist philosophy — not advice, not a diagnosis, just reflection.

**No accounts. No tracking. No cloud. Everything stays in your browser.**

---

## ✨ What's Inside

<br>

> **Reflect** — Type what troubles you. Receive a calm, grounded response
> powered by Taoist principles — explained in plain language.

> **Breathe** — Four guided breathing patterns with an animated circle
> that expands and contracts with your breath.

> **Be Still** — A meditation timer with ambient floating particles
> and a circular progress ring.

> **Mood** — Check in daily with five emotional states.
> Track how you feel over time.

> **Journal** — Save reflections. Browse your history.
> See your mood on a clean timeline.

> **Daily Wisdom** — A rotating Tao Te Ching quote
> that changes each morning.

---

## 🌊 How It Works

```
You share what's on your mind
        ↓
The app matches it to a Taoist principle:
  • wu wei (effortless action)
  • ziran (naturalness)
  • the softness of water
  • returning (the cycle of things)
  • stillness, emptiness, non-contention
        ↓
A prompt is sent to the AI with the principle, a curated reflection, and your words
        ↓
You receive a reflection — calm, clear, personal
```

**AI engine priority** (the app picks the first available):

| Priority | Engine | Cost | Where it runs |
|---|---|---|---|
| 1 | **Groq + Llama 3 8B** | Free (14,400 req/day) | Groq cloud |
| 2 | **Ollama + SmolLM2** | Free | Your local machine |
| 3 | **Curated library** | Free | Offline, no API needed |

---

## 🧪 Eval Results

Every response is tested against a golden dataset of 79 test cases covering normal inputs, edge cases, adversarial attacks, and crisis scenarios.

| Eval | Pass Rate |
|---|---|
| Principle Matching | **42/42 (100%)** |
| Crisis Detection | **8/8 (100%)** |
| Edge Cases | **14/14 (100%)** |
| Adversarial Robustness | **15/15 (100%)** |

Evals run automatically on every push via GitHub Actions.

```bash
npm run eval              # all evals
npm run eval:principle    # principle matching
npm run eval:crisis       # crisis detection
npm run eval:quality      # LLM-as-judge (needs GROQ_API_KEY)
```

---

## 🛠 Tech Stack

| | |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **UI** | React 19 |
| **Styling** | Vanilla CSS — no framework |
| **AI (hosted)** | Groq + Llama 3.1 8B (free, streaming) |
| **AI (local)** | Ollama + SmolLM2 (free, offline) |
| **Offline ML** | DistilBERT zero-shot classification |
| **Storage** | localStorage — nothing leaves your browser |
| **Deploy** | Vercel |

---

## 🚀 Quick Start

```bash
git clone https://github.com/riya1103/tao-wellbeing.git
cd tao-wellbeing
npm install
npm run dev
```

Open **http://localhost:3000**

### Free AI on Vercel (recommended)

1. Get a free API key at [console.groq.com](https://console.groq.com) (no credit card)
2. In Vercel → your project → **Settings** → **Environment Variables**
3. Add `GROQ_API_KEY` = your key
4. Redeploy

### Free AI on your machine

```bash
# Install Ollama: https://ollama.com
ollama pull smollm2
# Start the app
npm run dev
```

### Offline mode

No API key? No problem. The app uses a curated library of 15 Taoist reflections that work entirely offline.

---

## 📂 Project Structure

```
tao-wellbeing/
├── app/
│   ├── page.tsx                 ← Home
│   ├── reflect/page.tsx         ← Reflection tool (streaming UI)
│   ├── breathe/page.tsx         ← Breathing exercises
│   ├── stillness/page.tsx       ← Meditation timer
│   ├── journal/page.tsx         ← History & mood timeline
│   └── api/reflect/route.ts     ← Streaming reflection API
│       ├── Groq (free hosted LLM)
│       ├── Ollama (local LLM)
│       ├── Anthropic (paid, optional)
│       └── Curated fallback (offline)
├── components/                  ← UI components
├── lib/
│   ├── prompt.ts                ← AI system prompt (Taoist guide)
│   ├── reflections.ts           ← 15 curated Taoist reflections
│   ├── quotes.ts                ← 50+ Tao Te Ching quotes
│   ├── breathing.ts             ← Breathing pattern configs
│   ├── distilbert.ts            ← Offline intent matching
│   ├── slm.ts                   ← Offline reply builder
│   └── storage.ts               ← localStorage persistence
├── tests/
│   ├── golden-dataset.ts        ← 79 test cases for evals
│   └── run-evals.ts             ← Eval runner (principle, crisis, quality, adversarial)
├── .github/workflows/evals.yml  ← CI: runs evals on every push
└── public/
```

---

## 💡 Why Taoism?

Most wellness apps borrow from CBT or Buddhist mindfulness.

Taoism offers something different:

- **Don't force it.** Let things unfold.
- **Be like water.** Soft things outlast hard things.
- **Emptiness has value.** Rest isn't laziness — it's where strength returns.
- **You are enough.** Stop comparing. Start being.

These aren't just ideas. They're the foundation of every response this app gives.

---

## 📱 PWA Ready

Works as a home screen app on iOS and Android.
No app store needed.

---

## 🆘 Crisis Resources

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
