"use client";

import { useEffect, useMemo, useState } from "react";
import usage from "./claude-usage.json";

/**
 * Working output, from two real sources.
 *
 * Claude usage is a snapshot: there is no public API for it, so it is computed
 * from the local session transcripts by scripts/gen-claude-usage.py and
 * committed. The date it was generated is printed on the panel.
 *
 * Push activity is genuinely live, read from the GitHub public events API in the
 * browser. That endpoint returns roughly the last 90 days or 300 events,
 * whichever comes first, so the window is stated rather than implied.
 */

const AMBER = "#F5A524";
const INDIGO = "#818cf8";

type PushDay = { d: string; pushes: number; repos: Set<string> };

const short = (n: number) =>
  n >= 1e9 ? `${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : String(n);

const dayLabel = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

/** A run of consecutive dates, so an empty day still gets a cell. */
function span(from: string, to: string) {
  const out: string[] = [];
  const a = new Date(from + "T00:00:00Z");
  const b = new Date(to + "T00:00:00Z");
  for (let t = a.getTime(); t <= b.getTime(); t += 86400000) {
    out.push(new Date(t).toISOString().slice(0, 10));
  }
  return out;
}

function Heat({
  dates, value, max, tone, title,
}: { dates: string[]; value: (d: string) => number; max: number; tone: string; title: (d: string, v: number) => string }) {
  return (
    <div className="flex flex-wrap gap-[3px]">
      {dates.map((d) => {
        const v = value(d);
        const f = max > 0 ? v / max : 0;
        return (
          <span
            key={d}
            title={title(d, v)}
            className="w-[13px] h-[13px] rounded-[3px]"
            style={{
              background: v === 0 ? "rgba(255,255,255,0.05)" : tone,
              opacity: v === 0 ? 1 : 0.28 + Math.min(1, Math.sqrt(f)) * 0.72,
            }}
          />
        );
      })}
    </div>
  );
}

function Stat({ v, l, tone }: { v: string; l: string; tone?: string }) {
  return (
    <div>
      <p className="text-[1.35rem] font-bold tracking-tight leading-none tabular-nums mb-1"
        style={{ color: tone ?? "#fff" }}>{v}</p>
      <p className="text-[9.5px] uppercase tracking-[0.11em] text-white/40 leading-snug">{l}</p>
    </div>
  );
}

export default function OutputPanel() {
  const [pushes, setPushes] = useState<PushDay[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("https://api.github.com/users/ratul003/events/public?per_page=100")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((events: { type: string; created_at: string; repo?: { name: string } }[]) => {
        if (!alive) return;
        const byDay = new Map<string, PushDay>();
        for (const e of events) {
          if (e.type !== "PushEvent") continue;
          const d = e.created_at.slice(0, 10);
          const row = byDay.get(d) ?? { d, pushes: 0, repos: new Set<string>() };
          row.pushes += 1;
          if (e.repo?.name) row.repos.add(e.repo.name.split("/").pop()!);
          byDay.set(d, row);
        }
        setPushes([...byDay.values()].sort((a, b) => a.d.localeCompare(b.d)));
      })
      .catch((e) => alive && setErr(e.message));
    return () => { alive = false; };
  }, []);

  const claudeDates = useMemo(
    () => (usage.from && usage.to ? span(usage.from, usage.to) : []),
    []
  );
  const claudeByDay = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of usage.daily) m.set(r.d, r.turns);
    return m;
  }, []);
  const claudeMax = Math.max(...usage.daily.map((r) => r.turns), 1);

  const pushStats = useMemo(() => {
    if (!pushes?.length) return null;
    const total = pushes.reduce((a, x) => a + x.pushes, 0);
    const repos = new Set<string>();
    pushes.forEach((p) => p.repos.forEach((r) => repos.add(r)));
    const dates = span(pushes[0].d, pushes[pushes.length - 1].d);
    const busiest = [...pushes].sort((a, b) => b.pushes - a.pushes)[0];
    return { total, repos, dates, busiest, max: busiest.pushes };
  }, [pushes]);

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {/* Claude usage */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0b0b11] p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER, boxShadow: `0 0 7px ${AMBER}` }} />
          <p className="text-[10px] uppercase tracking-[0.13em] text-white/45">
            Claude Code · agentic output
          </p>
          <span className="ml-auto text-[9.5px] text-white/30">
            snapshot {usage.generatedAt}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-4 mb-5">
          <Stat v={short(usage.inputTokens)} l="tokens read" tone={AMBER} />
          <Stat v={short(usage.outputTokens)} l="tokens written" tone={AMBER} />
          <Stat v={usage.turns.toLocaleString()} l="agent turns" />
          <Stat v={String(usage.sessions)} l="sessions" />
        </div>

        <Heat
          dates={claudeDates}
          value={(d) => claudeByDay.get(d) ?? 0}
          max={claudeMax}
          tone={AMBER}
          title={(d, v) => `${dayLabel(d)}: ${v} agent turns`}
        />
        <p className="text-[10px] text-white/35 mt-2.5">
          {usage.activeDays} active days, {dayLabel(usage.from!)} to {dayLabel(usage.to!)}
        </p>

        <div className="mt-4 pt-3.5 border-t border-white/[0.06]">
          <p className="text-[9.5px] uppercase tracking-[0.11em] text-white/35 mb-2.5">
            What the agent actually did
          </p>
          <div className="flex flex-wrap gap-1.5">
            {usage.tools.map((t) => (
              <span key={t.name}
                className="text-[10px] px-2 py-1 rounded-md border tabular-nums"
                style={{ borderColor: AMBER + "33", background: AMBER + "0f", color: "rgba(255,255,255,0.7)" }}>
                {t.name} <span style={{ color: AMBER }}>{t.calls.toLocaleString()}</span>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            {usage.models.map((m) => (
              <span key={m.name} className="text-[10px] text-white/40">
                {m.name} <span className="text-white/60 tabular-nums">{m.turns.toLocaleString()} turns</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Live push activity */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0b0b11] p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            style={{ boxShadow: "0 0 7px #34d399" }} />
          <p className="text-[10px] uppercase tracking-[0.13em] text-white/45">
            GitHub · pushes, live
          </p>
          <a href="https://github.com/ratul003" target="_blank" rel="noopener noreferrer"
            className="ml-auto text-[9.5px] text-white/30 hover:text-white/70 transition-colors">
            @ratul003 ↗
          </a>
        </div>

        {err && (
          <p className="text-[11.5px] text-white/45 py-8 text-center">
            GitHub&apos;s API did not answer ({err}). It rate-limits unauthenticated
            callers, so this panel goes quiet rather than showing a stale number.
          </p>
        )}
        {!err && !pushStats && (
          <p className="text-[11.5px] text-white/35 py-8 text-center">Reading the API…</p>
        )}

        {pushStats && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-4 mb-5">
              <Stat v={String(pushStats.total)} l="pushes in window" tone="#34d399" />
              <Stat v={String(pushStats.repos.size)} l="repositories" tone="#34d399" />
              <Stat v={String(pushStats.dates.length)} l="days covered" />
              <Stat v={String(pushStats.busiest.pushes)} l="busiest day" />
            </div>

            <Heat
              dates={pushStats.dates}
              value={(d) => pushes!.find((p) => p.d === d)?.pushes ?? 0}
              max={pushStats.max}
              tone="#34d399"
              title={(d, v) => `${dayLabel(d)}: ${v} push${v === 1 ? "" : "es"}`}
            />
            <p className="text-[10px] text-white/35 mt-2.5">
              {dayLabel(pushStats.dates[0])} to {dayLabel(pushStats.dates[pushStats.dates.length - 1])},
              read from the public events API on load
            </p>

            <div className="mt-4 pt-3.5 border-t border-white/[0.06]">
              <p className="text-[9.5px] uppercase tracking-[0.11em] text-white/35 mb-2.5">
                Repositories pushed to
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[...pushStats.repos].map((r) => (
                  <span key={r} className="text-[10px] px-2 py-1 rounded-md border"
                    style={{ borderColor: "#34d39933", background: "#34d3990f", color: "rgba(255,255,255,0.7)" }}>
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
