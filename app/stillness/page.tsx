"use client";

import Link from "next/link";
import MeditationTimer from "@/components/MeditationTimer";
import FloatingElements from "@/components/FloatingElements";
import PageTransition from "@/components/PageTransition";

export default function StillnessPage() {
  return (
    <PageTransition>
      <main className="page stillness-page">
        <FloatingElements count={24} speed="slow" />

        <div className="center">
          <h1 className="prompt">be still</h1>
          <MeditationTimer />
          <div className="stillness-link-container">
            <Link href="/breathe" className="stillness-link">
              ← back to breathing
            </Link>
          </div>
        </div>

        <footer className="foot">
          <p className="foot-line">&ldquo;To the mind that is still, the whole universe surrenders.&rdquo;</p>
        </footer>
      </main>
    </PageTransition>
  );
}
