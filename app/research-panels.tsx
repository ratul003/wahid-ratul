"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PanelFrame } from "./job-panels";

/**
 * Interactive versions of the three University of Minnesota projects.
 *
 * Each one computes the thing the paper is actually about, in the browser:
 * a copula density surface you can rotate, the asymmetry that ordinary
 * correlation cannot see, and the reason a survey weight changes the answer.
 */

// ── Numerics ──────────────────────────────────────────────────────────────────

/** Acklam's rational approximation to the inverse normal CDF. */
function probit(p: number): number {
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  if (p < pl) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > 1 - pl) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  const q = p - 0.5;
  const r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

/** Gaussian copula density at (u,v) with correlation rho. */
function gaussianCopula(u: number, v: number, rho: number): number {
  const x = probit(u);
  const y = probit(v);
  const r2 = rho * rho;
  return (1 / Math.sqrt(1 - r2)) *
    Math.exp(-(r2 * (x * x + y * y) - 2 * rho * x * y) / (2 * (1 - r2)));
}

/** Deterministic LCG, so dragging a slider restructures the cloud, not reseeds it. */
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (1664525 * s + 1013904223) >>> 0) / 4294967296);
}

/** Box-Muller from a uniform source. */
function normalPair(rnd: () => number): [number, number] {
  const u1 = Math.max(1e-9, rnd());
  const u2 = rnd();
  const r = Math.sqrt(-2 * Math.log(u1));
  return [r * Math.cos(2 * Math.PI * u2), r * Math.sin(2 * Math.PI * u2)];
}

// ── Shared bits ───────────────────────────────────────────────────────────────

function Slider({ label, value, display, min, max, step, onChange }: {
  label: string; value: number; display: string; min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  return (
    <label className="block mb-4">
      <span className="flex items-baseline justify-between mb-2">
        <span className="text-[11.5px] text-white/70">{label}</span>
        <span className="text-[12.5px] font-semibold text-white tabular-nums">{display}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} className="ec-range w-full" aria-label={label} />
    </label>
  );
}

function Row({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-[7px] border-b border-white/[0.05] last:border-b-0">
      <span className="text-[10.5px] uppercase tracking-[0.1em] text-white/40 flex-shrink-0">{label}</span>
      <span className="text-[12px] text-white/85 tabular-nums text-right">
        {value}{hint && <span className="text-white/35 ml-1.5">{hint}</span>}
      </span>
    </div>
  );
}

// ── 1. The copula density surface, in 3D ──────────────────────────────────────

const N = 26; // grid resolution

/**
 * The Gaussian copula density as a rotatable wireframe. Drag to spin it. As rho
 * moves off zero the surface lifts along one diagonal and collapses along the
 * other, which is the dependence the paper is measuring.
 */
function CopulaSurface() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [rho, setRho] = useState(0.6);
  const [yaw, setYaw] = useState(-0.7);
  const drag = useRef<{ x: number; yaw: number } | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = cv.clientWidth;
    const H = cv.clientHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    const g = cv.getContext("2d");
    if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);

    // Height field
    const z: number[][] = [];
    let zMax = 0;
    for (let i = 0; i < N; i++) {
      z[i] = [];
      for (let j = 0; j < N; j++) {
        const u = (i + 0.5) / N;
        const v = (j + 0.5) / N;
        // sqrt compression: the corner spikes are 10x the plateau, and a hard
        // clip would flatten their tops into plateaus of their own
        const d = Math.sqrt(Math.min(14, gaussianCopula(u, v, rho)));
        z[i][j] = d;
        if (d > zMax) zMax = d;
      }
    }

    // Axonometric projection with a yaw we can drag
    const cx = W / 2;
    const cy = H * 0.72;
    const scale = Math.min(W, H) * 0.5;
    const cos = Math.cos(yaw);
    const sin = Math.sin(yaw);
    const project = (i: number, j: number) => {
      const x = (i / (N - 1)) * 2 - 1;
      const y = (j / (N - 1)) * 2 - 1;
      const h = (z[i][j] / (zMax || 1)) * 1.05;
      const X = x * cos - y * sin;
      const Y = x * sin + y * cos;
      return { sx: cx + X * scale, sy: cy + Y * scale * 0.4 - h * scale * 0.56, depth: Y };
    };

    // One hue, light to dark, by height
    const ink = (t: number) => {
      const l = 78 - t * 40;
      const s = 55 + t * 30;
      return `hsl(${252 - t * 14} ${s}% ${l}%)`;
    };

    // Back to front, so the ridge occludes what sits behind it
    const rows: { key: string; depth: number; pts: { sx: number; sy: number }[]; t: number }[] = [];
    for (let i = 0; i < N; i++) {
      const pts = [];
      let d = 0, t = 0;
      for (let j = 0; j < N; j++) {
        const p = project(i, j);
        pts.push({ sx: p.sx, sy: p.sy });
        d += p.depth;
        t += z[i][j] / (zMax || 1);
      }
      rows.push({ key: `i${i}`, depth: d / N, pts, t: t / N });
    }
    for (let j = 0; j < N; j++) {
      const pts = [];
      let d = 0, t = 0;
      for (let i = 0; i < N; i++) {
        const p = project(i, j);
        pts.push({ sx: p.sx, sy: p.sy });
        d += p.depth;
        t += z[i][j] / (zMax || 1);
      }
      rows.push({ key: `j${j}`, depth: d / N, pts, t: t / N });
    }
    rows.sort((a, b) => b.depth - a.depth);

    g.lineWidth = 1;
    for (const r of rows) {
      g.beginPath();
      g.moveTo(r.pts[0].sx, r.pts[0].sy);
      for (let k = 1; k < r.pts.length; k++) g.lineTo(r.pts[k].sx, r.pts[k].sy);
      g.strokeStyle = ink(Math.min(1, r.t * 1.6));
      g.globalAlpha = 0.42 + Math.min(1, r.t * 1.6) * 0.5;
      g.stroke();
    }
    g.globalAlpha = 1;
  }, [rho, yaw]);

  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, yaw };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setYaw(drag.current.yaw + (e.clientX - drag.current.x) * 0.008);
  };
  const onUp = () => { drag.current = null; };

  // Kendall's tau and Spearman's rho for a Gaussian copula, in closed form
  const tau = (2 / Math.PI) * Math.asin(rho);
  const spearman = (6 / Math.PI) * Math.asin(rho / 2);

  return (
    <div className="grid md:grid-cols-[1fr_1.25fr] divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
      <div className="p-4 sm:p-5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/35 mb-4">Parameter</p>
        <Slider label="Copula correlation ρ" value={rho} display={rho.toFixed(2)}
          min={-0.95} max={0.95} step={0.01} onChange={setRho} />
        <Row label="Kendall's τ" value={tau.toFixed(3)} />
        <Row label="Spearman's ρs" value={spearman.toFixed(3)} />
        <Row label="Grid" value={`${N} × ${N}`} hint="densities" />
        <p className="text-[10px] text-white/30 leading-relaxed mt-3.5">
          Closed forms for the Gaussian copula: τ = (2/π)·arcsin ρ, ρs = (6/π)·arcsin(ρ/2).
        </p>
      </div>
      <div className="p-4 sm:p-5">
        <canvas
          ref={ref}
          className="w-full h-[290px] touch-none cursor-grab active:cursor-grabbing"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
        <p className="text-[10px] text-white/40 text-center">
          Gaussian copula density on the unit square. Drag to rotate.
        </p>
      </div>
    </div>
  );
}

// ── 2. The asymmetry ordinary correlation cannot see ─────────────────────────

/**
 * Directional dependence, measured both ways. Y is a curved function of X plus
 * noise, so knowing X tells you far more about Y than the reverse, and a single
 * correlation coefficient reports neither.
 */
function DirectionalDependence() {
  const [curve, setCurve] = useState(0.75);
  const [noise, setNoise] = useState(0.45);

  const data = useMemo(() => {
    const rnd = lcg(20190513);
    const pts: { x: number; y: number }[] = [];
    for (let k = 0; k < 420; k++) {
      const [g1, g2] = normalPair(rnd);
      const x = g1;
      // A curved mean plus noise: dependence runs strongly one way
      const y = (1 - curve) * x + curve * (x * x - 1) * 0.85 + g2 * noise * 1.6;
      pts.push({ x, y });
    }

    const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;
    const vari = (a: number[]) => {
      const m = mean(a);
      return mean(a.map((v) => (v - m) ** 2));
    };
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);

    // Pearson r: the number that misses the point
    const mx = mean(xs), my = mean(ys);
    const cov = mean(pts.map((p) => (p.x - mx) * (p.y - my)));
    const r = cov / Math.sqrt(vari(xs) * vari(ys));

    /** Var(E[Y|X]) / Var(Y), by binning: the share of Y explained by knowing X. */
    const ratio = (from: number[], to: number[]) => {
      const B = 12;
      const lo = Math.min(...from), hi = Math.max(...from);
      const sums = new Array(B).fill(0), counts = new Array(B).fill(0);
      from.forEach((v, i) => {
        const b = Math.min(B - 1, Math.floor(((v - lo) / (hi - lo || 1)) * B));
        sums[b] += to[i];
        counts[b] += 1;
      });
      const grand = mean(to);
      let between = 0, n = 0;
      for (let b = 0; b < B; b++) {
        if (!counts[b]) continue;
        between += counts[b] * (sums[b] / counts[b] - grand) ** 2;
        n += counts[b];
      }
      return Math.min(1, between / n / (vari(to) || 1));
    };

    const yGivenX = ratio(xs, ys);
    const xGivenY = ratio(ys, xs);

    // Conditional means, for drawing
    const binned = (from: number[], to: number[]) => {
      const B = 14;
      const lo = Math.min(...from), hi = Math.max(...from);
      const sums = new Array(B).fill(0), counts = new Array(B).fill(0);
      from.forEach((v, i) => {
        const b = Math.min(B - 1, Math.floor(((v - lo) / (hi - lo || 1)) * B));
        sums[b] += to[i];
        counts[b] += 1;
      });
      return Array.from({ length: B }, (_, b) =>
        counts[b] ? { a: lo + ((b + 0.5) / B) * (hi - lo), m: sums[b] / counts[b] } : null
      ).filter(Boolean) as { a: number; m: number }[];
    };

    return { pts, r, yGivenX, xGivenY, eYgX: binned(xs, ys), eXgY: binned(ys, xs) };
  }, [curve, noise]);

  const W = 300, H = 240, PAD = 18;
  const xs = data.pts.map((p) => p.x), ys = data.pts.map((p) => p.y);
  const xLo = Math.min(...xs), xHi = Math.max(...xs);
  const yLo = Math.min(...ys), yHi = Math.max(...ys);
  const px = (v: number) => PAD + ((v - xLo) / (xHi - xLo)) * (W - PAD * 2);
  const py = (v: number) => H - PAD - ((v - yLo) / (yHi - yLo)) * (H - PAD * 2);

  const asym = Math.abs(data.yGivenX - data.xGivenY);

  return (
    <div className="grid md:grid-cols-[1fr_1.25fr] divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
      <div className="p-4 sm:p-5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/35 mb-4">Structure</p>
        <Slider label="Curvature in the link" value={curve} display={curve.toFixed(2)}
          min={0} max={1} step={0.01} onChange={setCurve} />
        <Slider label="Noise" value={noise} display={noise.toFixed(2)}
          min={0.1} max={1.2} step={0.01} onChange={setNoise} />
        <Row label="Pearson r" value={data.r.toFixed(3)} hint="both ways" />
        <Row label="ρ² (Y | X)" value={data.yGivenX.toFixed(3)} />
        <Row label="ρ² (X | Y)" value={data.xGivenY.toFixed(3)} />
        <Row label="Asymmetry" value={asym.toFixed(3)} />
        <p className="text-[10px] text-white/30 leading-relaxed mt-3.5">
          420 draws, fixed seed. ρ² is Var(E[·|·]) / Var(·), estimated on 12 bins.
        </p>
      </div>
      <div className="p-4 sm:p-5">
        <div
          className="rounded-lg px-3.5 py-2.5 mb-3 border"
          style={{
            borderColor: asym > 0.12 ? "#a855f74d" : "#94a3b84d",
            background: asym > 0.12 ? "#a855f712" : "#94a3b812",
          }}
        >
          <p className="text-[11.5px] leading-relaxed text-white/75">
            {asym > 0.12 ? (
              <>
                Knowing X explains <b className="text-purple-200">{(data.yGivenX * 100).toFixed(0)}%</b> of Y,
                but knowing Y explains only <b className="text-purple-200">{(data.xGivenY * 100).toFixed(0)}%</b> of X.
                Pearson r reports {data.r.toFixed(2)} in both directions.
              </>
            ) : (
              <>Near-symmetric here, so a single correlation is not lying yet. Add curvature and watch the two directions separate.</>
            )}
          </p>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
          aria-label="Scatter of Y against X with both conditional-mean curves">
          {data.pts.map((p, i) => (
            <circle key={i} cx={px(p.x)} cy={py(p.y)} r="1.7" fill="#a855f7" fillOpacity="0.35" />
          ))}
          {/* E[Y|X] */}
          <path d={data.eYgX.map((d, i) => `${i ? "L" : "M"}${px(d.a).toFixed(1)} ${py(d.m).toFixed(1)}`).join(" ")}
            fill="none" stroke="#f0abfc" strokeWidth="2" strokeLinecap="round" />
          {/* E[X|Y], drawn in the same space with the roles swapped */}
          <path d={data.eXgY.map((d, i) => `${i ? "L" : "M"}${px(d.m).toFixed(1)} ${py(d.a).toFixed(1)}`).join(" ")}
            fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3" />
        </svg>
        <div className="flex justify-center gap-5 mt-1">
          <span className="flex items-center gap-1.5 text-[10px] text-white/55">
            <span className="w-3 h-[2px] rounded" style={{ background: "#f0abfc" }} /> E[Y | X]
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-white/55">
            <span className="w-3 h-[2px] rounded" style={{ background: "#22d3ee" }} /> E[X | Y]
          </span>
        </div>
      </div>
    </div>
  );
}

// ── 3. Why the survey weight changes the answer ──────────────────────────────

const STRATA = [
  { name: "Older adults", share: 0.18, rate: 0.31 },
  { name: "Middle-aged", share: 0.34, rate: 0.12 },
  { name: "Younger adults", share: 0.48, rate: 0.05 },
];

/**
 * NHANES oversamples on purpose. This shows what that does: the unweighted
 * prevalence drifts with the sampling design, the weighted estimate does not.
 */
function SurveyWeights() {
  const [over, setOver] = useState(3.2);
  const [n, setN] = useState(1580);

  const r = useMemo(() => {
    // Sampled counts: the first stratum is deliberately oversampled
    const raw = STRATA.map((s, i) => s.share * (i === 0 ? over : 1));
    const tot = raw.reduce((a, b) => a + b, 0);
    const rows = STRATA.map((s, i) => {
      const sampleShare = raw[i] / tot;
      const sampled = Math.round(sampleShare * n);
      // A survey weight is the inverse of the selection probability
      const weight = s.share / sampleShare;
      return { ...s, sampleShare, sampled, weight };
    });
    const naive = rows.reduce((a, x) => a + x.sampleShare * x.rate, 0);
    const weighted = rows.reduce((a, x) => a + x.share * x.rate, 0);
    return { rows, naive, weighted, bias: naive - weighted };
  }, [over, n]);

  return (
    <div className="grid md:grid-cols-[1fr_1.25fr] divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
      <div className="p-4 sm:p-5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/35 mb-4">Sampling design</p>
        <Slider label="Oversampling of older adults" value={over} display={`${over.toFixed(1)}×`}
          min={1} max={6} step={0.1} onChange={setOver} />
        <Slider label="Paired adults in the cycle" value={n} display={n.toLocaleString()}
          min={400} max={4000} step={20} onChange={setN} />
        <Row label="Unweighted" value={`${(r.naive * 100).toFixed(1)}%`} />
        <Row label="Survey-weighted" value={`${(r.weighted * 100).toFixed(1)}%`} />
        <Row label="Bias" value={`${(r.bias * 100).toFixed(1)} pp`} />
        <p className="text-[10px] text-white/30 leading-relaxed mt-3.5">
          A weight is the reciprocal of the selection probability, so the weighted
          estimate is invariant to the design. The unweighted one is not.
        </p>
      </div>
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Unweighted prevalence", v: r.naive, c: "#fb7185" },
            { label: "Survey-weighted", v: r.weighted, c: "#0ea5e9" },
          ].map((t) => (
            <div key={t.label} className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3.5 py-3">
              <p className="text-[10px] text-white/40 mb-1.5">{t.label}</p>
              <p className="text-[1.5rem] font-bold leading-none tabular-nums" style={{ color: t.c }}>
                {(t.v * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
        <p className="text-[10px] uppercase tracking-[0.12em] text-white/35 mb-2.5">
          Who ends up in the sample
        </p>
        <div className="space-y-2.5">
          {r.rows.map((row) => (
            <div key={row.name}>
              <div className="flex items-baseline justify-between mb-1 gap-2">
                <span className="text-[11px] text-white/70">{row.name}</span>
                <span className="text-[10.5px] text-white/45 tabular-nums">
                  {row.sampled.toLocaleString()} sampled · weight {row.weight.toFixed(2)}
                </span>
              </div>
              <div className="relative h-[7px] rounded-full bg-white/[0.05] overflow-hidden">
                {/* Population share, as the reference */}
                <div className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${row.share * 100}%`, background: "rgba(255,255,255,0.14)" }} />
                {/* Sample share, which the weight has to correct back */}
                <div className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300"
                  style={{ width: `${row.sampleShare * 100}%`, background: "#0ea5e988" }} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-white/35 mt-3">
          Pale bar is the population share, blue is the sampled share. The gap is what the weight undoes.
        </p>
      </div>
    </div>
  );
}

// ── The tabbed panel ──────────────────────────────────────────────────────────

const TABS = [
  { key: "copula", label: "Copula surface", uri: "research://copulas/gaussian-density", meta: "drag to rotate", Body: CopulaSurface },
  { key: "direction", label: "Directional dependence", uri: "research://order-statistics/asymmetry", meta: "420 draws", Body: DirectionalDependence },
  { key: "nhanes", label: "Survey weighting", uri: "research://nhanes/weighted-prevalence", meta: "two cycles", Body: SurveyWeights },
] as const;

export default function ResearchPanel() {
  const [tab, setTab] = useState(0);
  const t = TABS[tab];
  const Body = t.Body;

  return (
    <PanelFrame uri={t.uri} meta={t.meta}>
      <div className="flex flex-wrap gap-2 px-4 sm:px-5 py-3 border-b border-white/[0.06]">
        {TABS.map((x, i) => (
          <button
            key={x.key}
            onClick={() => setTab(i)}
            aria-pressed={i === tab}
            className="text-[11.5px] px-3 py-1.5 rounded-full border transition-all"
            style={
              i === tab
                ? { background: "#a855f7", borderColor: "#a855f7", color: "#12061c", fontWeight: 600 }
                : { borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }
            }
          >
            {x.label}
          </button>
        ))}
      </div>
      <Body />
    </PanelFrame>
  );
}
