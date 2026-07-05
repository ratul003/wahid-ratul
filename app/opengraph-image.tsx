import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Wahid Tawsif Ratul · Data Scientist & Product Manager";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0a0a0f",
          padding: "84px 90px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* ambient glows */}
        <div style={{ position: "absolute", top: -140, left: 360, width: 620, height: 620, background: "rgba(99,102,241,0.22)", borderRadius: 9999, filter: "blur(120px)" }} />
        <div style={{ position: "absolute", bottom: -180, right: -100, width: 560, height: 560, background: "rgba(217,70,239,0.16)", borderRadius: 9999, filter: "blur(120px)" }} />

        {/* featured chip, top-right */}
        <div
          style={{
            position: "absolute",
            top: 66,
            right: 80,
            width: 392,
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(160deg,#16161f,#0e0e16)",
            border: "1px solid rgba(99,102,241,0.40)",
            borderRadius: 18,
            padding: "22px 24px 22px 28px",
            transform: "rotate(3deg)",
            boxShadow: "0 34px 80px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 16, bottom: 16, width: 3, borderRadius: 3, background: "linear-gradient(180deg,#6366f1,#d946ef)", display: "flex" }} />
          <div style={{ display: "flex", fontSize: 15, letterSpacing: 4, textTransform: "uppercase", color: "#d946ef", fontWeight: 700 }}>Featured</div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 800, color: "#a5b4fc", marginTop: 8, letterSpacing: -1 }}>the Claude WorkOS</div>
          <div style={{ display: "flex", fontSize: 18, color: "#8888a8", marginTop: 8 }}>one person, the whole stack</div>
        </div>

        {/* eyebrow pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            alignSelf: "flex-start",
            border: "1px solid rgba(99,102,241,0.35)",
            background: "rgba(99,102,241,0.12)",
            borderRadius: 9999,
            padding: "10px 22px",
            fontSize: 22,
            fontWeight: 600,
            color: "#a5b4fc",
            letterSpacing: 2,
          }}
        >
          <div style={{ width: 11, height: 11, borderRadius: 9999, background: "#6366f1", marginRight: 12, display: "flex" }} />
          Data Scientist · Product Manager
        </div>

        {/* name */}
        <div style={{ display: "flex", fontSize: 100, fontWeight: 800, color: "#ffffff", letterSpacing: -3, marginTop: 26, lineHeight: 1 }}>
          Wahid Tawsif Ratul
        </div>

        {/* tagline */}
        <div style={{ display: "flex", fontSize: 31, color: "#8888a8", marginTop: 28, maxWidth: 860, lineHeight: 1.4 }}>
          Economist and Statistician by training. I build the systems that connect product behavior to business outcomes.
        </div>

        {/* footer */}
        <div style={{ position: "absolute", left: 90, right: 90, bottom: 54, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 23 }}>
          <div style={{ display: "flex", color: "#6b6b85" }}>projects · research · writing</div>
          <div style={{ display: "flex", color: "#a5b4fc", fontWeight: 600 }}>wahid-ratul.vercel.app</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
