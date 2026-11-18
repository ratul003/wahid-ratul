"use client";

/**
 * Visuals embedded inside "The Frailty in the Economics of AI".
 *
 * FrailtyHero   the cover photograph with a slow push-in toward the sign
 * FrailtyWeek   the four stops of the trip as one contact sheet
 * FrailtyChairs eight jobs collapsing into one chair, played when scrolled into view
 *
 * The photographs are shown as taken (cropped and colour graded only). The motion is
 * camera movement and layout, never a change to what is in the frame.
 */

import React, { useEffect, useRef, useState } from "react";

const BASE = "/writing/the-frailty-in-the-economics-of-ai";
const RED = "#f87171";
const SANS = "var(--font-geist-sans), system-ui, sans-serif";

const CSS = `
@keyframes frailty-push { from { transform: scale(1); } to { transform: scale(1.2); } }
.frailty-push { animation: frailty-push 28s ease-in-out infinite alternate; transform-origin: 82% 36%; will-change: transform; }
.frailty-tile img { transition: transform 900ms cubic-bezier(.2,.7,.2,1); }
.frailty-tile:hover img { transform: scale(1.045); }
@keyframes frailty-dot { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .frailty-push { animation: none; }
  .frailty-tile img { transition: none; }
}
`;

export function FrailtyHero() {
  return (
    <figure style={{ margin: "2.2em 0 2.6em" }}>
      <style>{CSS}</style>
      <div
        className="relative w-full overflow-hidden rounded-xl border border-white/[0.08]"
        style={{ aspectRatio: "16 / 9", background: "#120406" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${BASE}/frailty-cover-fully-booked.jpg`}
          alt="An empty bar in Penang lit in red, rows of bottles along one wall, every table unoccupied, and a neon sign by the stage reading FULLY BOOKED."
          className="frailty-push absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,15,0) 52%, rgba(10,10,15,0.82) 100%), radial-gradient(120% 90% at 82% 36%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.38) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7" style={{ fontFamily: SANS }}>
          <div
            className="text-[10px] sm:text-[11px] uppercase font-semibold"
            style={{ letterSpacing: "0.2em", color: RED }}
          >
            Penang · a Thursday evening · late September
          </div>
          <div className="mt-1.5 text-base sm:text-xl font-semibold text-white leading-snug">
            We were the first customers of the day.
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${RED}99, transparent)` }}
        />
      </div>
    </figure>
  );
}

type Stop = {
  n: string;
  place: string;
  note: string;
  img?: string;
  alt?: string;
  wide?: boolean;
};

const STOPS: Stop[] = [
  {
    n: "01",
    place: "Kuala Lumpur",
    note: "Three bartenders on shift, which put them comfortably in the majority.",
    img: "frailty-kl-bar.jpg",
    alt: "A bar in Kuala Lumpur's Chinatown: three bartenders behind a lit wall of bottles and a red neon sign, with empty chairs in the foreground.",
    wide: true,
  },
  {
    n: "02",
    place: "Cameron Highlands",
    note: "We stopped in the middle of the main road at dusk to take a photograph, and nothing came.",
    img: "frailty-cameron-road.jpg",
    alt: "A wet, empty road in the Cameron Highlands at dusk with street lamps lit, and one person standing on the centre line.",
  },
  {
    n: "02",
    place: "Cameron Highlands",
    note: "Even the tea had no queue, and this was at a tea plantation.",
    img: "frailty-tea-truck.jpg",
    alt: "An orange tea truck at a Cameron Highlands plantation with nobody waiting at the counter and one person posing beside it.",
  },
  {
    n: "03",
    place: "Batu Ferringhi",
    note: "The only couple staying in the building. Romantic for one evening, a little eerie by the second.",
  },
  {
    n: "04",
    place: "George Town",
    note: "The middle of the day. Note the traffic.",
    img: "frailty-penang-street.jpg",
    alt: "A street in George Town in daylight: a lodge and a row of shophouses with their shutters down, and an empty road.",
  },
];

const ROUTE = ["Kuala Lumpur", "Cameron Highlands", "Batu Ferringhi", "George Town"];

export function FrailtyWeek() {
  return (
    <section style={{ margin: "2.4em 0 2.8em", fontFamily: SANS }}>
      <style>{CSS}</style>
      {/* the route */}
      <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1.5">
        {ROUTE.map((r, i) => (
          <React.Fragment key={r}>
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: RED, animation: `frailty-dot 3.2s ease-in-out ${i * 0.8}s infinite` }}
              />
              <span className="text-[11px] uppercase font-semibold text-white/75" style={{ letterSpacing: "0.14em" }}>
                {r}
              </span>
            </span>
            {i < ROUTE.length - 1 && <span className="h-px w-5 sm:w-8 bg-white/20" />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {STOPS.map((s, i) => (
          <div
            key={i}
            className={`frailty-tile relative overflow-hidden rounded-xl border border-white/[0.08] ${
              s.wide ? "sm:col-span-2" : ""
            }`}
            style={{ background: "#101014" }}
          >
            {s.img ? (
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: s.wide ? "2400 / 1040" : "3 / 2" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${BASE}/${s.img}`} alt={s.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, rgba(10,10,15,0.45) 0%, rgba(10,10,15,0) 30%, rgba(10,10,15,0) 55%, rgba(10,10,15,0.9) 100%)" }}
                />
              </div>
            ) : (
              <div
                className="w-full"
                style={{
                  aspectRatio: "3 / 2",
                  background:
                    "repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 10px, rgba(255,255,255,0) 10px 20px)",
                }}
              />
            )}
            <div className="absolute left-3.5 top-3 flex items-center gap-2">
              <span className="text-[11px] font-bold tabular-nums" style={{ color: RED }}>
                {s.n}
              </span>
              <span className="text-[11px] uppercase font-semibold text-white/90" style={{ letterSpacing: "0.14em" }}>
                {s.place}
              </span>
            </div>
            <p className="absolute inset-x-0 bottom-0 m-0 px-3.5 pb-3 text-[13px] leading-snug text-white/85">
              {s.note}
              {!s.img && <span className="block mt-1 text-white/40">No photograph. There was nobody to put in it.</span>}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

const ROLES = [
  "Product Manager",
  "Data Scientist",
  "Data Engineer",
  "QA Analyst",
  "Solutions Architect",
  "Marketer",
  "Project Manager",
  "Designer",
];

export function FrailtyChairs() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const W = 1020;
  const H = 330;
  const n = ROLES.length;
  const step = W / n;
  const cy = 104;
  const BLUE = "#3b82f6";
  const DIM = "rgba(255,255,255,0.16)";
  const gap = 0.5; // seconds between one chair emptying and the next

  const replay = () => {
    setOn(false);
    window.setTimeout(() => setOn(true), 350);
  };

  return (
    <figure ref={ref} style={{ margin: "2.4em 0", fontFamily: SANS }}>
      <div className="rounded-xl border border-white/[0.08] p-5 sm:p-7" style={{ background: "#16161a" }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[15px] sm:text-[17px] font-semibold text-white leading-snug">
              A few years ago each of these was a different person
            </div>
            <div className="mt-1 text-[12.5px] sm:text-[13.5px] text-white/60">
              The eight jobs I did this year, with an AI doing the typing.
            </div>
          </div>
          <button
            type="button"
            onClick={replay}
            className="shrink-0 rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase text-white/60 hover:text-white hover:border-white/40 transition-colors"
            style={{ letterSpacing: "0.12em" }}
          >
            Replay
          </button>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="mt-5 block w-full h-auto" role="img" aria-label="Eight chairs, each with a person and a job title. Seven of the people fade away and their job titles move to the first chair, leaving seven chairs empty.">
          {ROLES.map((role, i) => {
            const x = step * i + step / 2;
            const d = on ? `${0.5 + (i - 1) * gap}s` : "0s";
            const gone = on && i > 0;
            const dx = step / 2 - x;
            const dy = i * 19;
            return (
              <g key={role}>
                {/* chair */}
                <g
                  fill="none"
                  strokeWidth={5}
                  strokeLinecap="round"
                  style={{ stroke: gone ? DIM : BLUE, transition: `stroke 600ms ease ${d}` }}
                >
                  <path d={`M${x - 22} ${cy - 62} V${cy}`} />
                  <path d={`M${x - 22} ${cy - 58} H${x - 6}`} />
                  <path d={`M${x - 22} ${cy} H${x + 24}`} />
                  <path d={`M${x - 18} ${cy} V${cy + 44}`} />
                  <path d={`M${x + 20} ${cy} V${cy + 44}`} />
                </g>
                {/* person */}
                <g
                  fill={i === 0 ? BLUE : "rgba(255,255,255,0.72)"}
                  style={{ opacity: gone ? 0 : 1, transition: `opacity 600ms ease ${d}` }}
                >
                  <circle cx={x + 2} cy={cy - 74} r={13} />
                  <rect x={x - 12} y={cy - 58} width={28} height={52} rx={12} />
                  <rect x={x - 8} y={cy - 14} width={34} height={14} rx={7} />
                </g>
                {/* job title */}
                <text
                  x={x}
                  y={cy + 72}
                  textAnchor="middle"
                  fontSize={12.5}
                  fontWeight={600}
                  style={{
                    fill: i === 0 || gone ? "#ffffff" : "rgba(255,255,255,0.5)",
                    transform: gone ? `translate(${dx}px, ${dy}px)` : "translate(0px, 0px)",
                    transition: `transform 900ms cubic-bezier(.3,.7,.2,1) ${d}, fill 600ms ease ${d}`,
                  }}
                >
                  {role}
                </text>
              </g>
            );
          })}
          <g style={{ opacity: on ? 1 : 0, transition: `opacity 900ms ease ${on ? 0.5 + 7 * gap + 0.4 : 0}s` }}>
            <text x={W - 20} y={H - 36} textAnchor="end" fontSize={30} fontWeight={700} fill="#ffffff">
              Eight jobs. One chair.
            </text>
            <text x={W - 20} y={H - 10} textAnchor="end" fontSize={15} fill="rgba(255,255,255,0.55)">
              Nobody was laid off. Nobody was hired either.
            </text>
          </g>
        </svg>

        <p className="m-0 mt-3 text-[11.5px] leading-relaxed text-white/40">
          {ROLES.join(", ")}. The roles are the ones I listed in my own article on the Model Context Protocol. An
          illustration of my working week, not a dataset.
        </p>
      </div>
    </figure>
  );
}
