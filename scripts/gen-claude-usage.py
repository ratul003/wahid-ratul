import json, glob, os, collections, datetime

files = glob.glob(os.path.expanduser("~/.claude/projects/**/*.jsonl"), recursive=True)
per_day = collections.defaultdict(lambda: {"turns": 0, "out": 0, "inp": 0})
sessions = set()
models = collections.Counter()
tools = collections.Counter()

for f in files:
    try:
        fh = open(f, encoding="utf-8", errors="replace")
    except Exception:
        continue
    for line in fh:
        line = line.strip()
        if not line:
            continue
        try:
            r = json.loads(line)
        except Exception:
            continue
        ts = r.get("timestamp")
        sid = r.get("sessionId")
        if sid:
            sessions.add(sid)
        m = r.get("message") or {}
        u = m.get("usage") or {}
        if u and ts:
            d = per_day[ts[:10]]
            d["turns"] += 1
            d["out"] += u.get("output_tokens") or 0
            d["inp"] += ((u.get("input_tokens") or 0)
                         + (u.get("cache_read_input_tokens") or 0)
                         + (u.get("cache_creation_input_tokens") or 0))
        if m.get("model"):
            models[m["model"]] += 1
        c = m.get("content")
        if isinstance(c, list):
            for b in c:
                if isinstance(b, dict) and b.get("type") == "tool_use":
                    n = b.get("name") or "?"
                    tools[n.split("__")[-1] if n.startswith("mcp__") else n] += 1

days = sorted(per_day)
out = {
    "generatedAt": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d"),
    "from": days[0] if days else None,
    "to": days[-1] if days else None,
    "sessions": len(sessions),
    "activeDays": len(days),
    "turns": sum(v["turns"] for v in per_day.values()),
    "outputTokens": sum(v["out"] for v in per_day.values()),
    "inputTokens": sum(v["inp"] for v in per_day.values()),
    "models": [{"name": k, "turns": v} for k, v in models.most_common(4) if not k.startswith("<")],
    "tools": [{"name": k, "calls": v} for k, v in tools.most_common(8)],
    "daily": [{"d": d, "turns": per_day[d]["turns"], "out": per_day[d]["out"]} for d in days],
}
dest = os.path.expanduser("~/workspace/personal-website/app/claude-usage.json")
json.dump(out, open(dest, "w"), indent=1)
print("wrote", dest)
print(json.dumps({k: v for k, v in out.items() if k != "daily"}, indent=1))
print("daily points:", len(out["daily"]))
