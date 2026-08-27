"use client";

import { useEffect, useState } from "react";

/**
 * The fixed section rail, same pattern as the case-study sites: rail-only
 * navigation, labels always visible, the active one lit. Replaces the row of
 * company names that was duplicating the page's own section headers in the
 * header bar.
 */

const SECTIONS = [
  { id: "expertise", label: "Expertise" },
  { id: "just-move-in", label: "Just Move In" },
  { id: "optimizely", label: "Optimizely" },
  { id: "coto", label: "Coto" },
  { id: "foodpanda", label: "foodpanda" },
  { id: "research", label: "Research" },
  { id: "about", label: "Foundations" },
  { id: "writing", label: "Articles" },
];

export default function SectionRail() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const nodes = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    // The section whose top is nearest the upper third of the viewport wins, so
    // the rail tracks what you are reading rather than what merely intersects.
    const pick = () => {
      const mark = window.innerHeight * 0.32;
      let best: string | null = null;
      let bestD = Infinity;
      for (const n of nodes) {
        const d = Math.abs(n.getBoundingClientRect().top - mark);
        if (n.getBoundingClientRect().bottom > 0 && d < bestD) {
          bestD = d;
          best = n.id;
        }
      }
      setActive(best);
    };

    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, []);

  return (
    <nav
      aria-label="Sections"
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-1.5"
    >
      {SECTIONS.map((s) => {
        const on = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rail-item group flex items-center gap-2.5 justify-end"
            aria-current={on ? "true" : undefined}
          >
            <span
              className="text-[10.5px] tracking-wide transition-all duration-300"
              style={{
                color: on ? "#c7d2fe" : "rgba(255,255,255,0.32)",
                fontWeight: on ? 600 : 400,
              }}
            >
              {s.label}
            </span>
            <span
              className="rounded-full transition-all duration-300 flex-shrink-0"
              style={{
                width: on ? 14 : 6,
                height: on ? 3 : 2,
                background: on ? "#a5b4fc" : "rgba(255,255,255,0.25)",
                boxShadow: on ? "0 0 8px #818cf8cc" : undefined,
              }}
            />
          </a>
        );
      })}
    </nav>
  );
}
