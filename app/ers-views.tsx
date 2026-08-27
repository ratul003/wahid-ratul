"use client";

import { useMemo, useState } from "react";

/**
 * The Expert Readiness Score, as the case study presents it: the credential
 * scale it reads, a full TOPSIS breakdown per expert, and a profile builder that
 * runs the same engine against the pool live.
 *
 * TOPSIS proper, not a weighted average: vector-normalise each criterion, weight
 * it, then score by closeness to the ideal profile relative to the worst one. A
 * weighted average lets an expert max one signal and coast.
 */

const VIOLET = "#8b5cf6";
const AMBER = "#f59e0b";
const AI_GATE = 0.65;

const TIERS = [
  { n: 1, name: "Identity Verified" },
  { n: 2, name: "Credentials Added" },
  { n: 3, name: "Specialisation" },
  { n: 4, name: "Background Checked" },
  { n: 5, name: "Institutional" },
];

type Crit = { key: string; name: string; glyph: string; w: number; benefit: boolean; min: number; max: number; fmt: (v: number) => string };

export const CRITS: Crit[] = [
  { key: "csat", name: "CSAT", glyph: "★", w: 0.30, benefit: true, min: 3, max: 5, fmt: (v) => v.toFixed(2) },
  { key: "sessions", name: "Session Count", glyph: "◎", w: 0.25, benefit: true, min: 5, max: 250, fmt: (v) => String(Math.round(v)) },
  { key: "retention", name: "Retention Rate", glyph: "↩", w: 0.20, benefit: true, min: 0.4, max: 0.98, fmt: (v) => `${Math.round(v * 100)}%` },
  { key: "response", name: "Response Time", glyph: "⏱", w: 0.15, benefit: false, min: 1, max: 20, fmt: (v) => `${v.toFixed(1)}m` },
  { key: "credential", name: "Credential Tier", glyph: "✓", w: 0.10, benefit: true, min: 1, max: 5, fmt: (v) => `Tier ${Math.round(v)}` },
];

const POOL = [
  { name: "Sam K.", v: [4.9, 210, 0.94, 3.2, 5] },
  { name: "Alex R.", v: [4.8, 160, 0.88, 4.5, 4] },
  { name: "Casey L.", v: [4.7, 120, 0.85, 6.0, 4] },
  { name: "Taylor B.", v: [4.5, 56, 0.82, 9.1, 5] },
  { name: "Jordan M.", v: [4.3, 38, 0.74, 12.0, 3] },
];

/** Full TOPSIS over a pool, returning each row's distances and closeness. */
function topsis(rows: { name: string; v: number[] }[]) {
  const n = CRITS.length;
  const norms = Array.from({ length: n }, (_, j) =>
    Math.sqrt(rows.reduce((a, r) => a + r.v[j] ** 2, 0)) || 1
  );
  const V = rows.map((r) => r.v.map((x, j) => (x / norms[j]) * CRITS[j].w));
  const best = Array.from({ length: n }, (_, j) => {
    const col = V.map((row) => row[j]);
    return CRITS[j].benefit ? Math.max(...col) : Math.min(...col);
  });
  const worst = Array.from({ length: n }, (_, j) => {
    const col = V.map((row) => row[j]);
    return CRITS[j].benefit ? Math.min(...col) : Math.max(...col);
  });
  return rows.map((r, i) => {
    const dPlus = Math.sqrt(V[i].reduce((a, v, j) => a + (v - best[j]) ** 2, 0));
    const dMinus = Math.sqrt(V[i].reduce((a, v, j) => a + (v - worst[j]) ** 2, 0));
    return { ...r, dPlus, dMinus, ers: dMinus / (dPlus + dMinus || 1), weighted: V[i] };
  });
}

// ── The credential scale ──────────────────────────────────────────────────────

export function CredentialScale() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div>
      <p className="text-[9.5px] uppercase tracking-[0.13em] text-white/35 mb-3">
        Credential tier · ordinal KYC scale
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {TIERS.map((t) => (
          <div key={t.n}
            onMouseEnter={() => setHover(t.n)}
            onMouseLeave={() => setHover(null)}
            className="rounded-xl border px-3 py-3.5 text-center transition-all"
            style={{
              borderColor: hover === t.n ? VIOLET : VIOLET + `${20 + t.n * 8}`,
              background: VIOLET + `${Math.round(6 + t.n * 3)}`.padStart(2, "0"),
            }}>
            <p className="text-[1.35rem] font-bold leading-none mb-1.5" style={{ color: VIOLET }}>{t.n}</p>
            <p className="text-[10.5px] text-white/60 leading-snug">{t.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Per-expert scorecard ──────────────────────────────────────────────────────

export function ErsScorecard() {
  const ranked = useMemo(() => topsis(POOL).sort((a, b) => b.ers - a.ers), []);
  const [sel, setSel] = useState(3);
  const e = ranked[sel];
  const top = ranked[0];

  return (
    <div>
      <p className="text-[9.5px] uppercase tracking-[0.13em] text-white/35 mb-3">
        Expert scorecard · select an expert to see their full ERS breakdown
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        {ranked.map((x, i) => (
          <button key={x.name} onClick={() => setSel(i)} aria-pressed={i === sel}
            className="text-[11.5px] px-3 py-1.5 rounded-lg border transition-all"
            style={i === sel
              ? { borderColor: VIOLET, background: VIOLET + "1f", color: "#e9d5ff" }
              : { borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" }}>
            #{i + 1} {x.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-3.5 mb-4">
            <span className="flex items-center justify-center w-[62px] h-[62px] rounded-full border-2 flex-shrink-0"
              style={{ borderColor: VIOLET, background: VIOLET + "14" }}>
              <span className="text-[16px] font-bold tabular-nums" style={{ color: "#e9d5ff" }}>
                {e.ers.toFixed(2)}
              </span>
            </span>
            <span>
              <span className="block text-[15px] font-bold text-white">{e.name}</span>
              <span className="block text-[11px] text-white/45">ERS rank #{sel + 1} of {ranked.length}</span>
              <span className="block text-[11px] mt-0.5" style={{ color: e.ers >= AI_GATE ? "#34d399" : "#fb7185" }}>
                {e.ers >= AI_GATE ? "✓ Clears AI training threshold" : "✕ Below AI training threshold"}
              </span>
            </span>
          </div>

          <div className="space-y-2.5">
            {CRITS.map((c, j) => {
              const raw = e.v[j];
              const frac = c.benefit
                ? (raw - c.min) / (c.max - c.min)
                : 1 - (raw - c.min) / (c.max - c.min);
              const tone = c.benefit ? VIOLET : AMBER;
              return (
                <div key={c.key}>
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="text-[11.5px] text-white/70">
                      <span style={{ color: tone }}>{c.glyph}</span> {c.name}
                      <span className="text-white/30"> w={c.w}</span>
                    </span>
                    <span className="text-[11.5px] text-white/85 tabular-nums">{c.fmt(raw)}</span>
                  </div>
                  <div className="h-[5px] rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full transition-[width] duration-300"
                      style={{ width: `${Math.max(2, Math.min(100, frac * 100))}%`, background: tone }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-[9.5px] uppercase tracking-[0.13em] text-white/35 mb-3">Distance from ideal</p>
          {[
            { l: "d⁺ (from best)", v: e.dPlus, c: "#34d399" },
            { l: "d⁻ (from worst)", v: e.dMinus, c: "#fb7185" },
          ].map((d) => (
            <div key={d.l} className="mb-3">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="text-[11.5px]" style={{ color: d.c }}>{d.l}</span>
                <span className="text-[11.5px] tabular-nums" style={{ color: d.c }}>{d.v.toFixed(4)}</span>
              </div>
              <div className="h-[6px] rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full"
                  style={{ width: `${Math.min(100, (d.v / Math.max(e.dPlus, e.dMinus)) * 100)}%`, background: d.c }} />
              </div>
            </div>
          ))}

          <div className="rounded-lg border border-white/[0.08] bg-black/25 px-3.5 py-3 font-mono">
            <p className="text-[11px] text-white/55 mb-1.5">ERS = d⁻ / (d⁺ + d⁻)</p>
            <p className="text-[11px] text-white/70 mb-1.5">
              = {e.dMinus.toFixed(4)} / ({e.dPlus.toFixed(4)} + {e.dMinus.toFixed(4)})
            </p>
            <p className="text-[15px] font-bold" style={{ color: "#e9d5ff" }}>= {e.ers.toFixed(4)}</p>
          </div>

          <p className="text-[11px] text-white/45 leading-relaxed mt-3">
            {sel === 0
              ? "Top of the pool. The ideal profile is defined by the best value on each criterion, so even #1 sits some distance from it."
              : `Gap to #1: ${(top.ers - e.ers).toFixed(4)} ERS points. The biggest room for improvement is in the highest-weighted criteria.`}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Build your own profile ────────────────────────────────────────────────────

export function ProfileBuilder() {
  const [v, setV] = useState([4.2, 90, 0.65, 6.0, 3]);

  const r = useMemo(() => {
    const rows = [...POOL, { name: "You", v }];
    const scored = topsis(rows).sort((a, b) => b.ers - a.ers);
    const me = scored.find((x) => x.name === "You")!;
    return { scored, me, rank: scored.findIndex((x) => x.name === "You") + 1 };
  }, [v]);

  const clears = r.me.ers >= AI_GATE;

  return (
    <div>
      <p className="text-[9.5px] uppercase tracking-[0.13em] text-white/35 mb-2">
        Build an expert profile · watch ERS update live
      </p>
      <p className="text-[11.5px] text-white/55 leading-relaxed mb-5 max-w-2xl">
        If you were adapting this for your own platform, telehealth or tutoring or freelance, this
        is where you would start. Drag the sliders to profile a hypothetical expert. The TOPSIS
        engine runs against the pool in real time.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          {CRITS.map((c, j) => {
            const tone = c.benefit ? VIOLET : AMBER;
            const contribution = r.me.weighted[j] * 100;
            return (
              <label key={c.key} className="block mb-4">
                <span className="flex items-baseline justify-between mb-2">
                  <span className="text-[12px] text-white/75">
                    <span style={{ color: tone }}>{c.glyph}</span> {c.name}
                    {!c.benefit && <span className="text-white/35 text-[10.5px]"> (lower is better)</span>}
                  </span>
                  <span className="text-[13px] font-bold tabular-nums" style={{ color: tone }}>
                    {c.fmt(v[j])}
                  </span>
                </span>
                <input type="range" min={c.min} max={c.max}
                  step={c.key === "sessions" ? 1 : c.key === "credential" ? 1 : 0.1}
                  value={v[j]}
                  onChange={(e) => setV(v.map((x, k) => (k === j ? Number(e.target.value) : x)))}
                  className="ec-range w-full" aria-label={c.name} />
                <span className="block text-[10px] text-white/30 mt-1">
                  Weighted contribution: {contribution.toFixed(2)} pts
                </span>
              </label>
            );
          })}
        </div>

        <div>
          <div className="rounded-xl border border-white/[0.09] bg-white/[0.02] px-4 py-5 text-center mb-3">
            <p className="text-[9.5px] uppercase tracking-[0.13em] text-white/35 mb-2">
              Expert readiness score
            </p>
            <p className="text-[2.6rem] font-bold leading-none tabular-nums text-white mb-1.5">
              {r.me.ers.toFixed(3)}
            </p>
            <p className="text-[11px] text-white/45">Rank #{r.rank} of {r.scored.length}</p>
          </div>

          <div className="rounded-lg border px-3.5 py-3 mb-3"
            style={{ borderColor: clears ? "#34d3994d" : "#fb71854d", background: clears ? "#34d39912" : "#fb718512" }}>
            <p className="text-[12px] font-semibold mb-1" style={{ color: clears ? "#34d399" : "#fb7185" }}>
              {clears ? `✓ Clears AI gate (ERS ≥ ${AI_GATE})` : `✕ Below AI gate (ERS < ${AI_GATE})`}
            </p>
            <p className="text-[10.5px] text-white/50">
              {clears
                ? "Sessions from this expert are eligible to train the companion model."
                : "Stored for analytics only. Not fed to the model."}
            </p>
          </div>

          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-3">
            <p className="text-[9.5px] uppercase tracking-[0.12em] text-white/35 mb-2.5">Pool comparison</p>
            <div className="space-y-1.5">
              {r.scored.map((x, i) => {
                const you = x.name === "You";
                return (
                  <div key={x.name} className="flex items-baseline justify-between gap-3">
                    <span className={`text-[11px] ${you ? "font-bold text-white" : "text-white/55"}`}>
                      #{i + 1} {x.name}
                    </span>
                    <span className={`text-[11px] tabular-nums ${you ? "font-bold text-white" : "text-white/45"}`}>
                      {x.ers.toFixed(3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
