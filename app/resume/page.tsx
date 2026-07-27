"use client";

import { useEffect, useRef, useState } from "react";

// A4 at 96dpi
const SHEET_W = 794;
const SHEET_H = 1123;

export default function Resume() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const fit = () => setScale(Math.min(el.clientWidth / SHEET_W, 1.12));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="resume-root">
      <style>{`
        .resume-root { max-width: 980px; margin: 0 auto; padding: 28px 20px 80px; }
        .resume-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 22px; flex-wrap: wrap; }
        .resume-bar a.back { color: #8888a8; font-size: 0.85rem; text-decoration: none; }
        .resume-bar a.back:hover { color: #e8e8f0; }
        .resume-dl { display: inline-flex; align-items: center; gap: 8px; background: #fff; color: #0a0a0f; border-radius: 999px; padding: 10px 18px; font-weight: 700; font-size: 0.85rem; text-decoration: none; transition: transform 0.15s ease; }
        .resume-dl:hover { transform: translateY(-1px); }
        .resume-sheet-wrap { width: 100%; display: flex; justify-content: center; }
        .resume-sheet { flex-shrink: 0; border-radius: 6px; overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08); background: #fff; }
        .resume-sheet iframe { display: block; width: ${SHEET_W}px; height: ${SHEET_H}px; border: 0; }
      `}</style>

      <div className="resume-bar">
        <a className="back" href="/">← wahid-ratul.vercel.app</a>
        <a className="resume-dl" href="/resume/Wahid-T-Ratul-Resume.pdf" download="Wahid T. Ratul Resume.pdf">
          ↓ Download PDF
        </a>
      </div>

      <div className="resume-sheet-wrap" ref={wrapRef}>
        <div
          className="resume-sheet"
          style={{
            width: SHEET_W * scale,
            height: SHEET_H * scale,
          }}
        >
          <iframe
            src="/resume/wahid-ratul-resume.html"
            title="Wahid T. Ratul — Résumé"
            style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
          />
        </div>
      </div>
    </div>
  );
}
