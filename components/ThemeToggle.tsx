"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme) || "light";
    setTheme(current);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("tao-theme", next);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
  };

  // Avoid a hydration mismatch: render a stable glyph until mounted.
  const glyph = !mounted ? "○" : theme === "light" ? "☾" : "☼";
  const label = theme === "light" ? "Switch to dark" : "Switch to light";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      {glyph}
    </button>
  );
}
