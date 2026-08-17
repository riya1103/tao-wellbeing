"use client";

import Link from "next/link";
import Enso from "@/components/Enso";
import DailyWisdom from "@/components/DailyWisdom";
import MoodCheckIn from "@/components/MoodCheckIn";
import FloatingElements from "@/components/FloatingElements";
import PageTransition from "@/components/PageTransition";

const ACTIONS = [
  { href: "/reflect", label: "reflect", desc: "name what troubles you" },
  { href: "/breathe", label: "breathe", desc: "guided Taoist breathing" },
  { href: "/journal", label: "journal", desc: "your past reflections" },
];

export default function Home() {
  return (
    <PageTransition>
      <main className="page home-page">
        <FloatingElements />

        <div className="center home-center">
          <Enso size={72} />

          <DailyWisdom />

          <MoodCheckIn />

          <div className="action-cards">
            {ACTIONS.map((a) => (
              <Link key={a.href} href={a.href} className="action-card">
                <span className="action-card-label">{a.label}</span>
                <span className="action-card-desc">{a.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        <footer className="foot">
          <p className="foot-note">
            A place for reflection, not a substitute for care. In crisis, reach a
            person who can help — in the US, call or text 988.
          </p>
        </footer>
      </main>
    </PageTransition>
  );
}
