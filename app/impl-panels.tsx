"use client";

import { useMemo, useState } from "react";
import { PanelFrame } from "./job-panels";

/**
 * One interactive visual per shipped implementation. Same rule as everywhere
 * else on this page: the arithmetic runs in the browser, and every rate or
 * assumption a model uses is printed on the panel next to the result.
 */

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

// ── Product Intelligence Platform: the gate a new event has to clear ─────────

type Candidate = {
  name: string;
  owner: boolean;
  naming: boolean;
  schema: boolean;
  pii: boolean;
  volume: number;
  duplicate: boolean;
  consumers: boolean;
  tested: boolean;
};

const CANDIDATES: Candidate[] = [
  {
    name: "checkout_completed",
    owner: true, naming: true, schema: true, pii: true,
    volume: 41200, duplicate: false, consumers: true, tested: true,
  },
  {
    name: "Button Clicked",
    owner: false, naming: false, schema: false, pii: true,
    volume: 880000, duplicate: true, consumers: false, tested: false,
  },
  {
    name: "trial_started_v2",
    owner: true, naming: true, schema: true, pii: true,
    volume: 2900, duplicate: true, consumers: true, tested: false,
  },
  {
    name: "user_email_captured",
    owner: true, naming: true, schema: true, pii: false,
    volume: 15400, duplicate: false, consumers: true, tested: true,
  },
];

const VOLUME_GATE = 5000;

/**
 * The eight gates a proposed event cleared before it could become a governed
 * metric. Metric drift was never a modelling problem: it was people shipping
 * near-duplicate events with no owner, so the fix was a gate, not a dashboard.
 */
export function GatePanel() {
  const [pick, setPick] = useState(0);
  const c = CANDIDATES[pick];

  const gates = useMemo(() => [
    { g: "Named to the convention", ok: c.naming, why: "snake_case, object_verb, past tense" },
    { g: "Owner assigned", ok: c.owner, why: "a named PM, not a team alias" },
    { g: "Schema declared", ok: c.schema, why: "required properties and their types" },
    { g: "No PII in properties", ok: c.pii, why: "identifiers hashed or dropped" },
    { g: `Clears ${VOLUME_GATE.toLocaleString()}/mo`, ok: c.volume >= VOLUME_GATE, why: `${c.volume.toLocaleString()} last month` },
    { g: "Not a duplicate", ok: !c.duplicate, why: c.duplicate ? "an existing event already answers this" : "nothing else covers it" },
    { g: "Consumers declared", ok: c.consumers, why: "who reads it, and in which dashboard" },
    { g: "Modelled and tested", ok: c.tested, why: "a dbt model with tests, not a raw tap" },
  ], [c]);

  const failed = gates.filter((x) => !x.ok);
  const ships = failed.length === 0;

  return (
    <PanelFrame uri="governance://events/proposed" meta={`${gates.length} gates`}>
      <div className="grid md:grid-cols-[1fr_1.3fr] divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
        <div className="p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/35 mb-3">
            Proposed event
          </p>
          <div className="space-y-2 mb-5">
            {CANDIDATES.map((x, i) => (
              <button key={x.name} onClick={() => setPick(i)} aria-pressed={i === pick}
                className="w-full text-left px-3 py-2 rounded-lg border font-mono text-[11.5px] transition-all"
                style={i === pick
                  ? { borderColor: "#6366f1", background: "#6366f11f", color: "#e0e7ff" }
                  : { borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                {x.name}
              </button>
            ))}
          </div>
          <Row label="Volume" value={`${c.volume.toLocaleString()}/mo`} />
          <Row label="Gates passed" value={`${gates.length - failed.length} / ${gates.length}`} />
          <p className="text-[10px] text-white/30 leading-relaxed mt-3.5">
            One governed metric per product meant one definition, so anything that
            could fork a definition had to be stopped at intake.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="rounded-lg px-3.5 py-3 mb-4 border"
            style={{ borderColor: ships ? "#34d3994d" : "#fb71854d", background: ships ? "#34d39912" : "#fb718512" }}>
            <p className="text-[13px] font-semibold mb-1" style={{ color: ships ? "#34d399" : "#fb7185" }}>
              {ships ? "Ships as a governed event" : `Blocked on ${failed.length} gate${failed.length > 1 ? "s" : ""}`}
            </p>
            <p className="text-[11px] leading-relaxed text-white/60">
              {ships
                ? "Instrumented, modelled and pointed at a named consumer. It can carry a metric."
                : `Fix ${failed.map((f) => f.g.toLowerCase()).slice(0, 2).join(", ")}${failed.length > 2 ? ` and ${failed.length - 2} more` : ""}, then resubmit.`}
            </p>
          </div>

          <ul className="space-y-[7px]">
            {gates.map((x) => (
              <li key={x.g} className="flex items-start gap-2.5">
                <span className="text-[11px] mt-[1px] flex-shrink-0 w-3"
                  style={{ color: x.ok ? "#34d399" : "#fb7185" }}>
                  {x.ok ? "✓" : "✕"}
                </span>
                <span className="min-w-0">
                  <span className="text-[11.5px] text-white/80">{x.g}</span>
                  <span className="text-[10.5px] text-white/35"> · {x.why}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PanelFrame>
  );
}

// ── Data Engineering Foundation: the three layers, and what moves between ────

const SOURCES = [
  { key: "segment", name: "Segment", rows: "1.2M / day", staged: 34, marts: 11, note: "product events, the identity spine" },
  { key: "fivetran", name: "Fivetran", rows: "410K / day", staged: 22, marts: 8, note: "Salesforce, Zendesk, billing" },
  { key: "airbyte", name: "Airbyte", rows: "96K / day", staged: 9, marts: 4, note: "long-tail SaaS connectors" },
  { key: "custom", name: "Custom ELT", rows: "58K / day", staged: 7, marts: 3, note: "the loads nothing off-the-shelf covered" },
];

const LAYERS = [
  { name: "RAW", tone: "#64748b", desc: "Immutable landing. Append only, never modelled in place." },
  { name: "STAGING", tone: "#0ea5e9", desc: "One dbt model per source table. Renamed, typed, tested." },
  { name: "MARTS", tone: "#10b981", desc: "Kimball star schemas. The only layer a dashboard may read." },
];

/** Four parallel ELT services, three dbt layers, and Reverse ETL back out. */
export function LineagePanel() {
  const [src, setSrc] = useState(0);
  const s = SOURCES[src];
  const totalStaged = SOURCES.reduce((a, x) => a + x.staged, 0);
  const totalMarts = SOURCES.reduce((a, x) => a + x.marts, 0);

  return (
    <PanelFrame uri="warehouse://lineage/three-layer" meta="4 ELT services">
      <div className="grid md:grid-cols-[1fr_1.3fr] divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
        <div className="p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/35 mb-3">
            Ingestion service
          </p>
          <div className="space-y-2 mb-5">
            {SOURCES.map((x, i) => (
              <button key={x.key} onClick={() => setSrc(i)} aria-pressed={i === src}
                className="w-full text-left px-3 py-2 rounded-lg border transition-all"
                style={i === src
                  ? { borderColor: "#10b981", background: "#10b9811f" }
                  : { borderColor: "rgba(255,255,255,0.1)" }}>
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-[12px] font-medium" style={{ color: i === src ? "#6ee7b7" : "rgba(255,255,255,0.7)" }}>
                    {x.name}
                  </span>
                  <span className="text-[10px] text-white/40 tabular-nums">{x.rows}</span>
                </span>
              </button>
            ))}
          </div>
          <Row label="Staging models" value={`${s.staged} of ${totalStaged}`} />
          <Row label="Mart models" value={`${s.marts} of ${totalMarts}`} />
          <p className="text-[10px] text-white/30 leading-relaxed mt-3.5">
            {s.note}. Reverse ETL pushes mart columns back into Salesforce and
            Gainsight, so the score a CSM sees is the score the warehouse computed.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          {/* The path this source takes through the stack */}
          <div className="space-y-2.5 mb-4">
            {LAYERS.map((l, i) => (
              <div key={l.name} className="relative">
                <div className="rounded-lg border px-3.5 py-2.5 transition-all"
                  style={{ borderColor: l.tone + "55", background: l.tone + "12" }}>
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <span className="text-[11px] font-bold tracking-[0.08em]" style={{ color: l.tone }}>
                      {l.name}
                    </span>
                    <span className="text-[10.5px] text-white/55 tabular-nums">
                      {i === 0 ? s.rows : i === 1 ? `${s.staged} models` : `${s.marts} models`}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-white/45 leading-relaxed">{l.desc}</p>
                </div>
                {i < LAYERS.length - 1 && (
                  <div className="flex justify-center py-[3px]">
                    <span className="text-white/25 text-[11px]">↓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5">
            <p className="text-[11px] font-bold tracking-[0.08em] text-white/60 mb-1">REVERSE ETL</p>
            <p className="text-[10.5px] text-white/45 leading-relaxed">
              Scores and segments pushed back into Salesforce and Gainsight, from the
              mart layer only. Nothing operational reads RAW.
            </p>
          </div>
        </div>
      </div>
    </PanelFrame>
  );
}

// ── Systems Architecture: the egress finding that settled the ADR ────────────

// Published list rates, stated so the model can be argued with.
const SNOW_COMPUTE = 3.0;   // $ per credit
const SNOW_STORAGE = 23;    // $ per TB month
const BQ_QUERY = 6.25;      // $ per TB scanned
const BQ_STORAGE = 20;      // $ per TB month
const EGRESS_RATE = 90;     // $ per TB moved out

/**
 * The Snowflake versus BigQuery question turned out not to be about either
 * warehouse. Move the export slider and watch which line the bill actually
 * follows: egress dominates long before compute does.
 */
export function EgressPanel() {
  const [exportTb, setExportTb] = useState(14);
  const [storeTb, setStoreTb] = useState(38);
  const [credits, setCredits] = useState(2400);

  const r = useMemo(() => {
    const snowCompute = credits * SNOW_COMPUTE;
    const snowStore = storeTb * SNOW_STORAGE;
    const bqQuery = (credits / 22) * BQ_QUERY * 10; // scanned TB, from the same workload
    const bqStore = storeTb * BQ_STORAGE;
    const egress = exportTb * EGRESS_RATE;

    const snowTotal = snowCompute + snowStore + egress;
    const bqTotal = bqQuery + bqStore + egress;
    return {
      snowCompute, snowStore, bqQuery, bqStore, egress,
      snowTotal, bqTotal,
      egressShareSnow: egress / snowTotal,
      egressShareBq: egress / bqTotal,
      delta: Math.abs(snowTotal - bqTotal),
      cheaper: snowTotal <= bqTotal ? "Snowflake" : "BigQuery",
    };
  }, [exportTb, storeTb, credits]);

  const usd = (n: number) => "$" + Math.round(n).toLocaleString();
  const share = Math.max(r.egressShareSnow, r.egressShareBq);

  return (
    <PanelFrame uri="adr://warehouse/snowflake-vs-bigquery" meta="list rates">
      <div className="grid md:grid-cols-[1fr_1.3fr] divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
        <div className="p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/35 mb-4">Monthly workload</p>
          <Slider label="Exported out of the warehouse" value={exportTb} display={`${exportTb} TB`}
            min={0} max={40} step={1} onChange={setExportTb} />
          <Slider label="Stored" value={storeTb} display={`${storeTb} TB`}
            min={5} max={120} step={1} onChange={setStoreTb} />
          <Slider label="Compute" value={credits} display={`${credits.toLocaleString()} cr`}
            min={200} max={6000} step={50} onChange={setCredits} />
          <p className="text-[10px] text-white/30 leading-relaxed mt-2">
            At list: {usd(SNOW_COMPUTE)}/credit, ${SNOW_STORAGE}/TB stored,
            ${BQ_QUERY}/TB scanned, ${EGRESS_RATE}/TB egress.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <div className="rounded-lg px-3.5 py-3 mb-4 border"
            style={{ borderColor: share > 0.6 ? "#f43f5e4d" : "#94a3b84d", background: share > 0.6 ? "#f43f5e12" : "#94a3b812" }}>
            <p className="flex items-baseline gap-2 mb-1">
              <span className="text-[1.5rem] font-bold leading-none tabular-nums"
                style={{ color: share > 0.6 ? "#fb7185" : "#cbd5e1" }}>
                {(share * 100).toFixed(0)}%
              </span>
              <span className="text-[11px] text-white/55">of the bill is egress</span>
            </p>
            <p className="text-[11px] leading-relaxed text-white/60">
              {share > 0.6
                ? `The warehouses differ by ${usd(r.delta)}. Egress is ${usd(r.egress)}. Picking a warehouse on compute price answers the wrong question.`
                : `${r.cheaper} is cheaper by ${usd(r.delta)} at this workload. Push the export slider up and watch that difference stop mattering.`}
            </p>
          </div>

          {/* Both bills, stacked into the same three components */}
          {[
            { name: "Snowflake", total: r.snowTotal, parts: [
              { l: "compute", v: r.snowCompute, c: "#38bdf8" },
              { l: "storage", v: r.snowStore, c: "#818cf8" },
              { l: "egress", v: r.egress, c: "#fb7185" },
            ] },
            { name: "BigQuery", total: r.bqTotal, parts: [
              { l: "query", v: r.bqQuery, c: "#38bdf8" },
              { l: "storage", v: r.bqStore, c: "#818cf8" },
              { l: "egress", v: r.egress, c: "#fb7185" },
            ] },
          ].map((w) => {
            const max = Math.max(r.snowTotal, r.bqTotal);
            return (
              <div key={w.name} className="mb-3.5">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-[11.5px] font-medium text-white/80">{w.name}</span>
                  <span className="text-[12px] text-white tabular-nums">{usd(w.total)}<span className="text-white/35"> / mo</span></span>
                </div>
                <div className="flex h-[13px] rounded-md overflow-hidden gap-px bg-white/[0.06]"
                  style={{ width: `${(w.total / max) * 100}%` }}>
                  {w.parts.map((p) => (
                    <div key={p.l} style={{ width: `${(p.v / w.total) * 100}%`, background: p.c + "99" }} />
                  ))}
                </div>
              </div>
            );
          })}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {[{ l: "compute / query", c: "#38bdf8" }, { l: "storage", c: "#818cf8" }, { l: "egress", c: "#fb7185" }].map((k) => (
              <span key={k.l} className="flex items-center gap-1.5 text-[10px] text-white/55">
                <span className="w-3 h-[3px] rounded" style={{ background: k.c + "99" }} />{k.l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </PanelFrame>
  );
}

// ── Rank, Reward, Retain: TOPSIS, recomputed as you reweight ─────────────────

const CRITERIA = [
  { key: "rating", name: "Rating", benefit: true },
  { key: "response", name: "Response time", benefit: false },
  { key: "completion", name: "Completion rate", benefit: true },
  { key: "repeat", name: "Repeat bookings", benefit: true },
  { key: "credential", name: "Credential level", benefit: true },
] as const;

// Six representative partners across the five signals.
const EXPERTS = [
  { name: "Partner 041", v: [4.9, 42, 0.97, 0.61, 3] },
  { name: "Partner 118", v: [4.6, 12, 0.93, 0.44, 2] },
  { name: "Partner 205", v: [4.8, 88, 0.99, 0.72, 3] },
  { name: "Partner 337", v: [4.3, 9, 0.86, 0.31, 1] },
  { name: "Partner 402", v: [4.7, 26, 0.95, 0.55, 2] },
  { name: "Partner 519", v: [5.0, 140, 0.91, 0.38, 3] },
];

/** Revenue-share band by rank: the score has to pay, or it is just a leaderboard. */
function band(rank: number, n: number): { pct: number; tier: string } {
  const q = rank / n;
  if (q <= 1 / 3) return { pct: 90, tier: "Top band" };
  if (q <= 2 / 3) return { pct: 60, tier: "Mid band" };
  return { pct: 30, tier: "Base band" };
}

/**
 * Real TOPSIS: vector-normalise each criterion, weight it, then rank by closeness
 * to the ideal profile and distance from the worst. Not a weighted average, which
 * a partner can game by maxing one signal.
 */
export function TopsisPanel() {
  const [w, setW] = useState([0.3, 0.15, 0.2, 0.2, 0.15]);

  const ranked = useMemo(() => {
    const n = CRITERIA.length;
    const wSum = w.reduce((a, b) => a + b, 0) || 1;
    const wn = w.map((x) => x / wSum);

    // Vector normalisation, per criterion
    const norms = Array.from({ length: n }, (_, j) =>
      Math.sqrt(EXPERTS.reduce((a, e) => a + e.v[j] ** 2, 0)) || 1
    );
    const V = EXPERTS.map((e) => e.v.map((x, j) => (x / norms[j]) * wn[j]));

    // Ideal and anti-ideal, respecting which criteria are costs
    const best = Array.from({ length: n }, (_, j) => {
      const col = V.map((row) => row[j]);
      return CRITERIA[j].benefit ? Math.max(...col) : Math.min(...col);
    });
    const worst = Array.from({ length: n }, (_, j) => {
      const col = V.map((row) => row[j]);
      return CRITERIA[j].benefit ? Math.min(...col) : Math.max(...col);
    });

    const scored = EXPERTS.map((e, i) => {
      const dPlus = Math.sqrt(V[i].reduce((a, v, j) => a + (v - best[j]) ** 2, 0));
      const dMinus = Math.sqrt(V[i].reduce((a, v, j) => a + (v - worst[j]) ** 2, 0));
      return { ...e, c: dMinus / (dPlus + dMinus || 1) };
    });
    return scored.sort((a, b) => b.c - a.c);
  }, [w]);

  return (
    <PanelFrame uri="marketplace://ranking/topsis" meta="5 criteria">
      <div className="grid md:grid-cols-[1fr_1.35fr] divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
        <div className="p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/35 mb-4">
            Criterion weights
          </p>
          {CRITERIA.map((c, j) => (
            <Slider key={c.key}
              label={`${c.name}${c.benefit ? "" : " (lower is better)"}`}
              value={w[j]}
              display={`${Math.round((w[j] / (w.reduce((a, b) => a + b, 0) || 1)) * 100)}%`}
              min={0} max={0.6} step={0.01}
              onChange={(v) => setW(w.map((x, k) => (k === j ? v : x)))} />
          ))}
          <p className="text-[10px] text-white/30 leading-relaxed">
            Weights are renormalised to sum to one, so only their ratios matter.
            Zero a criterion out and watch the order move.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/35 mb-3">
            Ranking, and what it pays
          </p>
          <div className="space-y-2">
            {ranked.map((e, i) => {
              const b = band(i, ranked.length);
              const tone = b.pct === 90 ? "#8b5cf6" : b.pct === 60 ? "#a78bfa" : "#64748b";
              return (
                <div key={e.name}
                  className="flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all"
                  style={{ borderColor: tone + "3d", background: tone + "0f" }}>
                  <span className="text-[11px] font-mono text-white/35 w-4 flex-shrink-0">{i + 1}</span>
                  <span className="text-[12px] font-medium text-white/85 flex-shrink-0 w-[92px]">{e.name}</span>
                  <span className="flex-1 h-[6px] rounded-full bg-white/[0.06] overflow-hidden">
                    <span className="block h-full rounded-full transition-[width] duration-300"
                      style={{ width: `${e.c * 100}%`, background: tone }} />
                  </span>
                  <span className="text-[11px] text-white/70 tabular-nums w-[42px] text-right flex-shrink-0">
                    {e.c.toFixed(3)}
                  </span>
                  <span className="text-[10px] font-semibold tabular-nums w-[68px] text-right flex-shrink-0"
                    style={{ color: tone }}>
                    {b.pct}% share
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-white/35 mt-3 leading-relaxed">
            Closeness coefficient C = d⁻ / (d⁺ + d⁻). A weighted average would let a
            partner max one signal and coast; a geometric distance from both the ideal
            and the worst profile will not.
          </p>
        </div>
      </div>
    </PanelFrame>
  );
}
