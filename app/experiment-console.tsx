"use client";

import { useMemo, useState } from "react";

/**
 * A real two-proportion sequential test, computed in the browser.
 *
 * The point of this panel is that nothing in it is mocked. Move a slider and the
 * standard error, the interval, the power and the decision are all recomputed
 * from the numbers on screen. The decision rule is the one I shipped at
 * Optimizely: a 5,000-impression floor per arm, 80% power against a declared
 * MDE, and exactly one ship-or-kill call per launch.
 */

// ── Statistics ────────────────────────────────────────────────────────────────

/** Abramowitz & Stegun 7.1.26. Max absolute error 1.5e-7. */
function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const z = Math.abs(x);
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429,
    p = 0.3275911;
  const t = 1 / (1 + p * z);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
  return sign * y;
}

/** Standard normal CDF. */
const Phi = (z: number) => 0.5 * (1 + erf(z / Math.SQRT2));

const Z_ALPHA = 1.959964; // two-sided 95%
const Z_POWER = 0.841621; // 80%
const GATE = 5000; // minimum impressions per arm
const TARGET_POWER = 0.8;
const MDE_REL = 0.05; // declared minimum detectable effect, +5% relative
const BASELINE = 0.124; // control L1 engagement rate

type Verdict = {
  key: "gate" | "running" | "ship" | "kill" | "flat";
  label: string;
  glyph: string;
  color: string;
  reason: string;
};

function analyse(n: number, liftRel: number) {
  const pc = BASELINE;
  const pt = pc * (1 + liftRel);
  const diff = pt - pc;

  // Pooled SE for the test statistic, unpooled for the interval.
  const pBar = (pc + pt) / 2;
  const sePool = Math.sqrt((pBar * (1 - pBar) * 2) / n);
  const seUnpool = Math.sqrt((pc * (1 - pc)) / n + (pt * (1 - pt)) / n);

  const z = sePool > 0 ? diff / sePool : 0;
  const pValue = 2 * (1 - Phi(Math.abs(z)));
  const ciLo = diff - Z_ALPHA * seUnpool;
  const ciHi = diff + Z_ALPHA * seUnpool;

  // Power against the *declared* MDE, not the observed effect. Post-hoc power
  // on the observed effect is circular and tells you nothing.
  const dMde = pc * MDE_REL;
  const pBarMde = (pc + pc * (1 + MDE_REL)) / 2;
  const seMde = Math.sqrt((pBarMde * (1 - pBarMde) * 2) / n);
  const power = Phi(dMde / seMde - Z_ALPHA);

  // n per arm needed to reach 80% power at that MDE.
  const nRequired = Math.ceil(
    (2 * pBarMde * (1 - pBarMde) * Math.pow(Z_ALPHA + Z_POWER, 2)) / Math.pow(dMde, 2)
  );

  let verdict: Verdict;
  if (n < GATE) {
    verdict = {
      key: "gate",
      label: "Below gate",
      glyph: "⊘",
      color: "#94a3b8",
      reason: `${GATE.toLocaleString()} impressions per arm is the floor. Reading a result here is reading noise.`,
    };
  } else if (power < TARGET_POWER) {
    verdict = {
      key: "running",
      label: "Keep running",
      glyph: "◴",
      color: "#fbbf24",
      reason: `Only ${(power * 100).toFixed(0)}% power against a +${(MDE_REL * 100).toFixed(0)}% MDE. Needs ${nRequired.toLocaleString()} per arm to call this fairly.`,
    };
  } else if (ciLo > 0) {
    verdict = {
      key: "ship",
      label: "Ship it",
      glyph: "✓",
      color: "#34d399",
      reason: `The whole interval sits above zero at ${(power * 100).toFixed(0)}% power. The effect is real and the test was powered to find it.`,
    };
  } else if (ciHi < 0) {
    verdict = {
      key: "kill",
      label: "Kill it",
      glyph: "✕",
      color: "#fb7185",
      reason: `The whole interval sits below zero. This variant is worse, and the test had enough power to say so.`,
    };
  } else {
    verdict = {
      key: "flat",
      label: "No decision",
      glyph: "—",
      color: "#94a3b8",
      reason: `The interval straddles zero at ${(power * 100).toFixed(0)}% power. Powered, and still flat: ship neither.`,
    };
  }

  return { pc, pt, diff, ciLo, ciHi, z, pValue, power, nRequired, verdict };
}

// ── Interval plot ─────────────────────────────────────────────────────────────

/**
 * The point estimate and its 95% interval against zero. One measure, one mark,
 * so there is no legend to draw - the caption names it.
 *
 * Laid out in CSS percentages rather than SVG: a non-uniformly scaled viewBox
 * turns the point-estimate dot into an oval and fattens the marks.
 */
function IntervalPlot({
  diff,
  ciLo,
  ciHi,
  color,
}: {
  diff: number;
  ciLo: number;
  ciHi: number;
  color: string;
}) {
  // Symmetric domain around zero, so the zero line stays centred and a crossing
  // interval reads as a crossing.
  const reach = Math.max(Math.abs(ciLo), Math.abs(ciHi), 0.004) * 1.2;
  const pct = (v: number) => 4 + ((v + reach) / (2 * reach)) * 92;
  const pp = (v: number) => `${v >= 0 ? "+" : ""}${(v * 100).toFixed(2)}`;

  const xLo = pct(ciLo);
  const xHi = pct(ciHi);

  return (
    <figure
      className="m-0"
      role="img"
      aria-label={`95% confidence interval from ${pp(ciLo)} to ${pp(ciHi)} percentage points, point estimate ${pp(diff)}`}
    >
      <div className="relative h-[52px]">
        {/* Zero reference, recessive */}
        <div
          className="absolute top-1 bottom-4 w-px"
          style={{
            left: `${pct(0)}%`,
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(255,255,255,0.32) 0 2px, transparent 2px 4px)",
          }}
        />
        {/* Interval: one thin mark with rounded ends */}
        <div
          className="absolute h-[5px] rounded-full"
          style={{
            left: `${xLo}%`,
            width: `${xHi - xLo}%`,
            top: 15,
            background: color,
            opacity: 0.34,
          }}
        />
        {/* End caps */}
        {[xLo, xHi].map((x) => (
          <div
            key={x}
            className="absolute w-[2px] h-[13px] rounded-full"
            style={{ left: `${x}%`, top: 11, background: color, marginLeft: -1 }}
          />
        ))}
        {/* Point estimate, ringed in the surface colour so it reads over the bar */}
        <div
          className="absolute w-[9px] h-[9px] rounded-full"
          style={{
            left: `${pct(diff)}%`,
            top: 13,
            marginLeft: -4.5,
            background: color,
            boxShadow: "0 0 0 2px #0b0b11",
          }}
        />
        {/* Direct labels on the bounds only, never a number on every point */}
        {[
          { x: xLo, v: ciLo },
          { x: xHi, v: ciHi },
        ].map(({ x, v }) => (
          <span
            key={`l${x}`}
            className="absolute text-[10px] text-white/55 tabular-nums whitespace-nowrap"
            style={{ left: `${x}%`, top: 28, transform: "translateX(-50%)" }}
          >
            {pp(v)}
          </span>
        ))}
        <span
          className="absolute text-[10px] text-white/35 tabular-nums"
          style={{ left: `${pct(0)}%`, bottom: 0, transform: "translateX(-50%)" }}
        >
          0
        </span>
      </div>
      <figcaption className="text-[10px] text-white/40 text-center mt-1">
        95% interval on the absolute difference, in percentage points
      </figcaption>
    </figure>
  );
}

// ── How the distributions separate ────────────────────────────────────────────

const CTRL = "#818cf8";
const TREAT = "#34d399";

/**
 * The two arms as sampling distributions of their own means. Both narrow as
 * impressions accumulate, so significance is something you watch happen rather
 * than something the panel asserts. Driven by the same two sliders, which is
 * what accumulating impressions actually looks like.
 */
function Distributions({
  pc, pt, diff, n, pValue, gated,
}: { pc: number; pt: number; diff: number; n: number; pValue: number; gated: boolean }) {
  const W = 720, H = 232, PAD = 8, BASE = H - 26;

  const seArm = Math.sqrt((pc * (1 - pc)) / Math.max(n, 1));
  const centre = (pc + pt) / 2;
  const half = Math.max(seArm * 3.6, Math.abs(diff) * 2.1, 1e-4);
  const x = (v: number) => PAD + ((v - (centre - half)) / (2 * half)) * (W - PAD * 2);
  const peak = 1 / (seArm * Math.sqrt(2 * Math.PI));
  const y = (d: number) => BASE - (d / peak) * (H - 58);

  const path = (mu: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 130; i++) {
      const v = centre - half + (i / 130) * 2 * half;
      const d = Math.exp(-((v - mu) ** 2) / (2 * seArm ** 2)) / (seArm * Math.sqrt(2 * Math.PI));
      pts.push(`${i ? "L" : "M"}${x(v).toFixed(1)} ${y(d).toFixed(1)}`);
    }
    return pts.join(" ");
  };
  const fill = (mu: number) =>
    `${path(mu)} L ${x(centre + half).toFixed(1)} ${BASE} L ${x(centre - half).toFixed(1)} ${BASE} Z`;

  const sig = pValue < 0.05;
  const verdict = !gated
    ? { t: "Below the 5,000 impression gate", c: "#94a3b8" }
    : sig
      ? { t: "Effect is statistically significant", c: TREAT }
      : { t: "Not separated at this sample size", c: "#fbbf24" };

  return (
    <figure className="m-0">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <p className="text-[10px] uppercase tracking-[0.13em] text-white/45">
          Statistical significance: how the distributions separate
        </p>
        <div className="flex items-center gap-4">
          {[{ c: CTRL, l: "Control" }, { c: TREAT, l: "Treatment" }].map((k) => (
            <span key={k.l} className="flex items-center gap-1.5 text-[11px] text-white/60">
              <span className="w-4 h-[3px] rounded" style={{ background: k.c }} />
              {k.l}
            </span>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
        aria-label={`Two sampling distributions at ${n.toLocaleString()} impressions per arm; p equals ${pValue.toFixed(4)}`}>
        <path d={fill(pc)} fill={CTRL} fillOpacity="0.13" />
        <path d={fill(pt)} fill={TREAT} fillOpacity="0.13" />
        {[{ mu: pc, c: CTRL, l: "μ₀" }, { mu: pt, c: TREAT, l: "μ₁" }].map((m) => (
          <g key={m.l}>
            <line x1={x(m.mu)} x2={x(m.mu)} y1={y(peak) - 3} y2={BASE}
              stroke={m.c} strokeOpacity="0.55" strokeWidth="1" strokeDasharray="4 3" />
            <text x={x(m.mu)} y={y(peak) - 7} fill={m.c} fontSize="11" textAnchor="middle">{m.l}</text>
          </g>
        ))}
        <path d={path(pc)} fill="none" stroke={CTRL} strokeWidth="2.5" strokeLinecap="round" />
        <path d={path(pt)} fill="none" stroke={TREAT} strokeWidth="2.5" strokeLinecap="round" />
        <line x1={PAD} x2={W - PAD} y1={BASE} y2={BASE} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />

        <text x={W / 2} y={H / 2 + 10} fill={verdict.c} fontSize="18" fontWeight="700" textAnchor="middle">
          {verdict.t}
        </text>
        <text x={W - PAD - 4} y={40} fill={verdict.c} fontSize="20" fontWeight="700" textAnchor="end">
          p = {pValue < 0.0001 ? "<0.0001" : pValue.toFixed(4)}{gated && sig ? " ✓" : ""}
        </text>
      </svg>

      {/* Impressions, and the gate they have to clear */}
      <div className="mt-1">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-[10.5px] text-white/45">Impressions accumulating</span>
          <span className="text-[10.5px] tabular-nums" style={{ color: gated ? TREAT : "#94a3b8" }}>
            {n.toLocaleString()}{gated ? " ✓ past 5K gate" : ` · ${(GATE - n).toLocaleString()} to the gate`}
          </span>
        </div>
        <div className="relative h-[6px] rounded-full bg-white/[0.06] overflow-hidden">
          <div className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${(n / 60000) * 100}%`, background: `linear-gradient(90deg, ${CTRL}, ${TREAT})` }} />
          {/* The gate is a count of impressions, so it marks this axis, not the metric axis */}
          <div className="absolute inset-y-0 w-px bg-amber-300/70" style={{ left: `${(GATE / 60000) * 100}%` }} />
        </div>
      </div>
      <figcaption className="text-[10px] text-white/35 mt-2.5">
        Both arms drawn as N(p, √(p(1−p)/n)). Drag impressions per arm and the curves
        narrow until they separate, which is the whole of what significance means here.
      </figcaption>
    </figure>
  );
}

// ── Console ───────────────────────────────────────────────────────────────────

function Row({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-[7px] border-b border-white/[0.05] last:border-b-0">
      <span className="text-[10.5px] uppercase tracking-[0.1em] text-white/40 flex-shrink-0">
        {label}
      </span>
      <span className="text-[12px] text-white/85 tabular-nums text-right">
        {value}
        {hint && <span className="text-white/35 ml-1.5">{hint}</span>}
      </span>
    </div>
  );
}

export default function ExperimentConsole() {
  const [n, setN] = useState(9000);
  const [liftPct, setLiftPct] = useState(4.2);

  const { result, micros } = useMemo(() => {
    const t0 = performance.now();
    const r = analyse(n, liftPct / 100);
    const dt = performance.now() - t0;
    return { result: r, micros: dt };
  }, [n, liftPct]);

  const { pc, pt, diff, ciLo, ciHi, pValue, power, nRequired, verdict } = result;
  const v = verdict;

  return (
    <div className="rounded-xl border border-white/[0.09] bg-[#0b0b11] overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-white/[0.07] bg-white/[0.02]">
        <span className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
        </span>
        <code className="text-[11px] text-white/45 font-mono truncate">
          experiment://l1-engagement/checkout-flow-v2
        </code>
        <span className="ml-auto flex items-center gap-1.5 flex-shrink-0">
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            style={{ boxShadow: "0 0 7px #34d399" }}
          />
          <span className="text-[10px] uppercase tracking-[0.12em] text-emerald-300/80">
            live
          </span>
          <span className="text-[10px] text-white/30 ml-1 tabular-nums hidden sm:inline">
            {micros < 0.01 ? "<0.01" : micros.toFixed(2)} ms
          </span>
        </span>
      </div>

      <div className="grid md:grid-cols-[1fr_1.15fr] divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
        {/* Controls */}
        <div className="p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/35 mb-4">
            Inputs
          </p>

          <label className="block mb-5">
            <span className="flex items-baseline justify-between mb-2">
              <span className="text-[11.5px] text-white/70">Impressions per arm</span>
              <span className="text-[12.5px] font-semibold text-white tabular-nums">
                {n.toLocaleString()}
              </span>
            </span>
            <input
              type="range"
              min={500}
              max={60000}
              step={500}
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              className="ec-range w-full"
              aria-label="Impressions per arm"
            />
          </label>

          <label className="block mb-5">
            <span className="flex items-baseline justify-between mb-2">
              <span className="text-[11.5px] text-white/70">Observed lift</span>
              <span className="text-[12.5px] font-semibold text-white tabular-nums">
                {liftPct >= 0 ? "+" : ""}
                {liftPct.toFixed(1)}%
              </span>
            </span>
            <input
              type="range"
              min={-6}
              max={12}
              step={0.1}
              value={liftPct}
              onChange={(e) => setLiftPct(Number(e.target.value))}
              className="ec-range w-full"
              aria-label="Observed relative lift, percent"
            />
          </label>

          <p className="text-[10px] uppercase tracking-[0.16em] text-white/35 mb-2 mt-7">
            Declared before launch
          </p>
          <div className="space-y-0">
            <Row label="Baseline" value={`${(pc * 100).toFixed(1)}%`} />
            <Row label="MDE" value={`+${(MDE_REL * 100).toFixed(0)}% rel`} />
            <Row label="Alpha" value="0.05" hint="two-sided" />
            <Row label="Power target" value="80%" />
            <Row label="Impression gate" value={GATE.toLocaleString()} />
          </div>
        </div>

        {/* Readout */}
        <div className="p-4 sm:p-5">
          {/* Verdict carries a glyph and a word, never colour alone */}
          <div
            className="flex items-start gap-3 rounded-lg px-3.5 py-3 mb-4 border"
            style={{
              borderColor: v.color + "4d",
              background: v.color + "12",
            }}
          >
            <span
              className="text-[15px] leading-none mt-[3px] flex-shrink-0"
              style={{ color: v.color }}
              aria-hidden="true"
            >
              {v.glyph}
            </span>
            <span>
              <span
                className="block text-[13px] font-semibold leading-tight mb-1"
                style={{ color: v.color }}
              >
                {v.label}
              </span>
              <span className="block text-[11px] leading-relaxed text-white/60">
                {v.reason}
              </span>
            </span>
          </div>

          <IntervalPlot diff={diff} ciLo={ciLo} ciHi={ciHi} color={v.color} />

          <div className="mt-3">
            <Row label="Control" value={`${(pc * 100).toFixed(2)}%`} />
            <Row label="Variant" value={`${(pt * 100).toFixed(2)}%`} />
            <Row
              label="Abs. lift"
              value={`${diff >= 0 ? "+" : ""}${(diff * 100).toFixed(2)} pp`}
            />
            <Row
              label="95% CI"
              value={`${(ciLo * 100).toFixed(2)} to ${(ciHi * 100).toFixed(2)} pp`}
            />
            <Row
              label="p-value"
              value={pValue < 0.0001 ? "<0.0001" : pValue.toFixed(4)}
            />
            <Row label="Power at MDE" value={`${(power * 100).toFixed(0)}%`} />
          </div>
        </div>
      </div>

      {/* Full width, because the separation is the argument */}
      <div className="px-4 sm:px-5 py-4 border-t border-white/[0.06]">
        <Distributions pc={pc} pt={pt} diff={diff} n={n} pValue={pValue} gated={n >= GATE} />
      </div>
    </div>
  );
}
