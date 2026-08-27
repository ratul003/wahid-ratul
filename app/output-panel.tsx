"use client";

import { useEffect, useMemo, useState } from "react";
import usage from "./claude-usage.json";

/**
 * Working output, from two real sources.
 *
 * Claude usage is a snapshot: there is no public API for it, so it is computed
 * from the local session transcripts by scripts/gen-claude-usage.py and
 * committed, stamped with the date it was taken.
 *
 * Push activity is genuinely live, read from the GitHub public events API in the
 * browser. That endpoint covers roughly the last 90 days or 300 events,
 * whichever comes first, so the window is stated rather than implied.
 *
 * Both grids run from the first day with data to today. They are not padded out
 * to a year: an empty ten months would imply nothing happened, which is the
 * opposite of true.
 */

const AMBER = "#F5A524";
const EMERALD = "#34d399";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const iso = (d: Date) => d.toISOString().slice(0, 10);
const parse = (s: string) => new Date(s + "T00:00:00Z");
const short = (n: number) =>
  n >= 1e9 ? `${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : String(n);
const dayLabel = (s: string) =>
  parse(s).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

/** Columns of seven days, Sunday first, covering the whole range. */
function weeks(from: string, to: string) {
  const start = parse(from);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());
  const end = parse(to);
  end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()));
  const cols: string[][] = [];
  for (let t = start.getTime(); t <= end.getTime(); t += 7 * 86400000) {
    cols.push(Array.from({ length: 7 }, (_, i) => iso(new Date(t + i * 86400000))));
  }
  return cols;
}

/** Longest and current runs of consecutive days with any activity. */
function streaks(days: string[], has: (d: string) => boolean) {
  let longest = 0;
  let run = 0;
  for (const d of days) {
    run = has(d) ? run + 1 : 0;
    if (run > longest) longest = run;
  }
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (!has(days[i])) break;
    current += 1;
  }
  return { longest, current };
}

function Calendar({
  from, to, value, tone, unit,
}: { from: string; to: string; value: (d: string) => number; tone: string; unit: string }) {
  const cols = useMemo(() => weeks(from, to), [from, to]);
  const all = cols.flat();
  const max = Math.max(...all.map(value), 1);
  const today = iso(new Date());

  // A month label sits above the first column that starts a new month
  const monthAt = (i: number) => {
    const m = parse(cols[i][0]).getUTCMonth();
    if (i === 0) return MONTHS[m];
    return parse(cols[i - 1][0]).getUTCMonth() !== m ? MONTHS[m] : null;
  };

  const shade = (v: number) => {
    if (v === 0) return { background: "rgba(255,255,255,0.045)" };
    const f = Math.min(1, Math.sqrt(v / max));
    return { background: tone, opacity: 0.3 + f * 0.7 };
  };

  return (
    <div>
      <div className="flex gap-[3px] ml-[26px] mb-1">
        {cols.map((_, i) => (
          <span key={i} className="w-[13px] text-[8.5px] text-white/35 whitespace-nowrap">
            {monthAt(i)}
          </span>
        ))}
      </div>
      <div className="flex gap-[3px]">
        <div className="flex flex-col gap-[3px] mr-[3px] w-[22px]">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((l, i) => (
            <span key={i} className="h-[13px] text-[8.5px] text-white/30 leading-[13px]">{l}</span>
          ))}
        </div>
        {cols.map((col, i) => (
          <div key={i} className="flex flex-col gap-[3px]">
            {col.map((d) => {
              const future = d > today;
              const v = value(d);
              return (
                <span
                  key={d}
                  title={future ? "" : `${dayLabel(d)}: ${v} ${unit}`}
                  className="w-[13px] h-[13px] rounded-[3px]"
                  style={future ? { background: "transparent" } : shade(v)}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1.5 mt-2">
        <span className="text-[9px] text-white/30">Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <span key={f} className="w-[10px] h-[10px] rounded-[3px]"
            style={f === 0 ? { background: "rgba(255,255,255,0.045)" } : { background: tone, opacity: 0.3 + f * 0.7 }} />
        ))}
        <span className="text-[9px] text-white/30">More</span>
      </div>
    </div>
  );
}

function StatRow({ items, tone }: { items: { v: string; l: string }[]; tone: string }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 rounded-xl border border-white/[0.08] overflow-hidden mt-4">
      {items.map((s, i) => (
        <div key={s.l}
          className="px-3 py-3 text-center"
          style={{
            borderLeft: i % 4 === 0 ? undefined : "1px solid rgba(255,255,255,0.06)",
            borderTop: i >= 2 ? "1px solid rgba(255,255,255,0.06)" : undefined,
          }}>
          <p className="text-[1.05rem] font-bold leading-none tabular-nums mb-1.5" style={{ color: tone }}>{s.v}</p>
          <p className="text-[8.5px] uppercase tracking-[0.1em] text-white/40 leading-snug">{s.l}</p>
        </div>
      ))}
    </div>
  );
}

export default function OutputPanel() {
  const [pushDays, setPushDays] = useState<Map<string, number> | null>(null);
  const [repos, setRepos] = useState<string[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("https://api.github.com/users/ratul003/events/public?per_page=100")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((events: { type: string; created_at: string; repo?: { name: string } }[]) => {
        if (!alive) return;
        const m = new Map<string, number>();
        const rs = new Set<string>();
        for (const e of events) {
          if (e.type !== "PushEvent") continue;
          const d = e.created_at.slice(0, 10);
          m.set(d, (m.get(d) ?? 0) + 1);
          if (e.repo?.name) rs.add(e.repo.name.split("/").pop()!);
        }
        setPushDays(m);
        setRepos([...rs]);
      })
      .catch((e) => alive && setErr(e.message));
    return () => { alive = false; };
  }, []);

  const today = iso(new Date());

  const claude = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of usage.daily) m.set(r.d, r.turns);
    const from = usage.from!;
    const days: string[] = [];
    for (let t = parse(from).getTime(); t <= parse(today).getTime(); t += 86400000) {
      days.push(iso(new Date(t)));
    }
    const s = streaks(days, (d) => (m.get(d) ?? 0) > 0);
    const last30 = days.slice(-30).reduce((a, d) => a + (m.get(d) ?? 0), 0);
    return { m, from, days, ...s, last30 };
  }, [today]);

  const push = useMemo(() => {
    if (!pushDays?.size) return null;
    const keys = [...pushDays.keys()].sort();
    const from = keys[0];
    const days: string[] = [];
    for (let t = parse(from).getTime(); t <= parse(today).getTime(); t += 86400000) {
      days.push(iso(new Date(t)));
    }
    const s = streaks(days, (d) => (pushDays.get(d) ?? 0) > 0);
    const total = [...pushDays.values()].reduce((a, b) => a + b, 0);
    const last30 = days.slice(-30).reduce((a, d) => a + (pushDays.get(d) ?? 0), 0);
    return { from, days, total, last30, ...s };
  }, [pushDays, today]);

  return (
    <div className="space-y-6">
      {/* Claude Code */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0b0b11] p-4 sm:p-6">
        <p className="text-[10px] uppercase tracking-[0.16em] font-bold mb-2.5" style={{ color: AMBER }}>
          Agentic build output
        </p>
        <h3 className="text-[1.35rem] sm:text-[1.6rem] font-bold tracking-tight text-white leading-tight mb-2.5">
          <span style={{ color: AMBER }}>{short(usage.inputTokens)}</span> tokens read,{" "}
          <span style={{ color: AMBER }}>{short(usage.outputTokens)}</span> written. And counting.
        </h3>
        <p className="text-[12.5px] text-white/55 leading-relaxed max-w-2xl mb-5">
          Every panel on this page was built in Claude Code. This is the transcript record:
          agent turns per day, the tools that did the work, and the models that ran it.
          A snapshot taken {usage.generatedAt}, because there is no API to read it live.
        </p>

        <Calendar from={claude.from} to={today} value={(d) => claude.m.get(d) ?? 0}
          tone={AMBER} unit="agent turns" />

        <StatRow tone={AMBER} items={[
          { v: usage.turns.toLocaleString(), l: "agent turns" },
          { v: `${usage.activeDays} days`, l: "days active" },
          { v: `${claude.longest} days`, l: "longest streak" },
          { v: `${claude.current} days`, l: "current streak" },
        ]} />

        <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap gap-x-6 gap-y-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.11em] text-white/35 mb-2">Tools it reached for</p>
            <div className="flex flex-wrap gap-1.5">
              {usage.tools.map((t) => (
                <span key={t.name} className="text-[10px] px-2 py-1 rounded-md border tabular-nums"
                  style={{ borderColor: AMBER + "33", background: AMBER + "0f", color: "rgba(255,255,255,0.7)" }}>
                  {t.name} <span style={{ color: AMBER }}>{t.calls.toLocaleString()}</span>
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.11em] text-white/35 mb-2">Models</p>
            <div className="flex flex-wrap gap-3">
              {usage.models.map((m) => (
                <span key={m.name} className="text-[10px] text-white/45">
                  {m.name} <span className="text-white/70 tabular-nums">{m.turns.toLocaleString()}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GitHub, live */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0b0b11] p-4 sm:p-6">
        <p className="text-[10px] uppercase tracking-[0.16em] font-bold mb-2.5 flex items-center gap-2"
          style={{ color: EMERALD }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: EMERALD, boxShadow: `0 0 7px ${EMERALD}` }} />
          Shipping cadence · live
        </p>

        {err && (
          <p className="text-[12px] text-white/45 py-6">
            GitHub&apos;s API did not answer ({err}). It rate-limits unauthenticated callers, so this
            panel goes quiet rather than showing a stale number.
          </p>
        )}
        {!err && !push && <p className="text-[12px] text-white/35 py-6">Reading the API…</p>}

        {push && (
          <>
            <h3 className="text-[1.35rem] sm:text-[1.6rem] font-bold tracking-tight text-white leading-tight mb-2.5">
              <span style={{ color: EMERALD }}>{push.total}</span> pushes across{" "}
              <span style={{ color: EMERALD }}>{repos.length}</span> repositories.
            </h3>
            <p className="text-[12.5px] text-white/55 leading-relaxed max-w-2xl mb-5">
              Read from the GitHub public events API when this page loaded, not baked in at build
              time. The window is what that endpoint returns, roughly the last 90 days.
            </p>

            <Calendar from={push.from} to={today} value={(d) => pushDays!.get(d) ?? 0}
              tone={EMERALD} unit="pushes" />

            <StatRow tone={EMERALD} items={[
              { v: String(push.total), l: "pushes in window" },
              { v: String(pushDays!.size), l: "days active" },
              { v: `${push.longest} days`, l: "longest streak" },
              { v: `${push.current} days`, l: "current streak" },
            ]} />

            <div className="mt-5 pt-4 border-t border-white/[0.06]">
              <p className="text-[9px] uppercase tracking-[0.11em] text-white/35 mb-2">Repositories</p>
              <div className="flex flex-wrap gap-1.5">
                {repos.map((r) => (
                  <span key={r} className="text-[10px] px-2 py-1 rounded-md border"
                    style={{ borderColor: EMERALD + "33", background: EMERALD + "0f", color: "rgba(255,255,255,0.7)" }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
