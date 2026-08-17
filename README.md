# Tao Wellbeing

> A quiet digital space for reflection, breathing, and stillness — grounded in 2,500-year-old Taoist wisdom.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## Why This Exists

Most mental wellness apps are clinical, gamified, or loud. Tao Wellbeing takes the opposite approach — it's a calm, minimal space where people can reflect on what's weighing on them, practice guided breathing, sit in stillness, and track their inner state over time.

Every response is grounded in a real Taoist principle — *wu wei* (effortless action), *ziran* (naturalness), the softness of water — explained in plain language anyone can understand.

---

## What's Inside

| Feature | What it does |
|---|---|
| **Reflect** | Type what troubles you. Get a thoughtful response grounded in a Taoist principle — powered by Claude AI, or a curated offline library when no API key is set. |
| **Breathe** | Four guided breathing patterns (Gentle, Qi Gong, Box, Ocean) with an animated circle that expands and contracts in real time. |
| **Be Still** | Meditation timer (3–20 minutes) with a circular progress ring and ambient floating particles. |
| **Mood Check-in** | Five emotional states (serene → troubled) logged daily to track how you feel over time. |
| **Journal** | Save reflections and browse your history. Mood entries shown on a clean timeline. |
| **Daily Wisdom** | A rotating Tao Te Ching quote that changes each morning. |

---

## Architecture

```
tao-wellbeing/
├── app/
│   ├── page.tsx              # Home — wisdom, mood, quick actions
│   ├── reflect/page.tsx      # Core reflection tool
│   ├── breathe/page.tsx      # Guided breathing
│   ├── stillness/page.tsx    # Meditation timer
│   ├── journal/page.tsx      # Reflections + mood history
│   ├── api/reflect/route.ts  # Streaming reflection API
│   ├── layout.tsx            # Root layout + nav
│   └── globals.css           # Full design system
├── components/
│   ├── BreathingCircle.tsx   # Animated breathing guide
│   ├── MeditationTimer.tsx   # Timer with SVG ring
│   ├── MoodCheckIn.tsx       # 5-state mood picker
│   ├── JournalList.tsx       # Saved entries + timeline
│   ├── DailyWisdom.tsx       # Daily rotating quote
│   ├── Nav.tsx               # Bottom navigation
│   ├── FloatingElements.tsx  # Ambient particles
│   ├── PageTransition.tsx    # Ink-wash page transitions
│   ├── Enso.tsx              # Zen brush circle SVG
│   └── ThemeToggle.tsx       # Light/dark mode
├── lib/
│   ├── reflections.ts        # 15 curated Taoist reflections
│   ├── prompt.ts             # AI system prompt
│   ├── slm.ts                # Offline response builder
│   ├── storage.ts            # localStorage persistence
│   ├── quotes.ts             # 50+ Tao Te Ching quotes
│   └── breathing.ts          # Breathing pattern configs
└── public/
    └── manifest.json         # PWA manifest
```

---

## Design Principles

- **Rice paper and sumi ink** — warm off-white backgrounds, deep ink text, faded bamboo accents
- **Sparse by design** — every element earns its place; silence is part of the interface
- **No accounts, no cloud** — all data stays in the browser via localStorage
- **Works offline** — the curated reflection library runs entirely on the client
- **Accessible** — respects `prefers-reduced-motion`, semantic HTML, keyboard-navigable
- **Dark mode** — toggle between light (rice paper) and dark (night ink) themes

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Install and run

```bash
git clone https://github.com/riya1103/tao-wellbeing.git
cd tao-wellbeing
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional: AI-powered reflections

The app works fully without an API key using its curated offline library. For personalized Claude AI responses:

1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
2. Create `.env.local`:

```bash
ANTHROPIC_API_KEY=your-key-here
```

3. Restart the dev server

---

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/riya1103/tao-wellbeing)

1. Push to GitHub
2. Import repo on [vercel.com/new](https://vercel.com/new)
3. Deploy — zero configuration needed
4. Optionally add `ANTHROPIC_API_KEY` in project settings

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server components, streaming, file-based routing |
| Language | TypeScript | Type safety across the entire codebase |
| UI | React 19 | Server + client components, concurrent features |
| Styling | Vanilla CSS | Zero dependencies, full control, small bundle |
| AI | Anthropic Claude (optional) | Calm, thoughtful tone that matches the app's voice |
| Offline ML | DistilBERT (Xenova) | Zero-shot classification for reflection matching |
| Storage | localStorage | No backend needed, privacy-first |
| Hosting | Vercel | Zero-config Next.js deployment |

---

## Key Decisions

**Why no Tailwind?** — The design is deeply custom (brush strokes, breathing animations, ink-wash transitions). Vanilla CSS gives full control without fighting a utility framework.

**Why no database?** — Mental health data is deeply personal. Keeping everything in the browser means no server stores user thoughts. Close the tab, and it's gone.

**Why Taoism?** — Most wellness apps borrow from CBT or mindfulness (Buddhist). Taoism offers a different lens: don't force, be like water, embrace emptiness. It's underused and deeply practical.

**Why offline-first?** — Not everyone has an API key, and the core experience shouldn't require one. The curated library of 15 reflections covers anxiety, anger, loss, burnout, comparison, fear, loneliness, and more — each grounded in a real principle.

---

## Crisis Resources

This app is a space for reflection, not a substitute for professional care. If you or someone you know is in crisis:

- **US:** Call or text **988** (Suicide & Crisis Lifeline)
- **International:** [findahelpline.com](https://findahelpline.com)

---

## License

MIT — do whatever you want with it.
