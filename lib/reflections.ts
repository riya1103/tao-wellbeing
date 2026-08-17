// Hand-authored Taoist reflections in simple, clear English.
// Every reflection is grounded in a named principle and closes with a line
// from or echoing the Tao Te Ching. Works fully without any API key.

export interface Reflection {
  id: string;
  principle: string;
  keywords: string[];
  body: string;
  line: string;
}

export const REFLECTIONS: Reflection[] = [
  {
    id: "worry",
    principle: "wu wei — effortless action",
    keywords: [
      "worry", "worried", "worrying", "anxious", "anxiety", "nervous",
      "overthink", "overthinking", "racing", "spiral", "panic", "dread",
      "future", "what if",
    ],
    body: "Your mind is running ahead to a future that hasn't happened yet. It replays the same scenes, over and over, on ground that doesn't exist yet. And none of that replaying changes a thing — the river comes when it comes.\n\nWu wei means acting without forcing. Not sitting still doing nothing. Just tending to what is right in front of you, right now, instead of fighting with what-ifs.\n\nLet your thoughts come and go like clouds. You don't have to follow each one.",
    line: "Nature does not hurry, yet everything is accomplished.",
  },
  {
    id: "control",
    principle: "wu wei — yielding to what is",
    keywords: [
      "control", "controlling", "can't control", "cannot control", "let go",
      "letting go", "grip", "holding on", "powerless", "helpless", "uncertain",
      "uncertainty", "unpredictable", "outcome",
    ],
    body: "You are holding on to something that was never in your hands. Other people's actions, how things turn out, what tomorrow looks like — gripping harder won't change any of it. It just tires you out.\n\nThe Tao asks a simple question: what here can you actually move, and what can't you? Put your energy into the first. Let go of the second — not because you don't care, but because forcing doesn't work.\n\nAn open hand can receive. A closed fist cannot.",
    line: "The soft and yielding overcome the hard and strong.",
  },
  {
    id: "anger",
    principle: "the softness of water",
    keywords: [
      "anger", "angry", "furious", "rage", "resent", "resentment", "bitter",
      "frustrated", "frustration", "irritated", "annoyed", "unfair", "betrayed",
      "hate",
    ],
    body: "Anger is fire, and fire burns the one who holds it first. It feels strong right now, but it makes you rigid — and what is rigid breaks easily.\n\nWater does something different. It doesn't slam into the rock. It flows around it, and over time, the rock becomes smooth. Being soft isn't weakness — it's the patience that lasts longer than any force.\n\nFeel the heat. Name it. Then let it cool. You don't have to act while the fire is highest.",
    line: "Water is the softest thing, yet it wears away the hardest.",
  },
  {
    id: "loss",
    principle: "returning — the cycle of things",
    keywords: [
      "loss", "lost", "grief", "grieving", "death", "died", "mourning", "miss",
      "missing", "gone", "ending", "ended", "breakup", "broke up", "divorce",
      "goodbye", "empty",
    ],
    body: "Something is gone, and where it used to be, there is an ache. That is real, and it deserves your kindness — don't rush to fill the space or explain it away.\n\nThe Tao moves in circles. Leaves fall so trees can rest. Old things make room for what hasn't been born yet. This doesn't take away the pain. It just reminds you that endings and beginnings are the same motion, seen from different sides.\n\nLet yourself grieve as fully as you loved. Both belong to a life lived with an open heart.",
    line: "Returning is the movement of the Tao.",
  },
  {
    id: "striving",
    principle: "wu wei — non-striving",
    keywords: [
      "striving", "pushing", "hustle", "grind", "achieve", "achievement",
      "ambition", "not enough", "never enough", "prove", "success", "failing",
      "failure", "pressure", "productive", "productivity", "behind",
    ],
    body: "You're pushing the river, trying to make it go faster. The harder you push, the more it pushes back, and the more tired you get.\n\nThe Tao accomplishes things without forcing them. A seed doesn't strain to grow — it grows because that's what it is. What would it feel like to trust your own unfolding? To act from enough, not from not-enough?\n\nYou are already enough to begin. The rest is just patience.",
    line: "The sage does not contend, and so no one can contend with them.",
  },
  {
    id: "indecision",
    principle: "stillness before movement",
    keywords: [
      "decision", "decide", "indecision", "indecisive", "choice", "choose",
      "torn", "stuck", "crossroads", "unsure", "confused", "confusion",
      "which way", "don't know what",
    ],
    body: "You're standing at a fork in the road, turning each option over and over, hoping thinking alone will show you the way. But some things can only be known by living them, not by thinking about them.\n\nThe Tao says: let the muddy water settle. Stop stirring it with more analysis. When you get quiet, the right path usually surfaces on its own — gently, without argument.\n\nSit with the question. Don't fight it. Clarity isn't forced — it arrives.",
    line: "Do you have the patience to wait till your mud settles and the water is clear?",
  },
  {
    id: "burnout",
    principle: "the value of emptiness and rest",
    keywords: [
      "burnout", "burned out", "burnt out", "exhausted", "exhaustion", "tired",
      "drained", "depleted", "overwhelmed", "overwhelm", "too much", "can't keep up",
      "no energy", "spent", "weary",
    ],
    body: "You've been giving and giving with nothing coming back in. A cup that's never filled will crack. Even the deepest well runs dry if you never let it rain.\n\nThe Tao sees emptiness as just as important as fullness. The empty space inside a cup is what makes it useful. The open space in a room is what lets you live in it. Rest isn't doing nothing — it's how you get filled back up.\n\nDo less. Let the ground rest. This, too, is important work.",
    line: "Thirty spokes share the wheel's hub; it is the center hole that makes it useful.",
  },
  {
    id: "comparison",
    principle: "ziran — being one's own nature",
    keywords: [
      "comparison", "compare", "comparing", "jealous", "jealousy", "envy",
      "everyone else", "behind everyone", "not good enough", "inadequate",
      "social media", "others have", "left behind", "measure up",
    ],
    body: "You're comparing your inside to everyone else's outside. No one wins that game — the outside is always polished, the inside is always hidden.\n\nZiran means being what you are, naturally. A pine tree doesn't try to be a plum tree. A mountain doesn't envy the ocean. Each thing is whole in itself. Your path isn't early or late. It's just yours.\n\nLook away from the crowd. Come back to your own quiet ground. There's nothing there that needs fixing.",
    line: "When you are content to be simply yourself, everyone will respect you.",
  },
  {
    id: "fear",
    principle: "yielding and trust",
    keywords: [
      "fear", "afraid", "scared", "terrified", "frightened", "phobia",
      "avoid", "avoiding", "hiding", "risk", "vulnerable", "exposed", "unsafe",
      "insecure",
    ],
    body: "Fear tightens everything up. It braces for a hit that might never come. It wants to keep you small, and mistakes being stiff for being safe.\n\nBut stiff things break in the wind. Soft, flexible branches bend and bounce back. Facing fear isn't about beating it — it's about softening around it, breathing, letting it move through you instead of getting stuck.\n\nYou can be afraid and still take one small step. That's what courage actually looks like.",
    line: "The tree that does not bend with the wind will be broken by it.",
  },
  {
    id: "restlessness",
    principle: "stillness as the root",
    keywords: [
      "restless", "restlessness", "bored", "boredom", "can't sit still",
      "distracted", "distraction", "scattered", "unsettled", "agitated",
      "impatient", "impatience", "empty feeling", "numb", "adrift",
    ],
    body: "Your mind keeps jumping from thing to thing, sure that the next thing will finally be the one that satisfies. But chasing never quiets the one who chases — it only keeps the chase going.\n\nThe Tao starts from stillness. Movement comes from it and goes back to it, like waves returning to the sea. If you stop reaching outward for just a moment, you might find the calm was under you the whole time.\n\nBe still. Not forever. Just now. Just this breath.",
    line: "Stillness is the master of unrest.",
  },
  {
    id: "conflict",
    principle: "non-contention",
    keywords: [
      "conflict", "argument", "argue", "fight", "fighting", "disagreement",
      "relationship", "partner", "family", "friend", "coworker", "boss",
      "misunderstood", "blame", "criticism", "criticized",
    ],
    body: "When two hard things meet, they can only clash. In a fight, we brace to win — but in winning, we often lose the connection we were fighting for.\n\nThe Tao doesn't fight. Stepping back from an argument isn't losing — it's choosing not to play the game. Softness calms what hardness only makes worse.\n\nYou can stand your ground without hardening your heart. Ask what this moment actually needs — not what your pride demands.",
    line: "Because the sage does not contend, no one in the world can contend with them.",
  },
  {
    id: "change",
    principle: "flowing with change",
    keywords: [
      "change", "changing", "transition", "new job", "moving", "moved", "unknown",
      "starting over", "start over", "fresh start", "different", "everything's changing",
      "unstable", "instability",
    ],
    body: "The ground is shifting under your feet, and you're reaching for something solid. But nothing in this world stays still — looking for things to never change is itself a source of pain.\n\nThe Tao is constant change, and living well means moving with it instead of fighting it. A reed survives a flood not by standing tall, but by bending with the water. What feels like losing your footing might be a current carrying you somewhere real.\n\nLet go of how things were. Meet what's coming.",
    line: "Life is a series of natural and spontaneous changes. Do not resist them.",
  },
  {
    id: "self-criticism",
    principle: "compassion and the uncarved block",
    keywords: [
      "hate myself", "self-critical", "self critical", "not worthy", "worthless",
      "ashamed", "shame", "guilt", "guilty", "mistake", "regret", "flawed",
      "broken", "wrong with me", "disappoint",
    ],
    body: "You've been looking at yourself with a harsh eye, measuring who you are against who you think you should be. But that harshness doesn't make you better — it only makes you smaller.\n\nThe Tao speaks of the uncarved block: plain wood that holds every possibility because it hasn't been forced into one shape yet. You don't need to be fixed. You need to be met — gently — as you are.\n\nTalk to yourself the way you'd talk to someone you love. That, too, is the way.",
    line: "The sage is good to people who are good, and also good to people who are not.",
  },
  {
    id: "loneliness",
    principle: "unity beneath separation",
    keywords: [
      "lonely", "loneliness", "alone", "isolated", "isolation", "disconnected",
      "no one", "nobody", "unloved", "unseen", "left out", "outsider", "solitude",
    ],
    body: "There's a distance between you and others, and in that distance, you feel unseen. Loneliness is a real ache — you can't argue it away. It needs to be held gently.\n\nBut the Tao is the thread that connects everything — nothing is truly separate. The valley and the peak are the same mountain. Even when you're apart, you belong to the same world as everything that breathes. Solitude, met with kindness, can become a doorway instead of a wall.\n\nReach out where you can. And where you can't yet, be a quiet friend to yourself.",
    line: "The ten thousand things arise and are of one source.",
  },
  {
    id: "general",
    principle: "the way of water",
    keywords: [],
    body: "Whatever you're carrying, you stopped to look at it. That small act of looking is already the start of feeling lighter.\n\nThe Tao doesn't push problems away. It flows toward the low places, slow and soft, finding the path that requires the least effort. Maybe what you need right now isn't a harder push — but a gentler one. Or no push at all, just for a moment.\n\nBreathe. Let things settle. The way forward usually shows itself once we stop trying so hard to see it.",
    line: "The way is not in the sky. The way is in the heart.",
  },
];

/**
 * Choose the reflection that best fits what the person described.
 */
export function matchReflection(issue: string): Reflection {
  const text = issue.toLowerCase();
  let best: Reflection | null = null;
  let bestScore = 0;

  for (const r of REFLECTIONS) {
    let score = 0;
    for (const kw of r.keywords) {
      if (text.includes(kw)) {
        score += kw.includes(" ") ? 3 : 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = r;
    }
  }

  return best ?? REFLECTIONS.find((r) => r.id === "general")!;
}
