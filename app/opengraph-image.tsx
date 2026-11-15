import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Wahid Tawsif Ratul · Product Manager & Data Scientist · $17M+ in measured revenue gains";

const STATS = [
  { v: "$17M+", l: "measured revenue gains" },
  { v: "52%", l: "of tickets auto-solved by AI" },
  { v: "15+", l: "systems wired to Claude" },
];

export default async function Image() {
  const photo = await readFile(join(process.cwd(), "public/profile-og.png"));
  const src = `data:image/png;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#0a0a0f",
          padding: "0 70px 84px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* ambient glows */}
        <div style={{ position: "absolute", top: -200, left: -120, width: 700, height: 700, background: "rgba(99,102,241,0.30)", borderRadius: 9999, filter: "blur(130px)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: -220, right: -80, width: 640, height: 640, background: "rgba(245,165,36,0.20)", borderRadius: 9999, filter: "blur(130px)", display: "flex" }} />

        {/* left: words */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 40 }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#F5A524", letterSpacing: 1 }}>
            Product Manager · Data Scientist
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 96, fontWeight: 800, color: "#ffffff", letterSpacing: -4, lineHeight: 0.98, marginTop: 14 }}>
            <div style={{ display: "flex" }}>Wahid</div>
            <div style={{ display: "flex" }}>Tawsif Ratul</div>
          </div>
          <div style={{ display: "flex", fontSize: 33, color: "#c7c7dc", marginTop: 24, lineHeight: 1.3 }}>
            Data Scientist turned Product Manager, building AI products end to end.
          </div>

          <div style={{ display: "flex", marginTop: 28 }}>
            {STATS.map((s, i) => (
              <div
                key={s.l}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingLeft: i === 0 ? 0 : 30,
                  marginLeft: i === 0 ? 0 : 30,
                  borderLeft: i === 0 ? "none" : "2px solid rgba(255,255,255,0.14)",
                }}
              >
                <div style={{ display: "flex", fontSize: 50, fontWeight: 800, color: "#ffffff", letterSpacing: -1.5, lineHeight: 1 }}>{s.v}</div>
                <div style={{ display: "flex", fontSize: 21, color: "#9a9ab5", marginTop: 8 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* right: photo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 372,
            height: 372,
            borderRadius: 9999,
            background: "linear-gradient(135deg,#6366f1,#d946ef 55%,#F5A524)",
            boxShadow: "0 30px 90px rgba(99,102,241,0.45)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={352} height={352} alt="" style={{ borderRadius: 9999 }} />
        </div>

        {/* footer */}
        <div style={{ position: "absolute", left: 70, right: 70, bottom: 36, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24 }}>
          <div style={{ display: "flex", color: "#8a8aa6" }}>Just Move In · Optimizely · Coto · foodpanda</div>
          <div style={{ display: "flex", color: "#a5b4fc", fontWeight: 700 }}>wahid-ratul.vercel.app</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
