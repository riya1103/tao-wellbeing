"use client";

import { getDailyQuote, getGreeting } from "@/lib/quotes";

export default function DailyWisdom() {
  const quote = getDailyQuote();
  const greeting = getGreeting();

  return (
    <section className="wisdom-section">
      <p className="wisdom-greeting">{greeting}</p>
      <blockquote className="wisdom-card">
        <p className="wisdom-text">&ldquo;{quote.text}&rdquo;</p>
        <cite className="wisdom-source">
          — {quote.source}
          {quote.chapter ? `, ch. ${quote.chapter}` : ""}
        </cite>
      </blockquote>
    </section>
  );
}
