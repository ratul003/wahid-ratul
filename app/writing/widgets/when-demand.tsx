"use client";

/**
 * Live instruments embedded inside "Why Surge Pricing Does Not Work in Every Online Marketplace".
 *
 * These are ports of the working components from the project site
 * (when-demand-exceeds-supply.vercel.app), narrowed for the article column.
 * The arithmetic is the same, so a reader who drags the slider here gets the
 * same numbers the film and the case study show.
 */

import React, { useState } from "react";

const CYAN = "#06b6d4";
type State = "green" | "yellow" | "red";
const STATE_COLOR: Record<State, string> = {
  green: "#22c55e",
  yellow: "#f59e0b",
  red: "#ef4444",
};

function Frame({
  label,
  children,
  tone = "rgba(255,255,255,0.09)",
}: {
  label: string;
  children: React.ReactNode;
  tone?: string;
}) {
  return (
    <figure
      style={{
        margin: "2.5rem 0",
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${tone}`,
        borderRadius: 16,
        padding: "22px 24px",
        transition: "border-color .4s",
      }}
    >
      <figcaption
        style={{
          fontSize: "0.64rem",
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.09em",
          marginBottom: 16,
        }}
      >
        {label}
      </figcaption>
      {children}
    </figure>
  );
}

/* ── Queue pressure ────────────────────────────────────────────────────────── */

export function QueueSim() {
  const [mult, setMult] = useState(1.0);

  const supply = 18; // 3 experts at 6 sessions each
  const demand = 24 * mult;
  const deficit = demand - supply;
  const qAt10 = Math.max(0, (deficit / 60) * 10);
  const delay = (qAt10 / supply) * 60;

  const state: State = delay >= 60 ? "red" : delay >= 30 ? "yellow" : "green";
  const sc = STATE_COLOR[state];
  const callout: Record<State, string> = {
    green: "Platform healthy. Nothing fires.",
    yellow: "Incentive engine activates. Surge starts. Offline experts get pushed.",
    red: "All channels fire at once. Surge at max. AI absorbs non-urgent demand.",
  };

  const PW = 520, PH = 150, pL = 42, pR = 44, pT = 10, pB = 30;
  const cW = PW - pL - pR, cH = PH - pT - pB;
  const maxQ = Math.max(18, qAt10 * 1.5 + 3);
  const xs = (t: number) => pL + (t / 15) * cW;
  const ys = (q: number) => pT + cH - Math.min(1, q / maxQ) * cH;
  const yellowQ = (30 * supply) / 60;
  const redQ = (60 * supply) / 60;

  const pts = Array.from({ length: 31 }, (_, i) => {
    const t = i * 0.5;
    return `${xs(t).toFixed(1)},${ys(Math.max(0, (deficit / 60) * t)).toFixed(1)}`;
  }).join(" ");

  return (
    <Frame label="Try it yourself · drag the demand slider" tone={`${sc}33`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Demand multiplier</span>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "1.15rem", fontWeight: 800, color: sc, transition: "color .3s" }}>
            {mult.toFixed(1)}×
          </span>
          <span style={{ fontSize: "0.74rem", color: "#64748b" }}>{demand.toFixed(0)} sessions/hr arriving</span>
        </span>
      </div>
      <input
        type="range" min={1} max={6} step={0.1} value={mult}
        onChange={(e) => setMult(parseFloat(e.target.value))}
        aria-label="Demand multiplier"
        style={{ width: "100%", accentColor: sc, cursor: "pointer" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.66rem", color: "#334155", marginTop: 4, marginBottom: 18 }}>
        <span>1× · quiet evening</span>
        <span>6× · 11pm spike</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, marginBottom: 18 }}>
        {[
          { label: "Supply (fixed)", value: `${supply}/hr`, note: "3 experts online", color: CYAN },
          { label: "Demand arriving", value: `${demand.toFixed(0)}/hr`, note: "customers requesting", color: deficit > 0 ? "#ef4444" : "#22c55e" },
          { label: "Queue at 10 min", value: `${qAt10.toFixed(0)}`, note: "waiting, unassigned", color: sc },
          { label: "Delay time", value: `${delay.toFixed(0)} min`, note: "to an expert", color: sc },
        ].map((m) => (
          <div key={m.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 9, padding: "10px 12px", border: `1px solid ${m.color}22`, transition: "border-color .3s" }}>
            <div style={{ fontSize: "0.57rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>{m.label}</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: m.color, transition: "color .3s" }}>{m.value}</div>
            <div style={{ fontSize: "0.62rem", color: "#334155", marginTop: 2 }}>{m.note}</div>
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${PW} ${PH}`} style={{ width: "100%", display: "block", marginBottom: 14 }}>
        {[0, Math.round(maxQ * 0.4), Math.round(maxQ * 0.8)].map((q) => (
          <g key={q}>
            <line x1={pL} y1={ys(q)} x2={PW - pR} y2={ys(q)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={pL - 5} y={ys(q) + 4} fontSize="8" fill="#334155" textAnchor="end" fontFamily="system-ui">{q}</text>
          </g>
        ))}
        {[0, 5, 10, 15].map((t) => (
          <text key={t} x={xs(t)} y={PH - 5} fontSize="8" fill="#334155" textAnchor="middle" fontFamily="system-ui">{t}m</text>
        ))}
        {maxQ > yellowQ && (
          <>
            <line x1={pL} y1={ys(yellowQ)} x2={PW - pR} y2={ys(yellowQ)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            <text x={PW - pR + 4} y={ys(yellowQ) + 3} fontSize="8" fill="#f59e0b" fontFamily="system-ui">Yellow</text>
          </>
        )}
        {maxQ > redQ && (
          <>
            <line x1={pL} y1={ys(redQ)} x2={PW - pR} y2={ys(redQ)} stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            <text x={PW - pR + 4} y={ys(redQ) + 3} fontSize="8" fill="#ef4444" fontFamily="system-ui">Red</text>
          </>
        )}
        <line x1={pL} y1={pT} x2={pL} y2={pT + cH} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1={pL} y1={pT + cH} x2={PW - pR} y2={pT + cH} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <polygon points={`${xs(0)},${ys(0)} ${pts} ${xs(15)},${ys(0)}`} fill={`${sc}18`} style={{ transition: "fill .4s" }} />
        <polyline points={pts} fill="none" stroke={sc} strokeWidth="2.5" style={{ transition: "stroke .4s" }} />
        <text x={10} y={pT + cH / 2} fontSize="8" fill="#334155" textAnchor="middle" fontFamily="system-ui" transform={`rotate(-90, 10, ${pT + cH / 2})`}>Queue</text>
      </svg>

      <div style={{ padding: "11px 15px", background: `${sc}12`, border: `1px solid ${sc}2e`, borderRadius: 10, transition: "all .4s" }}>
        <span style={{ fontSize: "0.82rem", color: sc, fontWeight: 600 }}>{callout[state]}</span>
      </div>
    </Frame>
  );
}

/* ── Barometer ─────────────────────────────────────────────────────────────── */

const BARO: Record<State, { label: string; status: string; delay: string; dropout: string; supply: string[]; demand: string[] }> = {
  green: {
    label: "Green", status: "Operating normally, nothing fires",
    delay: "< 30 min", dropout: "< 5%",
    supply: ["Standard earnings visibility", "Tiered membership benefits highlighted"],
    demand: ["Base pricing, no surge", "Standard booking flow"],
  },
  yellow: {
    label: "Yellow", status: "Supply pressure, incentive engine activates",
    delay: "30–60 min", dropout: "5–10%",
    supply: ["Push to active, scheduled and offline experts", "“X customers waiting right now” framing", "Revenue share boost + 1.5× rating multiplier"],
    demand: ["Light surge fee on new bookings", "“High demand, booking now secures your slot”"],
  },
  red: {
    label: "Red", status: "Critical shortfall, maximum response",
    delay: "≥ 60 min", dropout: "≥ 10%",
    supply: ["SMS + in-app + push across all tiers at once", "High-earnings bonus tier unlocked", "Auto-stop the moment supply recovers"],
    demand: ["Full surge, disclosed to the customer", "Estimated wait shown at booking", "Queue position indicator"],
  },
};

export function Barometer() {
  const [state, setState] = useState<State>("green");
  const cfg = BARO[state];
  const c = STATE_COLOR[state];

  return (
    <Frame label="The barometer · click a state" tone={`${c}33`}>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {(["green", "yellow", "red"] as State[]).map((s) => (
          <button
            key={s}
            onClick={() => setState(s)}
            style={{
              flex: "1 1 150px", padding: "11px 14px", borderRadius: 10, cursor: "pointer",
              textAlign: "left", transition: "all .2s",
              border: `2px solid ${state === s ? STATE_COLOR[s] : "rgba(255,255,255,0.08)"}`,
              background: state === s ? `${STATE_COLOR[s]}14` : "rgba(255,255,255,0.02)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: STATE_COLOR[s], boxShadow: state === s ? `0 0 10px ${STATE_COLOR[s]}` : "none" }} />
              <span style={{ fontWeight: 700, fontSize: "0.86rem", color: state === s ? STATE_COLOR[s] : "#64748b" }}>{BARO[s].label}</span>
            </span>
            <span style={{ display: "block", fontSize: "0.68rem", color: "#475569", marginTop: 4 }}>{BARO[s].status}</span>
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 9, marginBottom: 16 }}>
        {[["Delay time trigger", cfg.delay], ["Dropout rate trigger", cfg.dropout]].map(([l, v]) => (
          <div key={l} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "11px 14px" }}>
            <div style={{ fontSize: "0.62rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{l}</div>
            <div style={{ color: c, fontWeight: 700, fontSize: "1.02rem", transition: "color .4s" }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {[
          { head: "Supply side · what experts get", items: cfg.supply, dot: c },
          { head: "Demand side · what customers see", items: cfg.demand, dot: "#f59e0b" },
        ].map((col) => (
          <div key={col.head} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: "0.62rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>{col.head}</div>
            {col.items.map((a) => (
              <div key={a} style={{ display: "flex", gap: 8, marginBottom: 7 }}>
                <span style={{ color: col.dot, fontSize: "0.62rem", marginTop: 4, flexShrink: 0 }}>▸</span>
                <span style={{ fontSize: "0.79rem", color: "#cbd5e1", lineHeight: 1.45 }}>{a}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ── Supply response by incentive tier ─────────────────────────────────────── */

const TIERS = [
  { tier: "No incentive", rate: 8, color: "#475569", note: "organic, experts who happen to open the app" },
  { tier: "Yellow · $8/session", rate: 38, color: "#f59e0b", note: "+1.5× rating · 10% revenue share boost" },
  { tier: "Red · $16/session", rate: 55, color: "#ef4444", note: "+2× rating · 20% revenue share · SMS push" },
];

export function SupplyResponse() {
  return (
    <Frame label="Expert acceptance rate by incentive tier">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {TIERS.map((r) => (
          <div key={r.tier}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 7 }}>
              <span>
                <span style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#e2e8f0" }}>{r.tier}</span>
                <span style={{ display: "block", fontSize: "0.68rem", color: "#475569", marginTop: 2 }}>{r.note}</span>
              </span>
              <span style={{ fontSize: "1.35rem", fontWeight: 800, color: r.color, lineHeight: 1 }}>{r.rate}%</span>
            </div>
            <div style={{ height: 11, background: "rgba(255,255,255,0.05)", borderRadius: 6, overflow: "hidden", position: "relative" }}>
              <div style={{ height: "100%", width: `${r.rate}%`, borderRadius: 6, background: `linear-gradient(90deg, ${r.color}80, ${r.color})` }} />
              {r.rate > 8 && (
                <div style={{ position: "absolute", top: 0, left: "8%", width: 1, height: "100%", background: "rgba(255,255,255,0.28)" }} />
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, padding: "14px 16px", background: `${CYAN}0a`, border: `1px solid ${CYAN}22`, borderRadius: 12 }}>
        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: CYAN, display: "block", marginBottom: 5 }}>4.75×</span>
        <span style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.55 }}>
          Yellow tier (38%) against the organic base (8%). A 30 point absolute lift from structured
          incentives alone, which is why Red stayed a backstop.
        </span>
      </div>
    </Frame>
  );
}

/* ── Recovery, with and without the engine ─────────────────────────────────── */

const WITH = [
  { t: 0, q: 0 }, { t: 5, q: 4 }, { t: 8, q: 31 }, { t: 10, q: 34 }, { t: 12, q: 34 },
  { t: 14, q: 28 }, { t: 16, q: 20 }, { t: 18, q: 12 }, { t: 20, q: 5 }, { t: 22, q: 1 }, { t: 25, q: 0 },
];
const WITHOUT = [
  { t: 0, q: 0 }, { t: 5, q: 4 }, { t: 8, q: 31 }, { t: 10, q: 43 }, { t: 12, q: 54 },
  { t: 14, q: 61 }, { t: 16, q: 64 }, { t: 18, q: 65 }, { t: 20, q: 65 }, { t: 22, q: 63 }, { t: 25, q: 60 },
];

export function RecoveryTimeline() {
  const W = 560, H = 215, padL = 46, padR = 16, padT = 16, padB = 38;
  const cW = W - padL - padR, cH = H - padT - padB;
  const xOf = (t: number) => padL + (t / 25) * cW;
  const yOf = (q: number) => padT + cH - (q / 70) * cH;
  const pts = (d: { t: number; q: number }[]) => d.map((p) => `${xOf(p.t).toFixed(1)},${yOf(p.q).toFixed(1)}`).join(" ");

  return (
    <Frame label="Queue depth over 25 minutes, replayed from a real evening">
      <div style={{ display: "flex", gap: 18, marginBottom: 12, flexWrap: "wrap" }}>
        {[{ c: CYAN, l: "With the engine", d: false }, { c: "#ef4444", l: "Without it", d: true }].map((leg) => (
          <span key={leg.l} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <svg width="24" height="10" viewBox="0 0 24 10">
              <line x1="0" y1="5" x2="24" y2="5" stroke={leg.c} strokeWidth={leg.d ? 2 : 2.5} strokeDasharray={leg.d ? "4 2" : undefined} />
            </svg>
            <span style={{ fontSize: "0.73rem", color: "#94a3b8" }}>{leg.l}</span>
          </span>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
        {[0, 20, 40, 60].map((q) => (
          <g key={q}>
            <line x1={padL} y1={yOf(q)} x2={W - padR} y2={yOf(q)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={padL - 6} y={yOf(q) + 4} textAnchor="end" fontSize="9" fill="#475569" fontFamily="system-ui">{q}</text>
          </g>
        ))}
        <text x={12} y={padT + cH / 2} textAnchor="middle" fontSize="8" fill="#475569" fontFamily="system-ui" transform={`rotate(-90, 12, ${padT + cH / 2})`}>Queue depth</text>
        {[0, 5, 8, 14, 20, 25].map((t) => (
          <text key={t} x={xOf(t)} y={H - 6} textAnchor="middle" fontSize="9" fill="#475569" fontFamily="system-ui">{t}m</text>
        ))}
        <line x1={padL} y1={padT} x2={padL} y2={padT + cH} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1={padL} y1={padT + cH} x2={W - padR} y2={padT + cH} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        {[{ t: 8, l: "Barometer Red", c: "#ef4444" }, { t: 14, l: "Supply recovers", c: "#22c55e" }].map((ev) => (
          <g key={ev.t}>
            <line x1={xOf(ev.t)} y1={padT} x2={xOf(ev.t)} y2={padT + cH} stroke={ev.c} strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />
            <text x={xOf(ev.t) + 4} y={padT + 11} fontSize="8" fill={ev.c} fontFamily="system-ui">{ev.l}</text>
          </g>
        ))}
        <polygon points={`${xOf(0)},${yOf(0)} ${pts(WITHOUT)} ${xOf(25)},${yOf(0)}`} fill="rgba(239,68,68,0.07)" />
        <polyline points={pts(WITHOUT)} fill="none" stroke="#ef4444" strokeWidth="2" strokeOpacity="0.55" strokeDasharray="5 3" />
        <polyline points={pts(WITH)} fill="none" stroke={CYAN} strokeWidth="2.5" />
        <text x={xOf(18) + 4} y={yOf(65) - 6} fontSize="9" fill="#ef4444" fontFamily="system-ui" fontWeight="600">Peak 65</text>
        <text x={xOf(21) + 4} y={yOf(1) - 6} fontSize="9" fill={CYAN} fontFamily="system-ui" fontWeight="600">Recovered</text>
      </svg>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 9, marginTop: 14 }}>
        {[
          { l: "Peak queue", a: "34", b: "65", d: "48% lower peak" },
          { l: "Time to clear", a: "22 min", b: "never, in window", d: "cleared in window" },
          { l: "Net cost of the response", a: "$40", b: "the dropout", d: "$420 in, $380 out" },
        ].map((s) => (
          <div key={s.l} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: "0.58rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 7 }}>{s.l}</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <span style={{ fontSize: "0.72rem", color: "#64748b" }}>With</span>
              <span style={{ fontSize: "0.72rem", color: CYAN, fontWeight: 700 }}>{s.a}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Without</span>
              <span style={{ fontSize: "0.72rem", color: "#ef4444", fontWeight: 700 }}>{s.b}</span>
            </div>
            <div style={{ fontSize: "0.68rem", color: "#94a3b8", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 6 }}>{s.d}</div>
          </div>
        ))}
      </div>
    </Frame>
  );
}
