"use client";

import { useEffect, useMemo, useState } from "react";
import { PanelFrame } from "./job-panels";
import { CredentialScale, ErsScorecard, ProfileBuilder } from "./ers-views";

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

// ── Product Intelligence Platform: the stack, end to end ────────────────────

/** The ten-plus products instrumented against one contract. */
const PRODUCTS = [
  "Experimentation",
  "Content Marketing Platform",
  "AI Orchestration",
  "Customer Data Platform (CDP)",
  "Product Recommendations",
  "Content Management",
];

type NodeKey = "segment" | "snowflake" | "models" | "analytics" | "powerbi" | "salesforce";

const NODES: Record<NodeKey, { name: string; sub: string; tone: string }> = {
  segment:    { name: "Segment",           sub: "Real-time event stream",                    tone: "#34d399" },
  snowflake:  { name: "Snowflake",         sub: "Raw event storage",                         tone: "#22d3ee" },
  models:     { name: "Transformed Models",sub: "Dimensional + reporting layer",             tone: "#f97316" },
  analytics:  { name: "Analytics Platform",sub: "Product analytics · PM-facing",             tone: "#818cf8" },
  powerbi:    { name: "PowerBI",           sub: "Business intelligence",                     tone: "#fbbf24" },
  salesforce: { name: "Salesforce",        sub: "Account health · CS workflows · activation", tone: "#38bdf8" },
};

const STAGES = [
  { key: "collection", label: "Collection",  head: "Segment · Fivetran · Airbyte",  desc: "Real-time event stream plus SaaS connector ingestion", tone: "#34d399", nodes: ["segment"] },
  { key: "warehouse",  label: "Warehouse",   head: "Snowflake",                     desc: "Immutable raw layer, then modelled, then reporting",   tone: "#22d3ee", nodes: ["snowflake"] },
  { key: "transform",  label: "Transform",   head: "dbt",                           desc: "Dimensional models and reporting aggregates",          tone: "#f97316", nodes: ["models"] },
  { key: "analytics",  label: "Analytics",   head: "Analytics Platform + PowerBI",   desc: "Warehouse-native, no sync, ARR-joinable queries",      tone: "#818cf8", nodes: ["analytics", "powerbi"] },
  { key: "activation", label: "Activation",  head: "Reverse ETL → Salesforce",       desc: "Account health and engagement signals pushed to CRM",  tone: "#38bdf8", nodes: ["salesforce"] },
] as const;

function StackNode({ k, lit }: { k: NodeKey; lit: boolean }) {
  const nd = NODES[k];
  return (
    <div
      className="rounded-lg border px-3.5 py-2.5 transition-all duration-300"
      style={{
        borderColor: lit ? nd.tone : nd.tone + "33",
        background: lit ? nd.tone + "1f" : nd.tone + "0a",
        boxShadow: lit ? `0 0 20px -6px ${nd.tone}` : undefined,
      }}
    >
      <p className="text-[12.5px] font-bold text-white leading-tight mb-0.5">{nd.name}</p>
      <p className="text-[9.5px] uppercase tracking-[0.09em] font-semibold leading-snug" style={{ color: nd.tone }}>
        {nd.sub}
      </p>
    </div>
  );
}

const Arrow = ({ label, down = false }: { label?: string; down?: boolean }) => (
  <div className={`flex items-center justify-center gap-1.5 ${down ? "flex-col py-1.5" : "px-1"}`}>
    {label && <span className="text-[10px] text-white/40 whitespace-nowrap">{label}</span>}
    <span className="text-white/25 text-[12px]">{down ? "↓" : "→"}</span>
  </div>
);

/**
 * The instrumentation contract, drawn. Ten-plus products emit against one event
 * spec, everything lands in one warehouse, and the only thing allowed to reach a
 * dashboard or a CRM is the modelled layer. Pick a stage to trace it.
 */
export function StackPanel() {
  const [stage, setStage] = useState<string | null>(null);
  const [product, setProduct] = useState(0);
  const litNodes: string[] = stage ? (STAGES.find((s) => s.key === stage)?.nodes as unknown as string[]) ?? [] : [];
  const lit = (k: NodeKey) => litNodes.includes(k);
  const anyLit = stage !== null;

  return (
    <PanelFrame uri="platform://instrumentation/one-contract" meta="10+ products">
      <div className="p-4 sm:p-5">
        {/* The products emitting into it */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-[9.5px] uppercase tracking-[0.13em] text-white/35 mr-1">
            User events
          </span>
          {PRODUCTS.map((x, i) => (
            <button
              key={x}
              onClick={() => setProduct(i)}
              aria-pressed={i === product}
              className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all"
              style={
                i === product
                  ? { borderColor: "#818cf8", background: "#818cf826", color: "#e0e7ff" }
                  : { borderColor: "rgba(129,140,248,0.22)", color: "rgba(199,210,254,0.7)" }
              }
            >
              {x}
            </button>
          ))}
        </div>

        {/* Collection -> warehouse -> transform */}
        <div className="grid sm:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-y-2 mb-1">
          <StackNode k="segment" lit={!anyLit || lit("segment")} />
          <Arrow label="+ SaaS connectors" />
          <StackNode k="snowflake" lit={!anyLit || lit("snowflake")} />
          <Arrow label="dbt models" />
          <StackNode k="models" lit={!anyLit || lit("models")} />
        </div>

        {/* Down into the read layer */}
        <div className="grid sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <div />
          <div />
          <Arrow down />
          <div />
          <Arrow down />
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-1 sm:max-w-[70%] sm:mx-auto">
          <StackNode k="analytics" lit={!anyLit || lit("analytics")} />
          <StackNode k="powerbi" lit={!anyLit || lit("powerbi")} />
        </div>

        {/* And back out to the CRM */}
        <div className="flex justify-center">
          <Arrow down label="Reverse ETL" />
        </div>
        <div className="sm:max-w-[70%] sm:mx-auto mb-6">
          <StackNode k="salesforce" lit={!anyLit || lit("salesforce")} />
        </div>

        {/* The five stages, as the trace control */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
          {STAGES.map((st) => {
            const on = stage === st.key;
            return (
              <button
                key={st.key}
                onClick={() => setStage(on ? null : st.key)}
                aria-pressed={on}
                className="text-left rounded-lg border px-3 py-2.5 transition-all"
                style={{
                  borderColor: on ? st.tone : "rgba(255,255,255,0.08)",
                  background: on ? st.tone + "14" : "rgba(255,255,255,0.015)",
                }}
              >
                <span
                  className="block text-[9px] uppercase tracking-[0.13em] font-bold mb-1.5"
                  style={{ color: st.tone }}
                >
                  {st.label}
                </span>
                <span className="block text-[12px] font-semibold text-white leading-snug mb-1">
                  {st.head}
                </span>
                <span className="block text-[10px] text-white/45 leading-relaxed">{st.desc}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-white/30 mt-3.5">
          {stage
            ? `Tracing ${STAGES.find((s) => s.key === stage)?.label.toLowerCase()}. Click it again to show the whole stack.`
            : "Click a stage to trace it through the stack. Every product above emits against the same event contract."}
        </p>
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
function EgressBody() {
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
  );
}

// ── Rank, Reward, Retain: the Expert Readiness Score ────────────────────────

const ERS_TABS = [
  { k: "scorecard", l: "Expert scorecard", uri: "marketplace://ers/scorecard", meta: "5 criteria" },
  { k: "builder", l: "Build a profile", uri: "marketplace://ers/builder", meta: "live TOPSIS" },
] as const;

/** The scoring engine, with the credential scale it reads sitting above it. */
export function TopsisPanel() {
  const [tab, setTab] = useState(0);
  const t = ERS_TABS[tab];
  return (
    <PanelFrame uri={t.uri} meta={t.meta}>
      <div className="flex flex-wrap gap-2 px-4 sm:px-5 py-3 border-b border-white/[0.06]">
        {ERS_TABS.map((x, i) => (
          <button key={x.k} onClick={() => setTab(i)} aria-pressed={i === tab}
            className="text-[11.5px] px-3 py-1.5 rounded-full border transition-all"
            style={i === tab
              ? { background: "#8b5cf6", borderColor: "#8b5cf6", color: "#150726", fontWeight: 600 }
              : { borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}>
            {x.l}
          </button>
        ))}
      </div>
      <div className="p-4 sm:p-5">
        <div className="mb-6"><CredentialScale /></div>
        {tab === 0 ? <ErsScorecard /> : <ProfileBuilder />}
      </div>
    </PanelFrame>
  );
}

// ── Data Engineering Foundation: the DAG, and what each stage does to a row ──

type ModelDetail = {
  note: string;
  tags?: { t: string; tone: string }[];
  sql: string;
  row: { k: string; v: string; was?: string; how?: string }[];
};

type StageRow = {
  key: string; label: string; tone: string; desc: string;
  models: { id: string | null; name: string; meta?: string }[];
};

const STAGE_ROWS: StageRow[] = [
  {
    key: "source", label: "Source", tone: "#94a3b8",
    desc: "Raw experiment event tables: append-only, no transforms applied",
    models: [{ id: "raw", name: "Experiment Event Sources", meta: "exposures · conversions · flag evaluations" }],
  },
  {
    key: "staging", label: "Staging", tone: "#0ea5e9",
    desc: "Cast · rename · deduplicate: one model per source, no business logic",
    models: [
      { id: "stg", name: "stg_experiment_exposures" },
      { id: null, name: "stg_experiment_conversions" },
      { id: null, name: "stg_experiment_flags" },
      { id: null, name: "stg_accounts" },
    ],
  },
  {
    key: "intermediate", label: "Intermediate", tone: "#f59e0b",
    desc: "Ephemeral: statistical aggregation and variation rollups, no table cost",
    models: [
      { id: "int", name: "int_experiment_daily_stats" },
      { id: null, name: "int_variation_aggregates" },
      { id: null, name: "int_experiment_results" },
    ],
  },
  {
    key: "marts", label: "Marts", tone: "#34d399",
    desc: "Consumer-facing conformed tables: materialized in reporting layer",
    models: [
      { id: "fact", name: "fact_experiment_results" },
      { id: null, name: "fact_daily_impressions" },
      { id: null, name: "dim_experiment" },
      { id: null, name: "dim_account" },
    ],
  },
  {
    key: "consumers", label: "Consumers", tone: "#a78bfa",
    desc: "One DAG, three audiences: experiment dashboards · stat analysis · flag health",
    models: [
      { id: null, name: "Product Managers", meta: "winner detection & dashboards" },
      { id: null, name: "Data Science", meta: "power analysis & stat testing" },
      { id: null, name: "Engineering", meta: "flag rollout health & coverage" },
    ],
  },
];

const DETAILS: Record<string, ModelDetail> = {
  raw: {
    note: "Lands exactly as it arrived. Unix timestamp, abbreviated names, no dedup guard.",
    sql: `-- append-only vault, verbatim from source
SELECT *
FROM   raw.experiment_events
WHERE  evt_type = 'EXPERIMENT_EXPOSURE'`,
    row: [
      { k: "experiment_id", v: "'exp-001'" },
      { k: "source_user_id", v: "'usr_abc123'" },
      { k: "exposure_ts", v: "1709683200" },
      { k: "var_key", v: "'var_b'" },
      { k: "evt_type", v: "'EXPERIMENT_EXPOSURE'" },
    ],
  },
  stg: {
    note: "Cast, renamed, deduped. One model per source, no business logic.",
    tags: [
      { t: "RENAME ×2", tone: "#0ea5e9" },
      { t: "CAST", tone: "#22d3ee" },
      { t: "DERIVE", tone: "#34d399" },
      { t: "DEDUPE", tone: "#fb7185" },
    ],
    sql: `SELECT
  experiment_id,
  source_user_id        AS user_id,
  TO_TIMESTAMP_NTZ(
    exposure_ts)        AS exposure_at,
  var_key               AS variation_key,
  DATE(exposure_at)     AS exposure_date
FROM raw.experiment_events
WHERE evt_type = 'EXPERIMENT_EXPOSURE'
QUALIFY ROW_NUMBER() OVER (
  PARTITION BY experiment_id,
               user_id, variation_key
  ORDER BY exposure_at
) = 1`,
    row: [
      { k: "experiment_id", v: "'exp-001'" },
      { k: "user_id", v: "'usr_abc123'", was: "source_user_id", how: "renamed" },
      { k: "exposure_at", v: "'2024-03-06 00:00:00 UTC'", was: "1709683200", how: "unix epoch" },
      { k: "variation_key", v: "'var_b'", was: "var_key", how: "renamed" },
      { k: "exposure_date", v: "'2024-03-06'", was: "derived from exposure_at" },
    ],
  },
  int: {
    note: "Ephemeral: no table cost. Joins to conversions and aggregates by day.",
    tags: [
      { t: "JOIN", tone: "#f59e0b" },
      { t: "AGGREGATE", tone: "#fbbf24" },
      { t: "EPHEMERAL", tone: "#94a3b8" },
    ],
    sql: `SELECT
  e.experiment_id,
  e.variation_key,
  e.exposure_date,
  COUNT(DISTINCT e.user_id)  AS exposures,
  COUNT(DISTINCT c.user_id)  AS conversions
FROM stg_experiment_exposures e
LEFT JOIN stg_experiment_conversions c
       ON e.experiment_id = c.experiment_id
      AND e.user_id       = c.user_id
GROUP BY 1, 2, 3`,
    row: [
      { k: "experiment_id", v: "'exp-001'" },
      { k: "variation_key", v: "'var_b'" },
      { k: "exposure_date", v: "'2024-03-06'" },
      { k: "exposures", v: "847", was: "individual rows", how: "counted" },
      { k: "conversions", v: "124", was: "left join", how: "counted" },
    ],
  },
  fact: {
    note: "Materialized table. Totals rolled up, winner detected, dimension context joined.",
    tags: [
      { t: "ROLLUP", tone: "#34d399" },
      { t: "ENRICH", tone: "#22d3ee" },
      { t: "MATERIALIZE", tone: "#818cf8" },
    ],
    sql: `SELECT
  experiment_id, variation_key,
  SUM(exposures)        AS impression_count,
  SUM(conversions)      AS conversion_count,
  ROUND(
    SUM(conversions) /
    NULLIF(SUM(exposures), 0), 4)
                        AS conversion_rate,
  conversion_rate >
    LAG(conversion_rate) OVER (
      PARTITION BY experiment_id
      ORDER BY conversion_rate)
  AND variation_key != 'control'
                        AS is_winner,
  a.arr_tier
FROM int_experiment_results r
JOIN dim_account a USING (account_id)`,
    row: [
      { k: "impression_count", v: "12,840", was: "847 / day", how: "summed" },
      { k: "conversion_count", v: "1,847", was: "124 / day", how: "summed" },
      { k: "conversion_rate", v: "0.1439 (14.4%)", was: "derived" },
      { k: "is_winner", v: "true", was: "derived" },
      { k: "arr_tier", v: "'Enterprise'", was: "from dim_account" },
    ],
  },
};

/**
 * The DAG, and then what one row actually looks like at each stage. The point of
 * a layered warehouse is that each stage does exactly one job, which is only
 * convincing if you can see the row change shape as it moves.
 */
export function DbtPanel() {
  const [sel, setSel] = useState("stg");
  const d = DETAILS[sel];
  const selName = STAGE_ROWS.flatMap((s) => s.models).find((m) => m.id === sel)?.name ?? sel;

  return (
    <PanelFrame uri="warehouse://dbt/experiment-dag" meta="5 stages">
      <div className="p-4 sm:p-5">
        {/* The DAG */}
        <div className="space-y-0">
          {STAGE_ROWS.map((st, i) => (
            <div key={st.key}>
              <div className="flex flex-col sm:flex-row rounded-lg border overflow-hidden"
                style={{ borderColor: st.tone + "26", background: st.tone + "08" }}>
                <div className="flex-shrink-0 sm:w-[132px] px-3.5 py-3 flex flex-col justify-center"
                  style={{ background: st.tone + "12" }}>
                  <span className="text-[9.5px] uppercase tracking-[0.14em] font-bold" style={{ color: st.tone }}>
                    {st.label}
                  </span>
                  <span className="block w-6 h-px mt-1.5" style={{ background: st.tone + "66" }} />
                </div>
                <div className="flex-1 px-3.5 py-3 min-w-0">
                  <p className="text-[11px] italic text-white/45 mb-2.5 leading-snug">{st.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {st.models.map((m) => {
                      const clickable = m.id !== null;
                      const on = m.id === sel;
                      return (
                        <button
                          key={m.name}
                          onClick={() => clickable && setSel(m.id!)}
                          disabled={!clickable}
                          aria-pressed={on}
                          className={`text-left px-2.5 py-1.5 rounded-md border font-mono text-[11px] transition-all ${clickable ? "" : "cursor-default"}`}
                          style={{
                            borderColor: on ? st.tone : st.tone + "33",
                            background: on ? st.tone + "26" : st.tone + "0d",
                            color: on ? "#fff" : st.tone,
                            opacity: clickable ? 1 : 0.72,
                          }}
                        >
                          {m.name}
                          {m.meta && (
                            <span className="font-sans text-white/40 ml-1.5">{m.meta}</span>
                          )}
                          {clickable && <span className="text-white/35 ml-1.5">›</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              {i < STAGE_ROWS.length - 1 && (
                <div className="pl-[18px] py-1">
                  <span className="block text-[12px]" style={{ color: STAGE_ROWS[i + 1].tone + "aa" }}>↓</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* What the row looks like at the selected stage */}
        <div className="mt-6 rounded-xl border border-white/[0.08] overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 border-b border-white/[0.07] bg-white/[0.02]">
            <code className="text-[12px] font-bold text-white">{selName}</code>
            {d.tags?.map((t) => (
              <span key={t.t} className="text-[8.5px] font-bold tracking-[0.08em] px-1.5 py-[3px] rounded"
                style={{ background: t.tone + "26", color: t.tone }}>
                {t.t}
              </span>
            ))}
            <span className="ml-auto text-[10.5px] italic text-white/40 hidden sm:block">{d.note}</span>
          </div>
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
            <div className="p-4 min-w-0">
              <p className="text-[9px] uppercase tracking-[0.13em] text-white/35 mb-2.5">SQL</p>
              <pre className="text-[10.5px] leading-relaxed text-sky-200/85 font-mono overflow-x-auto">{d.sql}</pre>
            </div>
            <div className="p-4">
              <p className="text-[9px] uppercase tracking-[0.13em] text-white/35 mb-2.5">Sample row</p>
              <div className="space-y-1.5">
                {d.row.map((f) => (
                  <div key={f.k}
                    className={`flex flex-col sm:flex-row sm:items-baseline gap-x-3 ${f.was ? "rounded-md border border-white/[0.07] bg-white/[0.02] px-2.5 py-2" : "px-2.5 py-1"}`}>
                    <span className="text-[10.5px] font-mono text-white/45 sm:w-[124px] flex-shrink-0">{f.k}</span>
                    <span className="min-w-0">
                      {f.was && (
                        <span className="block text-[10px] font-mono text-white/25 line-through">
                          {f.was}{f.how && <span className="no-underline"> · {f.how}</span>}
                        </span>
                      )}
                      <span className="block text-[11px] font-mono text-white/85">{f.v}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-white/30 mt-3">
          Click any model with a chevron to see its SQL and what it does to the row.
          Struck-through values are what the stage above handed it.
        </p>
      </div>
    </PanelFrame>
  );
}

// ── Systems Architecture: what the stack looks like after the migration ──────

const SUITE = [
  { name: "Experimentation", cloud: "GCP", tone: "#818cf8" },
  { name: "CMS", cloud: "Azure", tone: "#38bdf8" },
  { name: "Welcome", cloud: "AWS", tone: "#fbbf24" },
  { name: "Data Platform", cloud: "AWS", tone: "#34d399" },
  { name: "AI Orchestration", cloud: "GCP", tone: "#a78bfa" },
];

const CONSUMERS = [
  { name: "Analytics Platform", sub: "product managers · product exploration", tone: "#818cf8" },
  { name: "Power BI", sub: "Finance · board reporting", tone: "#fbbf24" },
  { name: "AI Orchestration", sub: "Agents · board prep · alerts", tone: "#a78bfa" },
];

const HOLDS = [
  "One warehouse, one source of truth",
  "ARR + behavioral joins in SQL",
  "No sync layer, no version skew",
];

function Hop({ label, tone }: { label: string; tone: string }) {
  return (
    <div className="flex flex-col items-center py-2">
      <span className="w-px h-3.5" style={{ background: tone + "66" }} />
      <span className="text-[11px] leading-none" style={{ color: tone + "aa" }}>⌄</span>
      <span className="text-[10.5px] text-white/40 mt-1.5 text-center px-2">{label}</span>
    </div>
  );
}

function Box({ name, sub, tone, wide = false }: { name: string; sub?: string; tone: string; wide?: boolean }) {
  return (
    <div className={`rounded-xl border px-4 py-3 text-center ${wide ? "" : "flex-1"}`}
      style={{ borderColor: tone + "40", background: tone + "12" }}>
      <p className="text-[13px] font-bold leading-tight" style={{ color: tone }}>{name}</p>
      {sub && <p className="text-[10.5px] text-white/45 mt-1 leading-snug">{sub}</p>}
    </div>
  );
}

/** The architecture the ADR argued for, and the cost model that decided it. */
export function ArchPanel() {
  const [tab, setTab] = useState<"arch" | "cost">("arch");

  return (
    <PanelFrame
      uri={tab === "arch" ? "adr://architecture/warehouse-native" : "adr://warehouse/snowflake-vs-bigquery"}
      meta={tab === "arch" ? "current state" : "list rates"}
    >
      <div className="flex flex-wrap gap-2 px-4 sm:px-5 py-3 border-b border-white/[0.06]">
        {([["arch", "Current architecture"], ["cost", "The egress finding"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} aria-pressed={tab === k}
            className="text-[11.5px] px-3 py-1.5 rounded-full border transition-all"
            style={tab === k
              ? { background: "#f43f5e", borderColor: "#f43f5e", color: "#1a0409", fontWeight: 600 }
              : { borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}>
            {l}
          </button>
        ))}
      </div>

      {tab === "cost" ? (
        <EgressBody />
      ) : (
        <div className="p-4 sm:p-6">
          <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-emerald-300/80 text-center mb-6">
            Current architecture · warehouse-native
          </p>

          <p className="text-[9.5px] uppercase tracking-[0.14em] text-white/35 text-center mb-3">
            Product suite
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {SUITE.map((x) => (
              <div key={x.name} className="rounded-xl border px-3 py-3 text-center"
                style={{ borderColor: x.tone + "33", background: x.tone + "0d" }}>
                <p className="text-[12px] font-bold leading-tight mb-2" style={{ color: x.tone }}>{x.name}</p>
                <span className="text-[9px] font-bold px-1.5 py-[3px] rounded"
                  style={{ background: x.tone + "26", color: x.tone }}>{x.cloud}</span>
              </div>
            ))}
          </div>

          <Hop label="Segment SDK: identify / group / track" tone="#94a3b8" />
          <div className="sm:max-w-[52%] sm:mx-auto">
            <Box name="Segment" sub="Event collection + Protocols gate" tone="#34d399" wide />
          </div>

          <Hop label="Protocols rejects unplanned events at ingestion" tone="#fbbf24" />

          {/* The landing zone, with what else lands beside it */}
          <div className="grid lg:grid-cols-[1fr_1.15fr_1fr] gap-4 items-center">
            <div className="text-center">
              <div className="flex flex-wrap gap-1.5 justify-center mb-1.5">
                {["Salesforce", "Zendesk", "NetSuite", "Gainsight"].map((x, i) => (
                  <span key={x} className="text-[9.5px] font-semibold px-2 py-1 rounded"
                    style={{ background: ["#38bdf8", "#818cf8", "#fb7185", "#fbbf24"][i] + "1f", color: ["#38bdf8", "#818cf8", "#fb7185", "#fbbf24"][i] }}>
                    {x}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-white/35">Fivetran ↓</p>
            </div>
            <Box name="Snowflake RAW" sub="Single landing zone · append-only" tone="#38bdf8" wide />
            <div className="text-center">
              <div className="flex flex-wrap gap-1.5 justify-center mb-1.5">
                {["GCP", "Azure", "AWS"].map((x, i) => (
                  <span key={x} className="text-[9.5px] font-semibold px-2 py-1 rounded"
                    style={{ background: ["#818cf8", "#38bdf8", "#fbbf24"][i] + "1f", color: ["#818cf8", "#38bdf8", "#fbbf24"][i] }}>
                    {x}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-white/35">RAW extracts ↓</p>
            </div>
          </div>

          <Hop label="dbt: staging → intermediate → mart" tone="#fb7185" />
          <div className="sm:max-w-[52%] sm:mx-auto">
            <Box name="dbt" sub="Transform layer · 100% test coverage" tone="#fb7185" wide />
          </div>

          <Hop label="ARR-joined · identity-resolved · cross-product" tone="#818cf8" />
          <div className="sm:max-w-[62%] sm:mx-auto">
            <Box name="Reporting Layer" sub="Consumer-ready · <2s P95 · 100+ weekly active users" tone="#818cf8" wide />
          </div>

          <Hop label="" tone="#94a3b8" />
          <div className="grid sm:grid-cols-3 gap-2.5">
            {CONSUMERS.map((c) => <Box key={c.name} {...c} />)}
          </div>

          {/* Why it holds */}
          <div className="mt-6 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.07] px-4 py-4">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
              {HOLDS.map((h) => (
                <span key={h} className="flex items-center gap-2 text-[12px] text-white/80">
                  <span className="text-emerald-300">✔</span>
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </PanelFrame>
  );
}
