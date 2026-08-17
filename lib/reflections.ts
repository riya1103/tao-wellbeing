// The offline heart of the app: a hand-authored library of Taoist reflections.
// Every reflection is grounded in a named principle and closes with a line drawn
// from or echoing the Tao Te Ching. This library is always available — the app
// works fully without any API key.

export interface Reflection {
  /** Stable id / slug. */
  id: string;
  /** The Taoist principle the reflection rests on. */
  principle: string;
  /** Words that suggest this reflection fits what the person described. */
  keywords: string[];
  /** The reflection body — calm, spacious, plain-language. */
  body: string;
  /** A closing line, drawn from or echoing the Tao Te Ching. */
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
    body: "Worry is the mind rehearsing a future that has not come. It runs ahead, again and again, over ground that does not yet exist. Notice that the rehearsing changes nothing — the river arrives when it arrives.\n\nWu wei is not doing nothing. It is doing without forcing, acting in accord with the moment rather than against it. What is actually in front of you right now? Tend to that, and only that. The rest is smoke.\n\nLet the thoughts pass through like weather. You do not have to follow every cloud.",
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
    body: "You are gripping something that was never yours to hold. Much of what troubles us lies outside our hands — the actions of others, the turning of events, the shape of tomorrow. To grip harder is only to tire the hand.\n\nThe Tao asks: what here is yours to move, and what is not? Give your care to the first. Release the second, not with resignation, but with trust that things unfold in their own time.\n\nAn open hand can receive. A clenched one cannot.",
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
    body: "Anger is a fire, and fire consumes its own house first. What burns in you now may feel like strength, but it hardens you, and what is hard is easily broken.\n\nWater takes another way. It does not strike the rock; it moves around it, and in time wears it smooth. Yielding is not weakness — it is the patience that outlasts force.\n\nFeel the heat, name it, and let it cool. You need not act while the fire is high.",
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
    body: "Something has gone, and the space it left aches. This is real, and it deserves your tenderness — do not rush to fill the emptiness or explain it away.\n\nThe Tao moves in cycles: the leaf falls so the tree may rest, the old makes room for what is not yet born. This does not lessen the loss. It only reminds you that endings and beginnings are one motion, seen from different sides.\n\nGrieve as fully as you loved. Both belong to a life lived openly.",
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
    body: "You are pushing the river, trying to make it flow faster. The more you force, the more it resists, and the more tired you become. Striving has a way of pushing the very thing you want further away.\n\nThe Tao accomplishes without contending. The seed does not strain to grow; it grows because that is its nature. What would it be to trust your own unfolding — to act from fullness rather than lack?\n\nYou are already enough to begin. The rest is only patience.",
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
    body: "You stand at a fork and cannot see the far end of either road. So you turn the choice over and over, hoping thought alone will reveal what only living can.\n\nThe Tao says: let the muddy water settle. Do not stir it with more analysis. In stillness, what is right for you tends to surface on its own — quietly, without argument.\n\nSit with the question rather than at it. Clarity is not forced; it arrives.",
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
    body: "You have been pouring out with nothing poured back in. A cup emptied endlessly cracks; even the deepest well runs dry when it is never allowed to fill.\n\nThe Tao honors the empty as much as the full. The hollow of the cup is what makes it useful; the space in the room is what lets you live there. Rest is not the absence of value — it is where value is restored.\n\nDo less. Let the field lie fallow. This too is the work.",
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
    body: "You are measuring your inner life against the outer surface of others, and no one wins that game — the surface is always polished, the inside always hidden.\n\nZiran means being so-of-itself: the pine does not wish to be the plum, nor the mountain envy the sea. Each thing is complete in its own nature. Your path is not late or early; it is simply yours.\n\nTurn your eyes from the crowd and back to your own quiet ground. There is nothing there to fix.",
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
    body: "Fear draws the body tight, bracing against a blow that may never land. It wants to keep you small and still, mistaking rigidity for safety.\n\nBut what is stiff breaks in the wind, while the supple branch bends and springs back. To meet fear is not to conquer it — it is to soften around it, to breathe, to let it move through rather than lodge in you.\n\nYou can be afraid and still take the next small step. Courage is not the absence of trembling.",
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
    body: "The mind darts and paws at everything, unable to rest, sure that the next thing will finally satisfy. But chasing does not still the chaser — it only feeds the chase.\n\nThe Tao roots itself in stillness. Movement is born from it and returns to it, as the wave returns to the sea. When you stop reaching outward for a moment, you may find the calm was underneath you all along.\n\nBe still. Not forever — just now, just this breath.",
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
    body: "Two hard things meeting can only clash. In conflict we brace to win, and in winning we often lose the very connection we were fighting for.\n\nThe Tao does not contend. To yield in a quarrel is not to be defeated — it is to refuse the war entirely, to let the other's force pass by and find nothing to push against. Softness disarms what hardness only inflames.\n\nYou can hold your ground without hardening your heart. Ask what the moment truly needs, not what your pride demands.",
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
    body: "The ground beneath you is shifting, and you reach for something solid to hold. But nothing in this world holds still — the seeking of permanence is itself a source of suffering.\n\nThe Tao is ceaseless change, and to live well is to move with it rather than brace against it. The reed survives the flood not by standing firm but by bending with the water. What feels like losing your footing may be the current carrying you somewhere true.\n\nLoosen your grip on how things were. Meet what is becoming.",
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
    body: "You have turned a hard eye on yourself, judging what you are against what you think you should be. But this harshness does not make you better — it only makes you smaller.\n\nThe Tao speaks of the uncarved block: the plain, unshaped wood that holds every possibility precisely because it is not yet forced into a single form. You do not need to be perfected. You need to be met, gently, as you are.\n\nSpeak to yourself as you would to someone you love. That, too, is the way.",
    line: "The sage is good to people who are good, and also good to people who are not.",
  },
  {
    id: "loneliness",
    principle: "unity beneath separation",
    keywords: [
      "lonely", "loneliness", "alone", "isolated", "isolation", "disconnected",
      "no one", "nobody", "unloved", "unseen", "left out", "outsider", "solitude",
    ],
    body: "A distance has opened between you and others, and in it you feel unseen. Loneliness is a real ache — not to be argued away, but to be held with kindness.\n\nYet the Tao is the thread through all things; nothing is truly separate. The valley and the peak are one mountain. Even now, apart, you belong to the same whole as everything that breathes. Solitude, met gently, can become a doorway rather than a wall.\n\nReach out where you can. And where you cannot yet, be a quiet companion to yourself.",
    line: "The ten thousand things arise and are of one source.",
  },
  {
    id: "general",
    principle: "the way of water",
    keywords: [], // fallback — matches nothing directly, used when nothing else fits
    body: "Whatever weighs on you, notice first that you have paused to look at it. That looking is already the beginning of ease.\n\nThe Tao does not solve problems by force. It flows toward the low places, patient and soft, finding the way that offers least resistance. Perhaps what is needed now is not a harder push but a gentler one — or none at all for a moment.\n\nBreathe. Let the water settle. The way forward often shows itself only once we stop straining to see it.",
    line: "The way is not in the sky. The way is in the heart.",
  },
];

/**
 * Choose the reflection that best fits what the person described.
 * Simple keyword scoring over the curated library; falls back to the
 * general "way of water" reflection when nothing matches.
 */
export function matchReflection(issue: string): Reflection {
  const text = issue.toLowerCase();
  let best: Reflection | null = null;
  let bestScore = 0;

  for (const r of REFLECTIONS) {
    let score = 0;
    for (const kw of r.keywords) {
      if (text.includes(kw)) {
        // Longer/multi-word keywords are stronger signals.
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
