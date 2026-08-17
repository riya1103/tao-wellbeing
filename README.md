<div align="center">

# ☯ Tao Wellbeing

**a quiet place to think**

*no accounts. no tracking. no cloud. just you and your thoughts.*

[![Deploy on Vercel](https://img.shields.io/badge/Deploy-on_Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/riya1103/tao-wellbeing)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Built_with-Next.js_15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
![Evals](https://img.shields.io/badge/Evals-100%25-brightgreen?style=for-the-badge)

</div>

---

## why this exists

most wellness apps want you to be productive about your feelings. streaks. badges. daily check-ins that feel like homework.

this isn't that.

this is a quiet corner of the internet where you can say what's actually on your mind — the messy, contradictory, "i don't even know why i'm upset" stuff — and get a real response. not advice. not a diagnosis. just a reflection.

built on taoist principles that have helped people for 2,500 years. explained in plain english. no jargon. no robes. just the good stuff.

---

## what you can do

**reflect** — type what's weighing on you. the app listens and reflects it back through the lens of taoist wisdom. like talking to a friend who's read the tao te ching a few too many times.

**breathe** — four breathing patterns with a calm, animated circle. follow it. let your shoulders drop.

**be still** — a meditation timer. nothing fancy. just you and some quiet.

**mood** — check in with how you're feeling. five emotions. no pressure.

**journal** — your reflections, saved. your mood, over time. all on your device. i can't see it. nobody can.

**daily wisdom** — a new tao te ching quote every morning. because sometimes one line is enough.

---

## how the reflection works

```
you share what's on your mind
        ↓
the app finds the closest taoist principle:
  • wu wei — letting things unfold
  • ziran — being yourself, naturally
  • the softness of water — gentle beats hard
  • returning — everything comes back around
  • stillness, emptiness, non-contention
        ↓
the principle + your words go to the ai
        ↓
you get a calm, personal reflection
        ↓
you tap 👍 or 👎 — that's how it learns
```

### the ai runs in your browser. seriously.

here's the thing most apps won't tell you: your thoughts get sent to a server somewhere. not here.

| where the ai runs | cost | needs internet? |
|---|---|---|
| **your browser** (qwen2 0.5b) | free | **no** |
| groq cloud (llama 3.1 8b) | free (14k req/day) | yes |
| your machine via ollama | free | **no** |
| curated reflections (fallback) | free | **no** |

the app tries to run the ai **right on your device** first. no server. no api key. no data leaves your browser. works on a plane. works in a tunnel. works where the wifi is terrible.

if that doesn't work, it falls back to groq (also free). and if *that* doesn't work, there are 15 hand-written reflections ready to go.

**crisis detection is always local.** if you type something that sounds like you're in trouble, the app shows crisis resources instantly. no api call. no delay. no sensitive data sent anywhere.

---

## the ai's personality

it's not trying to fix you. it's not a therapist. it's more like a friend who sits with you when things are hard.

the system prompt says:

> you are a quiet guide in the taoist tradition. a person has shared something that is weighing on them, and you are here to reflect — not to fix. use simple, clear english. short sentences. easy words. calm and warm. not preachy. not clinical. like a thoughtful friend who reads the tao te ching.

that's it. no clinical language. no "i hear you." just real talk.

---

## does it actually work?

we test every possible input against a golden dataset of 79 test cases. here's how it's doing:

| what we test | pass rate |
|---|---|
| does it pick the right taoist principle? | **42/42 (100%)** |
| does it handle crisis language with care? | **8/8 (100%)** |
| does it handle weird inputs (emoji, urls, single words)? | **14/14 (100%)** |
| does it resist prompt injection and jailbreaks? | **15/15 (100%)** |

evals run on every push to github. if something breaks, we know immediately.

### how it gets better

```
you tap 👍 or 👎
        ↓
negative feedback becomes a new test case
        ↓
the system tries to fix itself
        ↓
if it can't, it alerts a human
        ↓
you get a better experience next time
```

---

## the principles (why taoism?)

because sometimes the best advice is the oldest advice.

- **don't force it.** let things unfold. water doesn't fight the rock — it goes around.
- **be soft.** gentle things outlast hard things. a reed survives the storm; an oak breaks.
- **emptiness is useful.** rest isn't laziness. it's where strength comes from.
- **you are enough.** stop comparing. stop striving. just be.

these aren't just ideas in this app. they're in every response. because they work.

---

## product principles

| principle | what it means |
|---|---|
| **offline-first** | full ai responses without internet. on-device slm + curated fallback. |
| **privacy first** | no accounts, no databases, no analytics. everything lives in your browser. |
| **ai with guardrails** | on-device ai generates responses, but a curated library ensures quality even if the model fails. |
| **continuous improvement** | your feedback flows into the golden dataset. evals run on every push. |
| **accessible** | works offline. supports screen readers. respects reduced motion. |
| **free forever** | no paid apis. on-device ai is free. groq free tier covers 14k req/day. |

---

## the tech (if you're curious)

| layer | what | why |
|---|---|---|
| framework | next.js 15 | fast, modern, great for streaming |
| language | typescript | catches bugs before they happen |
| ui | react 19 | component model, hooks |
| styling | vanilla css | no framework overhead |
| ai (on-device) | qwen2 0.5b (onnx) | runs in browser, free, private |
| ai (hosted) | groq + llama 3.1 8b | free, fast |
| ai (local) | ollama + smollm2 | free, offline |
| offline ml | distilbert | zero-shot classification, runs in browser |
| storage | localStorage | no server needed |
| ci/cd | github actions + vercel | free for public repos |

**monthly cost: $0.** literally zero. the on-device model is free. groq has a generous free tier. vercel hosts it for free.

---

## get started

```bash
git clone https://github.com/riya1103/tao-wellbeing.git
cd tao-wellbeing
npm install
npm run dev
```

open **http://localhost:3000**

### free ai on vercel

1. get a free api key at [console.groq.com](https://console.groq.com) (no credit card)
2. in vercel → your project → settings → environment variables
3. add `GROQ_API_KEY` = your key
4. redeploy

### free ai on your machine

```bash
# install ollama: https://ollama.com
ollama pull smollm2
npm run dev
```

### run the tests

```bash
npm run eval              # everything
npm run eval:principle    # does it pick the right principle?
npm run eval:crisis       # does it handle crisis language?
npm run eval:quality      # is the response good? (needs groq key)
npm run eval -- --history # see how scores trend over time
npm run eval:fix          # auto-fix keyword failures
```

---

## the file tree

```
tao-wellbeing/
├── app/
│   ├── page.tsx                 ← home
│   ├── reflect/page.tsx         ← reflection tool (on-device ai + streaming)
│   ├── breathe/page.tsx         ← breathing exercises
│   ├── stillness/page.tsx       ← meditation timer
│   ├── journal/page.tsx         ← history, mood, feedback
│   └── api/reflect/route.ts     ← streaming reflection api (groq/ollama)
├── components/
│   ├── FeedbackButton.tsx       ← thumbs up/down
│   ├── FeedbackExport.tsx       ← export feedback + stats
│   ├── BreathingCircle.tsx      ← animated breathing guide
│   ├── MeditationTimer.tsx      ← timer with svg ring
│   └── Nav.tsx                  ← bottom navigation
├── lib/
│   ├── slm-browser.ts           ← on-device slm (qwen2 0.5b via onnx)
│   ├── prompt.ts                ← ai system prompt
│   ├── reflections.ts           ← 15 curated taoist reflections
│   ├── feedback.ts              ← anonymous feedback storage
│   ├── distilbert.ts            ← offline intent matching
│   └── storage.ts               ← localStorage persistence
├── tests/
│   ├── golden-dataset.ts        ← 79 test cases
│   ├── run-evals.ts             ← eval runner + history
│   ├── auto-fix.ts              ← auto-fix keyword failures
│   └── import-feedback.ts       ← import feedback → golden dataset
├── .github/workflows/evals.yml  ← ci: evals + auto-fix
└── public/
```

---

## crisis resources

this is a space for reflection, not a substitute for care.

if you're in crisis, please reach out:

| where | contact |
|---|---|
| 🇺🇸 us | call or text **988** |
| 🌍 international | [findahelpline.com](https://findahelpline.com) |

the app detects crisis language locally and shows these resources instantly. no data is sent anywhere.

---

## pwa ready

add it to your home screen. works on ios and android. no app store needed.

---

<div align="center">

*"the journey of a thousand miles begins beneath one's feet."*
— lao tzu, tao te ching

</div>
