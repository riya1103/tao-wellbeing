"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", glyph: "●", label: "home" },
  { href: "/reflect", glyph: "◐", label: "reflect" },
  { href: "/breathe", glyph: "◯", label: "breathe" },
  { href: "/journal", glyph: "◑", label: "journal" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="nav" aria-label="Main navigation">
      <div className="nav-inner">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${active ? "nav-item-active" : ""}`}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              <span className="nav-glyph">{item.glyph}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
