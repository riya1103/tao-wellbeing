// Curated Tao Te Ching + Zhuangzi quotes for daily wisdom rotation.
// Deterministic selection based on day-of-year so the same quote
// appears all day, changing each morning.

export interface Quote {
  text: string;
  source: string;
  chapter?: number;
}

export const QUOTES: Quote[] = [
  { text: "The Tao that can be told is not the eternal Tao.", source: "Tao Te Ching", chapter: 1 },
  { text: "The name that can be named is not the eternal name.", source: "Tao Te Ching", chapter: 1 },
  { text: "The soft and yielding overcome the hard and strong.", source: "Tao Te Ching", chapter: 78 },
  { text: "Nature does not hurry, yet everything is accomplished.", source: "Tao Te Ching", chapter: 29 },
  { text: "The journey of a thousand miles begins beneath one's feet.", source: "Tao Te Ching", chapter: 64 },
  { text: "Water is the softest thing, yet it wears away the hardest.", source: "Tao Te Ching", chapter: 78 },
  { text: "A good traveler has no fixed plans and is not intent on arriving.", source: "Tao Te Ching", chapter: 27 },
  { text: "The wise man does not lay up treasure. The more he helps others, the more he benefits himself.", source: "Tao Te Ching", chapter: 81 },
  { text: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.", source: "Tao Te Ching", chapter: 33 },
  { text: "The sage does not contend, and so no one can contend with them.", source: "Tao Te Ching", chapter: 22 },
  { text: "Returning is the movement of the Tao.", source: "Tao Te Ching", chapter: 40 },
  { text: "The greatest perfection may seem imperfect, yet its use is inexhaustible.", source: "Tao Te Ching", chapter: 45 },
  { text: "To the mind that is still, the whole universe surrenders.", source: "Tao Te Ching", chapter: 16 },
  { text: "When I let go of what I am, I become what I might be.", source: "Tao Te Ching", chapter: 16 },
  { text: "Muddy water, let stand, becomes clear.", source: "Tao Te Ching", chapter: 15 },
  { text: "Those who know do not speak; those who speak do not know.", source: "Tao Te Ching", chapter: 56 },
  { text: "Do you have the patience to wait till your mud settles and the water is clear?", source: "Tao Te Ching", chapter: 15 },
  { text: "The way is not in the sky. The way is in the heart.", source: "Tao Te Ching", chapter: 5 },
  { text: "Thirty spokes share the wheel's hub; it is the center hole that makes it useful.", source: "Tao Te Ching", chapter: 11 },
  { text: "Fill your bowl to the brim and it will spill. Keep sharpening your knife and it will blunt.", source: "Tao Te Ching", chapter: 9 },
  { text: "The tree that does not bend with the wind will be broken by it.", source: "Tao Te Ching", chapter: 76 },
  { text: "Stillness is the master of unrest.", source: "Tao Te Ching", chapter: 26 },
  { text: "The ten thousand things arise and are of one source.", source: "Tao Te Ching", chapter: 34 },
  { text: "When you are content to be simply yourself, everyone will respect you.", source: "Tao Te Ching", chapter: 33 },
  { text: "Life is a series of natural and spontaneous changes. Do not resist them.", source: "Tao Te Ching", chapter: 5 },
  { text: "The sage is good to people who are good, and also good to people who are not.", source: "Tao Te Ching", chapter: 49 },
  { text: "Because the sage does not contend, no one in the world can contend with them.", source: "Tao Te Ching", chapter: 81 },
  { text: "He who stands on tiptoe does not stand firm. He who rushes ahead does not go far.", source: "Tao Te Ching", chapter: 24 },
  { text: "Stop looking for peace. Look for the place inside where there is no conflict.", source: "Zhuangzi" },
  { text: "Happiness is the absence of the striving for happiness.", source: "Zhuangzi" },
  { text: "The fish trap exists because of the fish. Once you've gotten the fish, you can forget the trap.", source: "Zhuangzi" },
  { text: "A frog in a well knows nothing of the sea.", source: "Zhuangzi" },
  { text: "What do I mean by saying intrinsic nature and truth? To be free from the fetters of emotion is to follow intrinsic nature. To be free from the delusions of knowledge is to follow truth.", source: "Zhuangzi" },
  { text: "The perfect man employs his mind as a mirror. It grasps nothing; it refuses nothing. It receives but does not keep.", source: "Zhuangzi" },
  { text: "Flow with whatever may happen and let your mind be free.", source: "Zhuangzi" },
  { text: "Wherever you go, go with all your heart.", source: "Confucius (via Taoist tradition)" },
  { text: "The bamboo that bends is stronger than the oak that resists.", source: "Proverb (Taoist wisdom)" },
  { text: "The cup must be empty before it can be filled.", source: "Taoist proverb" },
  { text: "Sitting quietly, doing nothing, spring comes, and the grass grows by itself.", source: "Matsuo Bashō (Zen-Taoist)" },
  { text: "In the beginner's mind there are many possibilities, but in the expert's mind there are few.", source: "Shunryū Suzuki (Zen-Taoist)" },
  { text: "When you realize nothing is lacking, the whole world belongs to you.", source: "Lao Tzu" },
  { text: "Be like the earth that supports all things equally.", source: "Tao Te Ching (adapted)" },
  { text: "Silence is a source of great strength.", source: "Lao Tzu" },
  { text: "The more laws and order are made prominent, the more thieves and robbers there will be.", source: "Tao Te Ching", chapter: 57 },
  { text: "Respond to hatred with virtue.", source: "Tao Te Ching", chapter: 63 },
  { text: "Manifest plainness, embrace simplicity, reduce selfishness, have few desires.", source: "Tao Te Ching", chapter: 19 },
  { text: "The Tao nourishes all things. It gives them life without claiming to own them.", source: "Tao Te Ching", chapter: 51 },
  { text: "A leader is best when people barely know he exists. When his work is done, they will say: we did it ourselves.", source: "Tao Te Ching", chapter: 17 },
  { text: "Truth is not always beautiful, nor beautiful words the truth.", source: "Tao Te Ching", chapter: 81 },
  { text: "New beginnings are often disguised as painful endings.", source: "Lao Tzu" },
];

/** Deterministic daily quote based on day-of-year. */
export function getDailyQuote(): Quote {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return QUOTES[dayOfYear % QUOTES.length];
}

/** Pseudo-random quote (non-daily). */
export function getRandomQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

/** Time-based greeting. */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "in the quiet hours";
  if (hour < 12) return "good morning";
  if (hour < 17) return "good afternoon";
  if (hour < 21) return "good evening";
  return "in the still of night";
}
