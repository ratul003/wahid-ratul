"use client";

import { useEffect, useState } from "react";

/**
 * The fixed section rail, on the right, carrying each employer's mark so a
 * reader can navigate by company rather than by section name. Replaces the row
 * of company links that used to duplicate the page's own headers in the header.
 */

const FAV = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

const SECTIONS: { id: string; label: string; logo?: string; glyph?: string }[] = [
  { id: "expertise", label: "Expertise", glyph: "◈" },
  { id: "output", label: "Output", glyph: "◉" },
  { id: "just-move-in", label: "Just Move In", logo: FAV("justmovein.com") },
  { id: "optimizely", label: "Optimizely", logo: FAV("optimizely.com") },
  { id: "coto", label: "Coto", logo: FAV("coto.world") },
  { id: "foodpanda", label: "foodpanda", logo: FAV("foodpanda.com") },
  { id: "research", label: "Research", logo: FAV("umn.edu") },
  { id: "about", label: "Foundations", glyph: "◇" },
  { id: "writing", label: "Articles", glyph: "✎" },
];

export default function SectionRail() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const nodes = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    // Whichever section sits nearest the upper third of the viewport wins, so the
    // rail tracks what you are reading rather than whatever merely intersects.
    const pick = () => {
      const mark = window.innerHeight * 0.32;
      let best: string | null = null;
      let bestD = Infinity;
      for (const n of nodes) {
        const r = n.getBoundingClientRect();
        const d = Math.abs(r.top - mark);
        if (r.bottom > 0 && d < bestD) {
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
      className="hidden xl:block fixed right-5 top-1/2 -translate-y-1/2 z-40"
    >
      <div className="rounded-2xl border border-white/[0.08] bg-[#0b0b11]/85 backdrop-blur-md p-2.5 flex flex-col gap-0.5">
        {SECTIONS.map((s) => {
          const on = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={on ? "true" : undefined}
              className="rail-item flex items-center justify-end gap-2.5 rounded-lg pl-3 pr-2 py-[7px] transition-all duration-300"
              style={{
                background: on ? "rgba(129,140,248,0.16)" : "transparent",
                boxShadow: on ? "inset 0 0 0 1px rgba(165,180,252,0.4)" : undefined,
              }}
            >
              <span
                className="text-[11px] whitespace-nowrap transition-all duration-300"
                style={{
                  color: on ? "#e0e7ff" : "rgba(255,255,255,0.45)",
                  fontWeight: on ? 600 : 400,
                }}
              >
                {s.label}
              </span>
              {s.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.logo}
                  alt=""
                  width={17}
                  height={17}
                  className="rounded-[4px] object-contain flex-shrink-0 transition-all duration-300"
                  style={{
                    opacity: on ? 1 : 0.5,
                    filter: on ? "drop-shadow(0 0 6px rgba(129,140,248,0.85))" : "grayscale(0.45)",
                  }}
                />
              ) : (
                <span
                  className="w-[17px] text-center text-[11px] flex-shrink-0 transition-all duration-300"
                  style={{ color: on ? "#a5b4fc" : "rgba(255,255,255,0.3)" }}
                >
                  {s.glyph}
                </span>
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
