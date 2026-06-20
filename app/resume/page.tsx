"use client";

const experience = [
  { role: "Product Manager", org: "Just Move In, UK", period: "2026 - present", points: [
    "Own product analytics and roadmap decisions backed by behavioral data and experimentation.",
  ] },
  { role: "Analytics Consultant (Freelance)", org: "Independent", period: "2024 - present", points: [
    "Build data foundations and analytics frameworks for early-stage startups; designed and launched a Live On-Demand Platform Service and analytics stack for a marketplace client.",
  ] },
  { role: "Analytics Engineer, Product Analytics", org: "Optimizely", period: "2024 - 2026", points: [
    "Built warehouse-native product analytics across the Optimizely suite: Segment instrumentation, Snowflake modeling, experimentation, and agentic-AI measurement.",
  ] },
  { role: "Sr. Analyst, Go-To-Market", org: "Optimizely", period: "2023 - 2024", points: [
    "GTM analytics: funnel, attribution, and revenue reporting to steer go-to-market strategy.",
  ] },
  { role: "Sr. Analyst, Pricing Strategy & Ops", org: "Optimizely", period: "2023", points: [
    "Pricing strategy and operations analytics.",
  ] },
  { role: "Asst. Manager, Logistics & Analytics", org: "foodpanda (Delivery Hero)", period: "2021 - 2023", points: [
    "Led logistics analytics for Bangladesh; cost-benefit optimization of algorithmic order stacking using BigQuery, R, and Tableau.",
  ] },
  { role: "Product Analyst", org: "InsideMaps Inc, Mountain View CA", period: "2020 - 2021", points: [
    "Product analytics for a 3D home-capture platform.",
  ] },
];

const skillGroups = [
  { label: "AI / ML", items: ["Agentic AI", "LLMs", "Machine Learning", "Predictive Modeling", "Prompt Engineering"] },
  { label: "Statistics & Data Science", items: ["Python", "SQL", "R", "Statistical Modeling", "Causal Inference", "A/B Testing", "Forecasting", "Monte Carlo Simulation"] },
  { label: "Data Engineering", items: ["Snowflake", "dbt", "Segment", "Fivetran", "Airbyte", "Data Modeling"] },
  { label: "Product & Analytics", items: ["Product Analytics & Operations", "Experimentation", "Business Intelligence", "Mixpanel", "Power BI", "Looker", "Tableau"] },
];

export default function Resume() {
  return (
    <div className="resume-root">
      <style>{`
        .resume-root { max-width: 880px; margin: 0 auto; padding: 56px 28px 80px; color: #e8e8f0; }
        .resume-root a { color: #a5b4fc; text-decoration: none; }
        .r-h1 { font-size: 2.2rem; font-weight: 800; letter-spacing: -0.02em; }
        .r-sub { color: #8888a8; margin-top: 6px; }
        .r-contact { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 12px; font-size: 0.86rem; color: #8888a8; }
        .r-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.16em; color: #6366f1; font-weight: 700; margin: 34px 0 14px; }
        .r-row { margin-bottom: 16px; }
        .r-role { font-weight: 700; }
        .r-meta { color: #8888a8; font-size: 0.88rem; }
        .r-pt { color: #b9b9cf; font-size: 0.9rem; margin-top: 4px; line-height: 1.55; }
        .r-pill { display: inline-block; border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 3px 10px; margin: 3px 5px 3px 0; font-size: 0.8rem; color: #b9b9cf; }
        .r-print { position: fixed; top: 18px; right: 18px; background: #fff; color: #0a0a0f; border: none; border-radius: 999px; padding: 10px 18px; font-weight: 700; font-size: 0.85rem; cursor: pointer; }
        .r-back { font-size: 0.85rem; }
        @media print {
          .resume-root { color: #111; max-width: 100%; padding: 0; }
          body { background: #fff !important; }
          .r-print, .r-back { display: none !important; }
          .r-sub, .r-contact, .r-meta { color: #444 !important; }
          .r-pt { color: #222 !important; }
          .r-label { color: #1a1a1a !important; }
          .r-pill { color: #222 !important; border-color: #bbb !important; }
          .resume-root a { color: #111 !important; }
        }
      `}</style>

      <button className="r-print" onClick={() => window.print()}>↓ Download PDF</button>
      <a className="r-back" href="/">← Back</a>

      <div style={{ marginTop: 18 }}>
        <div className="r-h1">Wahid Tawsif Ratul</div>
        <div className="r-sub">Data Scientist · Product Manager · Economist &amp; Statistician by training</div>
        <div className="r-contact">
          <a href="mailto:wahidtratul@gmail.com">wahidtratul@gmail.com</a>
          <a href="https://github.com/ratul003" target="_blank" rel="noopener noreferrer">github.com/ratul003</a>
          <a href="https://linkedin.com/in/wahidratul112296" target="_blank" rel="noopener noreferrer">linkedin.com/in/wahidratul112296</a>
          <a href="https://wahid-ratul.vercel.app" target="_blank" rel="noopener noreferrer">wahid-ratul.vercel.app</a>
        </div>
      </div>

      <div className="r-label">Summary</div>
      <p className="r-pt">
        Data Scientist turned Product Manager. I work at the intersection of data and product, from event
        instrumentation and warehouse modeling to experimentation and pricing, and I have an academic background in
        statistical research on dependence modeling and applied causal inference.
      </p>

      <div className="r-label">Experience</div>
      {experience.map((e) => (
        <div key={e.role + e.period} className="r-row">
          <div className="r-role">{e.role}</div>
          <div className="r-meta">{e.org} · {e.period}</div>
          {e.points.map((p, i) => <div key={i} className="r-pt">{p}</div>)}
        </div>
      ))}

      <div className="r-label">Education</div>
      <div className="r-row">
        <div className="r-role">University of Minnesota, Morris</div>
        <div className="r-meta">B.S. Economics · B.S. Statistics · Mathematics Minor</div>
        <div className="r-pt">Undergraduate research with HHMI and UROP on directional dependence (order statistics, concomitants, copulas) and survey-weighted modeling of NHANES cognitive data.</div>
      </div>

      <div className="r-label">Skills</div>
      {skillGroups.map((g) => (
        <div key={g.label} style={{ marginBottom: 10 }}>
          <div className="r-meta" style={{ marginBottom: 4 }}>{g.label}</div>
          <div>{g.items.map((s) => <span key={s} className="r-pill">{s}</span>)}</div>
        </div>
      ))}

      <div className="r-label">Selected Work</div>
      <div className="r-pt"><a href="https://wahid-ratul.vercel.app/#work">Projects</a> · <a href="https://wahid-ratul.vercel.app/#research">Research</a> · <a href="https://medium.com/@wahidtratul">Writing</a></div>
    </div>
  );
}
