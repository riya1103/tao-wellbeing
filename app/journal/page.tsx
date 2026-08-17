"use client";

import JournalList from "@/components/JournalList";
import FloatingElements from "@/components/FloatingElements";
import PageTransition from "@/components/PageTransition";
import FeedbackExport from "@/components/FeedbackExport";

export default function JournalPage() {
  return (
    <PageTransition>
      <main className="page journal-page">
        <FloatingElements count={8} speed="slow" />

        <div className="center journal-center">
          <h1 className="prompt">journal</h1>
          <JournalList />
          <FeedbackExport />
        </div>
      </main>
    </PageTransition>
  );
}
