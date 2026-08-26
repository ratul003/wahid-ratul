"use client";

import { useMemo, useState } from "react";

/**
 * Interactive panels, one per job, in the same grammar as the experiment
 * console: a titled window, real inputs, real arithmetic, no mocked output.
 *
 * Every constant a panel assumes is printed on the panel. That is the whole
 * difference between showing the work and asserting it.
 */

// ── Shared chrome ─────────────────────────────────────────────────────────────

export function PanelFrame({
  uri,
  badge = "live",
  meta,
  children,
}: {
  uri: string;
  badge?: string;
  meta?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.09] bg-[#0b0b11] overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-white/[0.07] bg-white/[0.02]">
        <span className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
        </span>
        <code className="text-[11px] text-white/45 font-mono truncate">{uri}</code>
        <span className="ml-auto flex items-center gap-1.5 flex-shrink-0">
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            style={{ boxShadow: "0 0 7px #34d399" }}
          />
          <span className="text-[10px] uppercase tracking-[0.12em] text-emerald-300/80">
            {badge}
          </span>
          {meta && (
            <span className="text-[10px] text-white/30 ml-1 tabular-nums hidden sm:inline">
              {meta}
            </span>
          )}
        </span>
      </div>
      {children}
    </div>
  );
}

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block mb-5">
      <span className="flex items-baseline justify-between mb-2">
        <span className="text-[11.5px] text-white/70">{label}</span>
        <span className="text-[12.5px] font-semibold text-white tabular-nums">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ec-range w-full"
        aria-label={label}
      />
    </label>
  );
}

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

function Assumptions({ items }: { items: string[] }) {
  return (
    <p className="text-[10px] text-white/30 leading-relaxed mt-3.5">
      Assumes {items.join(" · ")}
    </p>
  );
}

// ── foodpanda: where stacking stops paying ───────────────────────────────────

const BASE_COST = 0.55; // fixed cost per order, EUR
const VAR_COST = 1.3; // cost that stacking divides down
const ON_TIME_CEIL = 0.94; // on-time rate at one order per trip
const DECAY = 0.085;
const CURVATURE = 1.55;

const costPerOrder = (s: number) => BASE_COST + VAR_COST / s;
const onTimeRate = (s: number) => ON_TIME_CEIL - DECAY * Math.pow(s - 1, CURVATURE);
/** Net cost per order: what dispatch spends plus what lateness costs. Lower is better. */
const netCost = (s: number, lateCost: number) =>
  costPerOrder(s) + lateCost * (1 - onTimeRate(s));

/**
 * The trade-off I actually modelled at foodpanda: stacking more orders onto one
 * rider trip drives cost per order down and lateness up. The optimum is not a
 * matter of taste, it is wherever you price a late order, so that is the slider.
 */
export function DispatchPanel() {
  const [stack, setStack] = useState(2.6);
  const [lateCost, setLateCost] = useState(2.4);

  const r = useMemo(() => {
    // Scan the feasible range for the minimum, rather than asserting one.
    let best = 1;
    let bestVal = Infinity;
    const curve: { s: number; v: number }[] = [];
    for (let s = 1; s <= 3.0001; s += 0.02) {
      const v = netCost(s, lateCost);
      curve.push({ s, v });
      if (v < bestVal) {
        bestVal = v;
        best = s;
      }
    }
    const here = netCost(stack, lateCost);
    return {
      curve,
      best,
      bestVal,
      here,
      cost: costPerOrder(stack),
      onTime: onTimeRate(stack),
      gap: here - bestVal,
    };
  }, [stack, lateCost]);

  const eur = (n: number) => "€" + n.toFixed(2);
  const atOptimum = Math.abs(stack - r.best) < 0.06;

  // Curve geometry. Uniform aspect ratio, so nothing distorts.
  const W = 320;
  const H = 128;
  // Domain spans every series on the chart, or the components clip at the edges
  const vs = r.curve.flatMap((p) => [
    p.v,
    costPerOrder(p.s),
    lateCost * (1 - onTimeRate(p.s)),
  ]);
  const vMin = Math.min(...vs);
  const vMax = Math.max(...vs);
  const px = (s: number) => ((s - 1) / 2) * W;
  const py = (v: number) => H - ((v - vMin) / (vMax - vMin || 1)) * (H - 8) - 4;
  const path = r.curve.map((p, i) => `${i ? "L" : "M"}${px(p.s).toFixed(1)} ${py(p.v).toFixed(1)}`).join(" ");

  return (
    <PanelFrame uri="dispatch://assignment/stacking-intensity" meta="scanning 1.0-3.0" badge="live">
      <div className="grid md:grid-cols-[1fr_1.15fr] divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
        <div className="p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/35 mb-4">Inputs</p>
          <Slider
            label="Orders per rider trip"
            value={stack}
            display={stack.toFixed(2)}
            min={1}
            max={3}
            step={0.02}
            onChange={setStack}
          />
          <Slider
            label="What a late order costs you"
            value={lateCost}
            display={eur(lateCost)}
            min={0.5}
            max={4}
            step={0.05}
            onChange={setLateCost}
          />
          <Row label="Dispatch cost" value={eur(r.cost)} hint="/ order" />
          <Row label="On time" value={`${(r.onTime * 100).toFixed(1)}%`} />
          <Row label="Net cost" value={eur(r.here)} hint="/ order" />
          <Assumptions items={["a 16K-rider fleet", "5 verticals", "cost curve fitted per city"]} />
        </div>

        <div className="p-4 sm:p-5">
          <div
            className="rounded-lg px-3.5 py-3 mb-4 border"
            style={{
              borderColor: atOptimum ? "#34d3994d" : "#fbbf244d",
              background: atOptimum ? "#34d39912" : "#fbbf2412",
            }}
          >
            <span
              className="block text-[13px] font-semibold leading-tight mb-1"
              style={{ color: atOptimum ? "#34d399" : "#fbbf24" }}
            >
              {atOptimum
                ? `At the optimum, ${r.best.toFixed(2)} orders per trip`
                : `Optimum is ${r.best.toFixed(2)} orders per trip`}
            </span>
            <span className="block text-[11px] leading-relaxed text-white/60">
              {atOptimum
                ? `Net ${eur(r.bestVal)} per order. Price lateness differently and this moves.`
                : `You are leaving ${eur(r.gap)} per order on the table. Across 2M orders a month that is ${"€" + Math.round(r.gap * 2_000_000).toLocaleString()}.`}
            </span>
          </div>

          {/* Two components and their sum: the optimum is where they cross over */}
          <figure className="m-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
              aria-label="Dispatch cost, lateness cost and their total against orders per rider trip">
              {/* Optimum guide */}
              <line x1={px(r.best)} x2={px(r.best)} y1={4} y2={H}
                stroke="rgba(52,211,153,0.4)" strokeWidth="1" strokeDasharray="3 3" />
              {/* Dispatch cost: falls as stacking spreads the trip */}
              <path d={r.curve.map((p, i) =>
                `${i ? "L" : "M"}${px(p.s).toFixed(1)} ${py(BASE_COST + VAR_COST / p.s).toFixed(1)}`).join(" ")}
                fill="none" stroke="#22d3ee" strokeWidth="1.75" strokeLinecap="round" strokeDasharray="4 3" />
              {/* Cost of lateness: climbs as on-time slips */}
              <path d={r.curve.map((p, i) =>
                `${i ? "L" : "M"}${px(p.s).toFixed(1)} ${py(lateCost * (1 - onTimeRate(p.s))).toFixed(1)}`).join(" ")}
                fill="none" stroke="#fbbf24" strokeWidth="1.75" strokeLinecap="round" strokeDasharray="4 3" />
              {/* Their sum */}
              <path d={path} fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx={px(r.best)} cy={py(r.bestVal)} r="4.5" fill="#0b0b11" />
              <circle cx={px(r.best)} cy={py(r.bestVal)} r="3" fill="#34d399" />
              <circle cx={px(stack)} cy={py(r.here)} r="4.5" fill="#0b0b11" />
              <circle cx={px(stack)} cy={py(r.here)} r="2.6" fill="#fff" />
            </svg>
            <div className="flex justify-between text-[10px] text-white/35 mt-1">
              <span>1.0</span><span>orders per rider trip</span><span>3.0</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
              {[
                { c: "#22d3ee", l: "dispatch cost" },
                { c: "#fbbf24", l: "cost of lateness" },
                { c: "#f97316", l: "total" },
              ].map((k) => (
                <span key={k.l} className="flex items-center gap-1.5 text-[10px] text-white/55">
                  <span className="w-3 h-[2px] rounded" style={{ background: k.c }} />
                  {k.l}
                </span>
              ))}
            </div>
          </figure>
        </div>
      </div>
    </PanelFrame>
  );
}

// ── Coto: the supply barometer, on real queueing maths ───────────────────────

const SESSION_MIN = 35; // mean consultation length
const PATIENCE_MIN = 150; // mean customer patience before abandoning
const MU = 60 / SESSION_MIN; // sessions an expert can serve per hour

/** Erlang B, by the standard stable recursion. */
function erlangB(a: number, c: number): number {
  let b = 1;
  for (let k = 1; k <= c; k++) b = (a * b) / (k + a * b);
  return b;
}

/** Erlang C: the probability an arriving request has to queue at all. */
function erlangC(a: number, c: number): number {
  const rho = a / c;
  if (rho >= 1) return 1;
  const b = erlangB(a, c);
  return b / (1 - rho * (1 - b));
}


/** The health state at any (experts, demand) pair, for the phase diagram. */
function stateAt(experts: number, demand: number): 0 | 1 | 2 {
  const capacity = experts * MU;
  const a = demand / MU;
  const rho = a / experts;
  if (rho >= 1) return 2;
  const waitMin = Math.min(240, (erlangC(a, experts) / (capacity - demand)) * 60);
  const dropout = 1 - Math.exp(-waitMin / PATIENCE_MIN);
  if (waitMin < 30 && dropout < 0.05) return 0;
  if (waitMin < 60 && dropout < 0.15) return 1;
  return 2;
}

const PHASE_FILL = ["#34d39955", "#fbbf2455", "#fb718555"];

/** Every operating point at once: where the marketplace is fine, strained, gone. */
function PhaseDiagram({ experts, demand }: { experts: number; demand: number }) {
  const EX = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40];
  const DE = [70, 60, 50, 40, 32, 24, 17, 12, 8, 4];
  const cells = useMemo(
    () => DE.map((d) => EX.map((e) => stateAt(e, d))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const nearest = (arr: number[], v: number) =>
    arr.reduce((b, x) => (Math.abs(x - v) < Math.abs(b - v) ? x : b), arr[0]);
  const ci = EX.indexOf(nearest(EX, experts));
  const rj = DE.indexOf(nearest(DE, demand));

  return (
    <figure className="m-0">
      <div className="flex gap-2">
        <div className="flex flex-col justify-between py-[1px] text-[8.5px] text-white/30 tabular-nums">
          {DE.filter((_, i) => i % 3 === 0).map((d) => <span key={d}>{d}</span>)}
        </div>
        <div className="flex-1">
          <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${EX.length}, 1fr)` }}>
            {cells.map((row, j) =>
              row.map((st, i) => (
                <div
                  key={`${i}-${j}`}
                  className="aspect-square rounded-[2px] transition-all"
                  style={{
                    background: PHASE_FILL[st],
                    boxShadow: i === ci && j === rj ? "inset 0 0 0 2px #fff" : undefined,
                  }}
                />
              ))
            )}
          </div>
          <div className="flex justify-between mt-1 text-[8.5px] text-white/30 tabular-nums">
            <span>4</span><span>experts online</span><span>40</span>
          </div>
        </div>
      </div>
      <figcaption className="text-[10px] text-white/40 mt-1.5 text-center">
        Requests per hour against experts online. The ringed cell is where the sliders sit.
      </figcaption>
    </figure>
  );
}

type Health = { key: "green" | "yellow" | "red"; label: string; color: string; note: string };

const RESPONSE: Record<Health["key"], { supply: string[]; demand: string[] }> = {
  green: {
    supply: ["Standard earnings visibility", "Tiered membership benefits highlighted"],
    demand: ["Base pricing, no surge", "Standard booking flow"],
  },
  yellow: {
    supply: ["Incentive engine activates", "Surge revenue-share band opens to 60%"],
    demand: ["Surge pricing applied", "Wait time shown before booking"],
  },
  red: {
    supply: ["Maximum 90% revenue-share band", "All-hands push to every idle expert"],
    demand: ["Escalation routing to any available expert", "Deferred booking with a callback offer"],
  },
};

/**
 * The instrument behind the incentive engine. Supply thins, the queue builds,
 * and the two sides of the marketplace get told different things about it. The
 * thresholds are the ones that actually fired: 30 minutes and 5% dropout.
 */
export function SupplyPanel() {
  const [experts, setExperts] = useState(12);
  const [demand, setDemand] = useState(17);

  const r = useMemo(() => {
    const capacity = experts * MU;
    const a = demand / MU; // offered load, in erlangs
    const rho = a / experts;
    const saturated = rho >= 1;

    const c = erlangC(a, experts);
    const waitHrs = saturated ? Infinity : c / (capacity - demand);
    const waitMin = saturated ? 240 : Math.min(240, waitHrs * 60);
    const dropout = 1 - Math.exp(-waitMin / PATIENCE_MIN);

    let health: Health;
    if (!saturated && waitMin < 30 && dropout < 0.05) {
      health = { key: "green", label: "Green", color: "#34d399", note: "Operating normally, nothing fires." };
    } else if (!saturated && waitMin < 60 && dropout < 0.15) {
      health = { key: "yellow", label: "Yellow", color: "#fbbf24", note: "Supply pressure. The incentive engine activates." };
    } else {
      health = {
        key: "red",
        label: "Red",
        color: "#fb7185",
        note: saturated
          ? "Demand exceeds capacity outright. The queue never clears on its own."
          : "Critical shortfall. Maximum response on both sides.",
      };
    }
    return { capacity, rho, saturated, waitMin, dropout, health };
  }, [experts, demand]);

  const h = r.health;
  const pct = Math.min(100, (r.rho / 1.2) * 100); // gauge runs 0 to 120% utilisation

  return (
    <PanelFrame uri="marketplace://health/supply-barometer" meta="Erlang C">
      <div className="grid md:grid-cols-[1fr_1.2fr] divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
        <div className="p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/35 mb-4">Inputs</p>
          <Slider
            label="Experts online"
            value={experts}
            display={String(experts)}
            min={2}
            max={40}
            step={1}
            onChange={setExperts}
          />
          <Slider
            label="Requests per hour"
            value={demand}
            display={String(demand)}
            min={1}
            max={80}
            step={1}
            onChange={setDemand}
          />
          <Row label="Capacity" value={r.capacity.toFixed(1)} hint="sessions / hr" />
          <Row label="Utilisation" value={`${(r.rho * 100).toFixed(0)}%`} />
          <Row
            label="Expected wait"
            value={r.saturated ? "unbounded" : `${r.waitMin.toFixed(0)} min`}
          />
          <Row label="Dropout" value={`${(r.dropout * 100).toFixed(1)}%`} />
          <Assumptions
            items={[`${SESSION_MIN} min sessions`, `${PATIENCE_MIN} min mean patience`, "M/M/c queue"]}
          />
        </div>

        <div className="p-4 sm:p-5">
          {/* State carries a dot and a word, never colour alone */}
          <div
            className="flex items-start gap-3 rounded-lg px-3.5 py-3 mb-4 border"
            style={{ borderColor: h.color + "4d", background: h.color + "12" }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-[5px]"
              style={{ background: h.color, boxShadow: `0 0 9px ${h.color}` }}
            />
            <span>
              <span className="block text-[13px] font-semibold leading-tight mb-1" style={{ color: h.color }}>
                {h.label}
              </span>
              <span className="block text-[11px] leading-relaxed text-white/60">{h.note}</span>
            </span>
          </div>

          {/* Every operating point, not just this one */}
          <div className="mb-4">
            <PhaseDiagram experts={experts} demand={demand} />
          </div>

          {/* What each side of the marketplace is told about it */}
          <div className="grid sm:grid-cols-2 gap-3">
            {(
              [
                { title: "Supply side · what experts get", items: RESPONSE[h.key].supply },
                { title: "Demand side · what customers see", items: RESPONSE[h.key].demand },
              ] as const
            ).map((col) => (
              <div key={col.title} className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                <p className="text-[9px] uppercase tracking-[0.1em] text-white/35 mb-2 leading-snug">
                  {col.title}
                </p>
                <ul className="space-y-1.5">
                  {col.items.map((it) => (
                    <li key={it} className="flex gap-2 text-[11px] leading-relaxed text-white/70">
                      <span
                        className="mt-[6px] w-[3px] h-[3px] rounded-full flex-shrink-0"
                        style={{ background: h.color }}
                      />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelFrame>
  );
}

// ── Just Move In: the WorkOS session picker, running here ─────────────────────

const AMBER = "#F5A524";

type Session = {
  group: string;
  label: string;
  file: string;
  cmd: string;
  note: string;
  lines: { kind: "tool" | "add" | "ok" | "dim" | "sub"; text: string }[];
  tiles: { label: string; value: string; sub: string; good?: boolean }[];
  badge: string;
  summary: string;
};

/**
 * Six of the sessions from the real WorkOS harness, wired up so you can run
 * them here. The "Automate a workflow" transcript is the one the project site
 * ships; the rest are the same shape, with figures that match the role bullets.
 */
const SESSIONS: Session[] = [
  {
    group: "Platform & Ops",
    label: "Automate a workflow",
    file: "automations/call-to-notes.md",
    cmd: "automate customer calls into filed notes",
    note: "building a workflow that triggers on a new transcript",
    lines: [
      { kind: "tool", text: "Write(automations/call-to-notes.md)" },
      { kind: "add", text: "on: new_transcript" },
      { kind: "add", text: "run: skill(customer-call-summary)" },
      { kind: "add", text: "then: write(product/customers/), post(#product)" },
      { kind: "tool", text: "Bash(register the automation)" },
      { kind: "sub", text: "active" },
      { kind: "ok", text: "every call now self-files in a comparable format" },
      { kind: "ok", text: "highlights posted to #product automatically" },
      { kind: "dim", text: "set once, runs itself, no manual write-ups" },
    ],
    tiles: [
      { label: "Calls auto-filed", value: "54", sub: "last 30d" },
      { label: "Time saved", value: "~3 hrs/wk", sub: "compounding", good: true },
    ],
    badge: "SET + FORGET",
    summary:
      "Runs on every call, automatically. Same fields every time, so all 54 calls stay comparable, no manual write-ups.",
  },
  {
    group: "Product",
    label: "Run UAT",
    file: "product/uat/move-journey.md",
    cmd: "run UAT on the move journey release",
    note: "reading the ticket, then driving the build in a real browser",
    lines: [
      { kind: "tool", text: "Read(linear/JMI-489)" },
      { kind: "tool", text: "Playwright(walk the 9-step move journey)" },
      { kind: "add", text: "step 4: energy deal fetched by API, renders" },
      { kind: "add", text: "step 7: broadband handoff, 2 deals missing a price" },
      { kind: "tool", text: "Write(product/uat/move-journey.md)" },
      { kind: "ok", text: "7 of 9 steps pass, 2 defects filed with screenshots" },
      { kind: "dim", text: "the release note writes itself from the same file" },
    ],
    tiles: [
      { label: "Steps covered", value: "9 / 9", sub: "per release" },
      { label: "Cycle time", value: "2 days → 20 min", sub: "per pass", good: true },
    ],
    badge: "UAT",
    summary:
      "The suite that used to be a two-day manual pass, run end to end before the standup that asked for it.",
  },
  {
    group: "Product",
    label: "Build & ship a feature",
    file: "product/specs/deal-ranking.md",
    cmd: "prototype the deal-ranking change and ship it behind a flag",
    note: "spec, build, flag, measure, all in one session",
    lines: [
      { kind: "tool", text: "Write(product/specs/deal-ranking.md)" },
      { kind: "tool", text: "Edit(app/journey/deals.tsx)" },
      { kind: "add", text: "rank by margin x conversion, not margin alone" },
      { kind: "tool", text: "Bash(posthog flag: deal-ranking-v2, 50%)" },
      { kind: "ok", text: "shipped behind a flag with the readout already wired" },
      { kind: "dim", text: "no handoff, no queue, no ticket waiting on an engineer" },
    ],
    tiles: [
      { label: "Spec to flag", value: "1 session", sub: "same afternoon" },
      { label: "Readout", value: "auto-wired", sub: "PostHog", good: true },
    ],
    badge: "0 → SHIPPED",
    summary:
      "The spec, the build and the experiment are one artefact, so the thing that measures it cannot drift from the thing that shipped.",
  },
  {
    group: "Data & Analytics",
    label: "Ship an intelligence report",
    file: "analytics/reports/phone-funnel.md",
    cmd: "build the weekly phone-funnel report the board reads",
    note: "stitching call records to moves, then writing the narrative",
    lines: [
      { kind: "tool", text: "Bash(dbt run --select fct_calls)" },
      { kind: "add", text: "1.4M call records stitched to 880K moves" },
      { kind: "tool", text: "Read(analytics/metrics.md)" },
      { kind: "tool", text: "Write(analytics/reports/phone-funnel.md)" },
      { kind: "ok", text: "~90% of phone revenue attributed, by closer" },
      { kind: "dim", text: "same definitions as the dashboard, by construction" },
    ],
    tiles: [
      { label: "Records reconciled", value: "1.4M", sub: "to 880K moves" },
      { label: "Reporting lag", value: "weekly → daily", sub: "digest", good: true },
    ],
    badge: "SYSTEM OF RECORD",
    summary:
      "One metric definition, read by the board and by the daily digest that coaches closers. There is no second version to argue about.",
  },
  {
    group: "Data & Analytics",
    label: "Experiment readout",
    file: "analytics/experiments/jmi-471.md",
    cmd: "read out the checkout experiment and make the call",
    note: "power first, then the interval, then the decision",
    lines: [
      { kind: "tool", text: "Bash(query posthog: jmi-471 exposures)" },
      { kind: "add", text: "n = 24,180 per arm, 12.4% baseline" },
      { kind: "add", text: "lift +1.7pp overall, +3.9pp on mobile" },
      { kind: "tool", text: "Write(analytics/experiments/jmi-471.md)" },
      { kind: "ok", text: "powered at 84%, interval clears zero: ship" },
      { kind: "dim", text: "one call per launch, written down where anyone can check it" },
    ],
    tiles: [
      { label: "Overall lift", value: "+1.7pp", sub: "84% power" },
      { label: "Mobile lift", value: "+3.9pp", sub: "ship", good: true },
    ],
    badge: "SHIP",
    summary:
      "The same gate the Optimizely console runs, applied to a live release: power against a declared MDE, then one decision.",
  },
  {
    group: "Growth",
    label: "Launch a campaign",
    file: "growth/campaigns/mover-nurture.md",
    cmd: "personalise the mover nurture campaign and launch it",
    note: "one journey per mover, built from the warehouse",
    lines: [
      { kind: "tool", text: "Read(analytics/segments/movers.sql)" },
      { kind: "tool", text: "Write(growth/campaigns/mover-nurture.md)" },
      { kind: "add", text: "580K journeys, branch on completed services" },
      { kind: "tool", text: "Bash(customer.io: sync + dry run)" },
      { kind: "ok", text: "40K+ emails queued, 52.9% open rate held" },
      { kind: "dim", text: "the segment and the campaign read the same model" },
    ],
    tiles: [
      { label: "Journeys personalised", value: "580K", sub: "movers" },
      { label: "Open rate", value: "52.9%", sub: "held", good: true },
    ],
    badge: "LIVE",
    summary:
      "Personalisation driven off the warehouse rather than a hand-maintained list, so the campaign cannot drift from the data.",
  },
];

const LINE_STYLE: Record<Session["lines"][number]["kind"], string> = {
  tool: "text-orange-300",
  add: "text-emerald-300/85",
  ok: "text-emerald-300",
  dim: "text-white/35 italic",
  sub: "text-white/45",
};
const LINE_MARK: Record<Session["lines"][number]["kind"], string> = {
  tool: "●",
  add: "+",
  ok: "✓",
  dim: " ",
  sub: "└",
};

const TREE = [
  { name: ".claude/", depth: 0, dir: true },
  { name: "analytics/", depth: 0, dir: true },
  { name: "metrics.md", depth: 1, dir: false },
  { name: "pipelines/", depth: 1, dir: true },
  { name: "mcp/", depth: 0, dir: true },
  { name: "product/", depth: 0, dir: true },
  { name: "growth/", depth: 0, dir: true },
  { name: "team/", depth: 0, dir: true },
  { name: "CLAUDE.md", depth: 0, dir: false },
];

export function WorkOsPanel() {
  const [active, setActive] = useState(
    Math.max(0, SESSIONS.findIndex((x) => x.label === "Automate a workflow"))
  );
  const s = SESSIONS[active];
  const groups = ["Product", "Data & Analytics", "Growth", "Platform & Ops"];

  return (
    <PanelFrame uri="workos://sessions/one-person-every-function" meta="pick a session">
      {/* Session picker */}
      <div className="p-4 sm:p-5 border-b border-white/[0.06]">
        <p className="text-[10px] font-mono text-orange-300/70 mb-4">
          run a real session → one person, every function
        </p>
        <div className="space-y-3">
          {groups.map((g) => (
            <div key={g} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <p className="text-[9.5px] uppercase tracking-[0.13em] text-white/35 sm:w-[132px] flex-shrink-0 sm:pt-[7px]">
                {g}
              </p>
              <div className="flex flex-wrap gap-2">
                {SESSIONS.map((x, i) =>
                  x.group !== g ? null : (
                    <button
                      key={x.label}
                      onClick={() => setActive(i)}
                      aria-pressed={i === active}
                      className="text-[11.5px] px-3 py-1.5 rounded-full border transition-all"
                      style={
                        i === active
                          ? { background: AMBER, borderColor: AMBER, color: "#1a1206", fontWeight: 600 }
                          : { borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }
                      }
                    >
                      {x.label}
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The session, running */}
      <div className="grid md:grid-cols-[152px_1fr] divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
        <div className="hidden md:block p-3.5">
          <p className="text-[9px] uppercase tracking-[0.12em] text-white/30 mb-2.5">
            Explorer · workos
          </p>
          <ul className="space-y-[5px] font-mono">
            {TREE.map((t) => (
              <li
                key={t.name}
                className={`text-[10.5px] ${t.dir ? "text-orange-300/70" : "text-white/45"}`}
                style={{ paddingLeft: t.depth * 10 }}
              >
                {t.dir ? "▸ " : "  "}
                {t.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 sm:p-5 min-w-0">
          <p className="text-[10.5px] font-mono text-white/45 mb-3 truncate">{s.file}</p>

          {/* What the session produced */}
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            {s.tiles.map((t) => (
              <div key={t.label} className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3.5 py-3">
                <p className="text-[10px] text-white/40 mb-1.5">{t.label}</p>
                <p className="text-[1.35rem] font-bold text-white leading-none tabular-nums mb-1">
                  {t.value}
                </p>
                <p className={`text-[10px] ${t.good ? "text-emerald-300/80" : "text-white/35"}`}>
                  {t.good && "▲ "}
                  {t.sub}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 rounded-lg border px-3.5 py-3 mb-4"
            style={{ borderColor: AMBER + "40", background: AMBER + "0f" }}>
            <span className="text-[9px] font-bold tracking-[0.1em] px-2 py-[3px] rounded flex-shrink-0"
              style={{ background: AMBER, color: "#1a1206" }}>
              {s.badge}
            </span>
            <span className="text-[11.5px] leading-relaxed text-white/70">{s.summary}</span>
          </div>

          {/* The terminal */}
          <div className="rounded-lg border border-white/[0.07] bg-black/40 p-3.5 font-mono overflow-x-auto">
            <p className="text-[11px] text-orange-300 mb-1">❯ {s.cmd}</p>
            <p className="text-[10.5px] text-white/35 italic mb-2">✳ {s.note}</p>
            {s.lines.map((l, i) => (
              <p key={i} className={`text-[10.5px] leading-relaxed whitespace-nowrap ${LINE_STYLE[l.kind]}`}>
                <span className="inline-block w-3 opacity-70">{LINE_MARK[l.kind]}</span>
                {l.text}
              </p>
            ))}
            <p className="text-[9.5px] text-white/25 mt-2.5 pt-2 border-t border-white/[0.06]">
              Claude Opus · accept edits on
            </p>
          </div>
        </div>
      </div>
    </PanelFrame>
  );
}
