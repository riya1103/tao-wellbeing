"use client";

import { useMemo } from "react";

interface FloatingElementsProps {
  count?: number;
  speed?: "normal" | "slow";
}

export default function FloatingElements({
  count = 18,
  speed = "normal",
}: FloatingElementsProps) {
  const dots = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = i * 137.508;
      const x = (seed * 7.3) % 100;
      const size = 2 + ((seed * 3.1) % 4);
      const duration = speed === "slow"
        ? 25 + ((seed * 2.7) % 30)
        : 15 + ((seed * 2.7) % 25);
      const delay = (seed * 1.3) % 12;
      const drift = -15 + ((seed * 0.9) % 30);
      const opacity = 0.04 + ((seed * 0.4) % 0.1);
      return { x, size, duration, delay, drift, opacity };
    });
  }, [count, speed]);

  return (
    <div className="floating-container" aria-hidden="true">
      {dots.map((d, i) => (
        <span
          key={i}
          className="floating-dot"
          style={{
            left: `${d.x}%`,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
            "--drift": `${d.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
