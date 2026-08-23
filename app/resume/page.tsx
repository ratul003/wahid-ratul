"use client";

import { useEffect, useRef, useState } from "react";

// A4 at 96dpi
const SHEET_W = 794;
const SHEET_H = 1123;

export default function Resume() {
  const measureRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const fit = () => setFitScale(Math.min(el.clientWidth / SHEET_W, 1.12));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Below this, the fitted sheet is too small to read and zoom is worth offering.
  const canZoom = fitScale < 0.8;
  const scale = zoomed && canZoom ? 1 : fitScale;

  useEffect(() => {
    if (!zoomed) return;
    const el = scrollRef.current;
    if (!el) return;
    // Land on the main column, not the sidebar.
    el.scrollLeft = (el.scrollWidth - el.clientWidth) * 0.45;
  }, [zoomed]);

  return (
    <div className="resume-root">
      <style>{`
        .resume-root { max-width: 980px; margin: 0 auto; padding: 28px 20px 80px; }
        .resume-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 22px; flex-wrap: wrap; }
        .resume-bar a.back { color: #8888a8; font-size: 0.85rem; text-decoration: none; }
        .resume-bar a.back:hover { color: #e8e8f0; }
        .resume-dl { display: inline-flex; align-items: center; gap: 8px; background: #fff; color: #0a0a0f; border-radius: 999px; padding: 10px 18px; font-weight: 700; font-size: 0.85rem; text-decoration: none; transition: transform 0.15s ease; }
        .resume-dl:hover { transform: translateY(-1px); }
        .resume-zoom { display: flex; align-items: center; gap: 7px; margin: -6px 0 12px; padding: 0; background: none; border: 0; color: #8888a8; font: inherit; font-size: 0.78rem; letter-spacing: 0.01em; cursor: pointer; }
        .resume-zoom:hover { color: #e8e8f0; }
        .resume-zoom span.glyph { font-size: 0.9rem; line-height: 1; }
        .resume-measure { width: 100%; }
        .resume-scroll { width: 100%; display: flex; justify-content: center; }
        .resume-scroll.zoomed { overflow-x: auto; justify-content: flex-start; -webkit-overflow-scrolling: touch; overscroll-behavior-x: contain; }
        .resume-sheet { flex-shrink: 0; border-radius: 6px; overflow: hidden; box-shadow: 0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08); background: #fff; }
        .resume-sheet iframe { display: block; width: ${SHEET_W}px; height: ${SHEET_H}px; border: 0; }
      `}</style>

      <div className="resume-bar">
        <a className="back" href="/">← wahid-ratul.vercel.app</a>
        <a className="resume-dl" href="/resume/Wahid-T-Ratul-Resume.pdf" download="Wahid T. Ratul Resume.pdf">
          ↓ Download PDF
        </a>
      </div>

      {canZoom && (
        <button className="resume-zoom" onClick={() => setZoomed((z) => !z)}>
          <span className="glyph">{zoomed ? "⤡" : "⤢"}</span>
          {zoomed ? "Tap to fit the page" : "Tap to zoom · pinch to zoom further"}
        </button>
      )}

      <div className="resume-measure" ref={measureRef}>
        <div className={`resume-scroll${zoomed && canZoom ? " zoomed" : ""}`} ref={scrollRef}>
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
    </div>
  );
}
