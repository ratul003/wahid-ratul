"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * The three views from the When Demand Exceeds Supply case study: the evening
 * spike as it unfolds, what surge pricing does to the recovery, and what the
 * incentive engine actually sends to an expert's phone.
 */

const CYAN = "#22d3ee";
const GREEN = "#34d399";
const YELLOW = "#fbbf24";
const RED = "#fb7185";

// ── 1. The evening spike ──────────────────────────────────────────────────────

/** 21:00 to 22:00, three-minute resolution. Queue depth and unique visitors. */
const SPIKE: { m: number; q: number; v: number }[] = [
  { m: 0, q: 2, v: 34 }, { m: 5, q: 3, v: 41 }, { m: 10, q: 3, v: 44 },
  { m: 15, q: 4, v: 52 }, { m: 20, q: 4, v: 58 }, { m: 25, q: 5, v: 66 },
  { m: 30, q: 5, v: 71 }, { m: 35, q: 7, v: 88 }, { m: 38, q: 12, v: 124 },
  { m: 40, q: 16, v: 158 }, { m: 42, q: 22, v: 196 }, { m: 44, q: 28, v: 232 },
  { m: 46, q: 25, v: 214 }, { m: 48, q: 18, v: 171 }, { m: 50, q: 11, v: 128 },
  { m: 53, q: 6, v: 92 }, { m: 56, q: 4, v: 66 }, { m: 58, q: 3, v: 51 },
  { m: 60, q: 2, v: 38 },
];

const BANDS = [
  { from: 0, to: 38, state: "GREEN", tone: GREEN },
  { from: 38, to: 42, state: "YELLOW", tone: YELLOW },
  { from: 42, to: 50, state: "RED", tone: RED },
  { from: 50, to: 60, state: "GREEN", tone: GREEN },
];

const MARKS = [
  { m: 38, label: "Yellow threshold", tone: YELLOW },
  { m: 42, label: "Red surge fires", tone: RED },
  { m: 44, label: "Peak demand", tone: RED },
  { m: 50, label: "Auto-stop", tone: GREEN },
];

const clock = (m: number) => `21:${String(m).padStart(2, "0")}`.replace("21:60", "22:00");
const stateAtMinute = (m: number) => BANDS.find((b) => m >= b.from && m <= b.to) ?? BANDS[0];

const NARRATION: Record<string, string> = {
  GREEN: "All experts available. Platform operating at rest.",
  YELLOW: "Queue building faster than experts can clear it. Incentive engine pushes the first tier.",
  RED: "Critical shortfall. Surge pricing live, every idle expert pinged, escalations routed.",
};

export function DemandTimeline() {
  const [metric, setMetric] = useState<"q" | "v">("q");
  const [cursor, setCursor] = useState(60);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const t = Math.min(1, (ts - start) / 5200);
      setCursor(Math.round(t * 60));
      if (t < 1) raf = requestAnimationFrame(step);
      else setPlaying(false);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const W = 760, H = 300, L = 44, R = 12, T = 30, B = 42;
  const shown = SPIKE.filter((p) => p.m <= cursor);
  const maxV = metric === "q" ? 34 : 260;
  const x = (m: number) => L + (m / 60) * (W - L - R);
  const y = (v: number) => H - B - (v / maxV) * (H - T - B);

  const line = shown.map((p, i) => `${i ? "L" : "M"}${x(p.m).toFixed(1)} ${y(p[metric]).toFixed(1)}`).join(" ");
  const area = shown.length
    ? `${line} L ${x(shown[shown.length - 1].m).toFixed(1)} ${H - B} L ${x(0).toFixed(1)} ${H - B} Z`
    : "";

  const here = shown[shown.length - 1] ?? SPIKE[0];
  const st = stateAtMinute(cursor);

  return (
    <div className="p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.13em] text-white/45 mb-1.5">
            Demand timeline · simulated evening spike (21:00 – 22:00)
          </p>
          <p className="text-[11.5px] text-white/55 leading-relaxed max-w-md">
            Background bands show the barometer state as it changed. Scrub the slider, or hit
            Replay to watch the spike unfold from scratch.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {([["v", "Unique visitors"], ["q", "Queue depth"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setMetric(k)} aria-pressed={metric === k}
              className="text-[11px] px-2.5 py-1.5 rounded-lg border transition-all"
              style={metric === k
                ? { borderColor: CYAN, color: CYAN, background: CYAN + "1a" }
                : { borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}>
              {l}
            </button>
          ))}
          <button onClick={() => { setCursor(0); setPlaying(true); }}
            className="text-[11px] px-2.5 py-1.5 rounded-lg border transition-all"
            style={{ borderColor: CYAN, color: CYAN, background: CYAN + "1a" }}>
            ▶ Replay
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
        aria-label={`Queue depth across an evening spike; at ${clock(cursor)} the barometer is ${st.state}`}>
        {/* State bands */}
        {BANDS.map((b, i) => (
          <g key={i}>
            <rect x={x(b.from)} y={T} width={x(b.to) - x(b.from)} height={H - T - B}
              fill={b.tone} fillOpacity="0.07" />
            <text x={(x(b.from) + x(b.to)) / 2} y={T + 14} fill={b.tone} fontSize="10.5"
              fontWeight="700" textAnchor="middle" opacity="0.8">{b.state}</text>
          </g>
        ))}
        {/* Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={L} x2={W - R} y1={y(maxV * f)} y2={y(maxV * f)}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        ))}
        {[0, 0.5, 1].map((f) => (
          <text key={f} x={L - 8} y={y(maxV * f) + 3.5} fill="rgba(255,255,255,0.35)"
            fontSize="9.5" textAnchor="end">{Math.round(maxV * f)}</text>
        ))}
        {/* Event markers, staggered so the labels do not collide */}
        {MARKS.map((mk, i) => (
          <g key={mk.label}>
            <line x1={x(mk.m)} x2={x(mk.m)} y1={T} y2={H - B}
              stroke={mk.tone} strokeOpacity="0.5" strokeWidth="1" strokeDasharray="3 3" />
            <text x={x(mk.m)} y={T - 16 + (i % 2) * 11} fill={mk.tone} fontSize="9"
              fontWeight="700" textAnchor="middle">{mk.label}</text>
          </g>
        ))}
        {/* The series */}
        {area && <path d={area} fill={CYAN} fillOpacity="0.1" />}
        <path d={line} fill="none" stroke={CYAN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {shown.map((p) => {
          const s = stateAtMinute(p.m);
          return <circle key={p.m} cx={x(p.m)} cy={y(p[metric])} r="3.6" fill={s.tone}
            stroke="#0b0b11" strokeWidth="1.5" />;
        })}
        {/* Where the cursor sits */}
        <circle cx={x(here.m)} cy={y(here[metric])} r="6.5" fill={st.tone} fillOpacity="0.35" />
        {/* Axis */}
        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke="rgba(255,255,255,0.14)" />
        {[0, 10, 20, 30, 38, 42, 50, 60].map((m) => (
          <text key={m} x={x(m)} y={H - B + 16} fill="rgba(255,255,255,0.35)" fontSize="9.5"
            textAnchor="middle">{clock(m)}</text>
        ))}
      </svg>

      <input type="range" min={0} max={60} step={1} value={cursor}
        onChange={(e) => { setPlaying(false); setCursor(Number(e.target.value)); }}
        className="ec-range w-full mt-2" aria-label="Time" />

      {/* What the platform is doing at this moment */}
      <div className="mt-4 rounded-lg border px-4 py-3"
        style={{ borderColor: st.tone + "40", background: st.tone + "0f" }}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-1.5">
          <span className="flex items-center gap-2.5">
            <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] px-2 py-1 rounded"
              style={{ background: st.tone + "26", color: st.tone }}>
              {st.state} state
            </span>
            <span className="text-[13px] font-bold text-white tabular-nums">{clock(cursor)}</span>
          </span>
          <span className="text-[11px] text-white/55 tabular-nums">
            {here.q} sessions queued · {here.v} unique visitors
          </span>
        </div>
        <p className="text-[11.5px] text-white/65 leading-relaxed">{NARRATION[st.state]}</p>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
        {[{ c: GREEN, l: "Healthy, no action" }, { c: YELLOW, l: "Yellow push sent" },
          { c: RED, l: "Surge active" }].map((k) => (
          <span key={k.l} className="flex items-center gap-1.5 text-[10.5px] text-white/55">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: k.c }} />{k.l}
          </span>
        ))}
        <span className="flex items-center gap-1.5 text-[10.5px] text-white/55">
          <span className="w-4 h-[3px] rounded" style={{ background: CYAN }} />
          {metric === "q" ? "Queue depth" : "Unique visitors"}
        </span>
      </div>
    </div>
  );
}

// ── 2. What surge pricing does to the recovery ───────────────────────────────

const WITH = [
  { t: 0, q: 1 }, { t: 5, q: 4 }, { t: 8, q: 32 }, { t: 11, q: 34 },
  { t: 14, q: 34 }, { t: 17, q: 28 }, { t: 20, q: 12 }, { t: 22, q: 3 }, { t: 25, q: 2 },
];
const WITHOUT = [
  { t: 0, q: 1 }, { t: 5, q: 4 }, { t: 8, q: 32 }, { t: 11, q: 48 },
  { t: 14, q: 58 }, { t: 17, q: 63 }, { t: 20, q: 65 }, { t: 22, q: 63 }, { t: 25, q: 60 },
];

const IMPACT = [
  { head: "Peak queue depth", a: "34 sessions", b: "65 sessions", note: "~48% peak reduction", tone: GREEN },
  { head: "Time to recovery", a: "22 min", b: "Persists beyond window", note: "Fully cleared in-window", tone: GREEN },
  { head: "Dropout exposure", a: "Contained", b: "~30% demand at risk", note: "Sessions and revenue protected", tone: YELLOW },
];

export function SurgeImpact() {
  const W = 760, H = 260, L = 44, R = 60, T = 26, B = 34;
  const maxQ = 70;
  const x = (t: number) => L + (t / 25) * (W - L - R);
  const y = (q: number) => H - B - (q / maxQ) * (H - T - B);
  const path = (s: { t: number; q: number }[]) =>
    s.map((p, i) => `${i ? "L" : "M"}${x(p.t).toFixed(1)} ${y(p.q).toFixed(1)}`).join(" ");

  return (
    <div className="p-4 sm:p-5">
      <p className="text-[10px] uppercase tracking-[0.13em] text-white/45 mb-3">
        Surge pricing impact, statistical view
      </p>
      <div className="flex flex-wrap items-center gap-5 mb-2">
        <span className="flex items-center gap-2 text-[11px] text-white/65">
          <span className="w-5 h-[3px] rounded" style={{ background: CYAN }} />With equilibrium
        </span>
        <span className="flex items-center gap-2 text-[11px] text-white/65">
          <span className="w-5 h-[3px] rounded" style={{ background: RED, opacity: 0.85 }} />
          Without equilibrium
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
        aria-label="Queue depth over 25 minutes, with and without the equilibrium engine">
        <path d={`${path(WITHOUT)} L ${x(25)} ${H - B} L ${x(0)} ${H - B} Z`} fill={RED} fillOpacity="0.07" />
        {[0, 20, 40, 60].map((q) => (
          <g key={q}>
            <line x1={L} x2={W - R} y1={y(q)} y2={y(q)} stroke="rgba(255,255,255,0.06)" />
            <text x={L - 8} y={y(q) + 3.5} fill="rgba(255,255,255,0.35)" fontSize="9.5" textAnchor="end">{q}</text>
          </g>
        ))}
        {/* The two moments that matter */}
        <line x1={x(8)} x2={x(8)} y1={T} y2={H - B} stroke={YELLOW} strokeOpacity="0.55" strokeDasharray="3 3" />
        <text x={x(8) + 5} y={T + 8} fill={YELLOW} fontSize="9.5" fontWeight="600">◐ Barometer yellow</text>
        <line x1={x(14)} x2={x(14)} y1={T} y2={H - B} stroke={GREEN} strokeOpacity="0.55" strokeDasharray="3 3" />
        <text x={x(14) + 5} y={T + 8} fill={GREEN} fontSize="9.5" fontWeight="600">Supply recovers</text>

        <path d={path(WITHOUT)} fill="none" stroke={RED} strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round" />
        <path d={path(WITH)} fill="none" stroke={CYAN} strokeWidth="2.75" strokeLinecap="round" />
        <text x={x(20)} y={y(65) - 9} fill={RED} fontSize="12" fontWeight="700" textAnchor="middle">Peak: 65</text>
        <text x={W - R + 4} y={y(2) - 6} fill={CYAN} fontSize="11.5" fontWeight="700">Recovered</text>

        <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke="rgba(255,255,255,0.14)" />
        {[0, 5, 8, 14, 20, 25].map((t) => (
          <text key={t} x={x(t)} y={H - B + 16} fill="rgba(255,255,255,0.35)" fontSize="9.5" textAnchor="middle">{t}m</text>
        ))}
      </svg>

      <div className="grid sm:grid-cols-3 gap-3 mt-4">
        {IMPACT.map((c) => (
          <div key={c.head} className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-3">
            <p className="text-[9.5px] uppercase tracking-[0.12em] text-white/35 mb-2.5">{c.head}</p>
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <span className="text-[10.5px] text-white/45">With</span>
              <span className="text-[12px] font-semibold" style={{ color: CYAN }}>{c.a}</span>
            </div>
            <div className="flex items-baseline justify-between gap-2 mb-2.5">
              <span className="text-[10.5px] text-white/45">Without</span>
              <span className="text-[12px] font-semibold" style={{ color: RED }}>{c.b}</span>
            </div>
            <p className="text-[10px] pt-2 border-t border-white/[0.06]" style={{ color: c.tone }}>{c.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3.5">
        <p className="text-[9.5px] uppercase tracking-[0.12em] text-white/35 mb-2">My design decision</p>
        <p className="text-[11.5px] text-white/65 leading-relaxed">
          I designed this to be self-financing from day one, not as a constraint but as a survival
          condition. If it ever costs the platform money to run, operators switch it off the moment
          they need it most. Funding the bonuses from the surge fees that caused them means the
          system is always affordable, even during the worst spikes.
        </p>
      </div>
    </div>
  );
}

// ── 3. What lands on the expert's phone ──────────────────────────────────────

const PUSH = {
  yellow: {
    label: "Yellow state", channels: "Push notification", tone: YELLOW, emoji: "🟡",
    title: "Demand climbing",
    body: "Bonus tier active for the next hour. Sessions now earn an uplift on your standard rate. 22 experts pinged.",
    cta: "Go online now, 21:38 →",
    yaml: `yellow:
  channels: [in_app, push]
  template: >
    {{ state_emoji }} Demand climbing.
    {{ incentive_summary_standard }}

auto_stop:
  trigger: supply_health == 'green'
  action: pause_all_active_incentives`,
  },
  red: {
    label: "Red state", channels: "Push notification + SMS", tone: RED, emoji: "🔴",
    title: "High demand alert",
    body: "Highest earnings tier now active. Every session tonight earns max bonus + priority badge. 48 experts pinged.",
    cta: "Go online now, 23:08 →",
    yaml: `red:
  channels: [in_app, push, sms, email]
  template: >
    {{ state_emoji }} High demand alert.
    {{ incentive_summary_lucrative }}

auto_stop:
  trigger: supply_health == 'green'
  action: pause_all_active_incentives`,
  },
};

export function ExpertPush() {
  const [state, setState] = useState<"yellow" | "red">("red");
  const p = PUSH[state];

  return (
    <div className="p-4 sm:p-5">
      <p className="text-[10px] uppercase tracking-[0.13em] text-white/45 mb-2">
        What lands on the expert's phone
      </p>
      <p className="text-[11.5px] text-white/55 leading-relaxed mb-4 max-w-2xl">
        The incentive engine fires within seconds of a state change. Two tiers, Yellow for early
        pressure and Red for critical shortfall. The copy is configurable, the channels are
        configurable, and the whole thing stops automatically when supply recovers.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        {(["yellow", "red"] as const).map((k) => (
          <button key={k} onClick={() => setState(k)} aria-pressed={state === k}
            className="text-left rounded-lg border px-3.5 py-3 transition-all"
            style={state === k
              ? { borderColor: PUSH[k].tone, background: PUSH[k].tone + "12" }
              : { borderColor: "rgba(255,255,255,0.1)" }}>
            <span className="flex items-center gap-2 text-[12.5px] font-semibold text-white mb-1">
              <span>{PUSH[k].emoji}</span>{PUSH[k].label}
            </span>
            <span className="block text-[10.5px] text-white/45">{PUSH[k].channels}</span>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[1.3fr_1fr] gap-4">
        <div className="rounded-lg border border-white/[0.08] bg-black/30 p-4 min-w-0">
          <p className="text-[9.5px] uppercase tracking-[0.12em] text-white/35 mb-2.5">
            Notification copy template (YAML)
          </p>
          <pre className="text-[10.5px] leading-relaxed font-mono text-white/70 overflow-x-auto">{p.yaml}</pre>
        </div>

        {/* The phone */}
        <div className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-3">
          <div className="flex items-center justify-between text-[9px] text-white/40 mb-2.5 px-1">
            <span className="tabular-nums">{state === "red" ? "23:08" : "21:38"}</span>
            <span>5G ●●● 100%</span>
          </div>
          <div className="rounded-xl border border-white/[0.09] bg-[#12121a] p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold"
                style={{ background: CYAN + "33", color: CYAN }}>C</span>
              <span className="text-[11px] font-semibold text-white/85">Expert App</span>
              <span className="ml-auto text-[9.5px] text-white/35">now</span>
            </div>
            <p className="text-[12px] font-bold text-white mb-1.5">
              {p.emoji} {p.title}
            </p>
            <p className="text-[11px] text-white/65 leading-relaxed mb-2.5">{p.body}</p>
            <p className="text-[11px] font-medium" style={{ color: CYAN }}>{p.cta}</p>
          </div>
          <div className="flex gap-1.5 mt-2.5">
            {p.channels.split(" + ").map((c) => (
              <span key={c} className="text-[9px] px-2 py-1 rounded bg-white/[0.05] text-white/45">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
