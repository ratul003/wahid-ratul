import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Wahid Tawsif Ratul — Data Scientist & Product Manager";

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
          padding: "90px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: -120, left: 380, width: 600, height: 600, background: "rgba(99,102,241,0.22)", borderRadius: "9999px", filter: "blur(120px)" }} />
        <div style={{ position: "absolute", bottom: -160, right: -80, width: 520, height: 520, background: "rgba(217,70,239,0.18)", borderRadius: "9999px", filter: "blur(120px)" }} />
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: "#a5b4fc", fontWeight: 700 }}>
          Data Scientist · Product Manager
        </div>
        <div style={{ display: "flex", fontSize: 104, fontWeight: 800, color: "#ffffff", letterSpacing: -3, marginTop: 18, lineHeight: 1 }}>
          Wahid Tawsif Ratul
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#8888a8", marginTop: 30, maxWidth: 820, lineHeight: 1.4 }}>
          Economist and Statistician by training. I build the systems that connect product behavior to business outcomes.
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#4a4a68", marginTop: 44 }}>
          wahid-ratul.vercel.app
        </div>
      </div>
    ),
    { ...size },
  );
}
