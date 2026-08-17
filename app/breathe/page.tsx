"use client";

import Link from "next/link";
import BreathingCircle from "@/components/BreathingCircle";
import FloatingElements from "@/components/FloatingElements";
import PageTransition from "@/components/PageTransition";

export default function BreathePage() {
  return (
    <PageTransition>
      <main className="page breathe-page">
        <FloatingElements count={12} speed="slow" />

        <div className="center">
          <h1 className="prompt">breathe</h1>
          <BreathingCircle />
          <div className="stillness-link-container">
            <Link href="/stillness" className="stillness-link">
              or be still →
            </Link>
          </div>
        </div>

        <footer className="foot">
          <p className="foot-line">&ldquo;Stillness is the master of unrest.&rdquo;</p>
        </footer>
      </main>
    </PageTransition>
  );
}
