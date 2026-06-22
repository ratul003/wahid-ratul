import Image from "next/image";

// ── Project icons ──────────────────────────────────────────────────────────────

function IconRadar({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="3" stroke={color} strokeWidth="1.5" />
      <circle cx="14" cy="14" r="7" stroke={color} strokeWidth="1" opacity="0.5" />
      <circle cx="14" cy="14" r="11" stroke={color} strokeWidth="0.75" opacity="0.25" />
      <path d="M14 3v3M14 22v3M3 14h3M22 14h3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconLayers({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
      <ellipse cx="14" cy="7" rx="9" ry="3" stroke={color} strokeWidth="1.5" />
      <path d="M5 7v5c0 1.66 4.03 3 9 3s9-1.34 9-3V7" stroke={color} strokeWidth="1.5" />
      <path d="M5 12v5c0 1.66 4.03 3 9 3s9-1.34 9-3v-5" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function IconFlask({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
      <path d="M10.5 3.5h7M10.5 3.5v8.5L5 22a2 2 0 0 0 1.8 2.9h14.4A2 2 0 0 0 23 22l-5.5-10V3.5"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 20h13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="21.5" r="1" fill={color} />
      <circle cx="12.5" cy="23" r="0.75" fill={color} />
    </svg>
  );
}

function IconCompass({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10" stroke={color} strokeWidth="1.5" />
      <path d="M14 4v4M14 20v4M4 14h4M20 14h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17.5 10.5l-5 3-2 5.5 5-3 2-5.5z" stroke={color} strokeWidth="1.25" strokeLinejoin="round" />
      <circle cx="14" cy="14" r="1.25" fill={color} />
    </svg>
  );
}

function IconBalance({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
      <path d="M14 5v18M6 23h16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 8H7L4 16h6l4-8z" stroke={color} strokeWidth="1.25" strokeLinejoin="round" fill="none" />
      <path d="M14 8h7l3 8h-6l-4-8z" stroke={color} strokeWidth="1.25" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function IconGem({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
      <path d="M4 12l10 13 10-13" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4 12h20M9 12l5-8 5 8" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M14 25V12M9 12l5 6 5-6" stroke={color} strokeWidth="0.75" opacity="0.4" strokeLinejoin="round" />
    </svg>
  );
}

function IconChart({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
      <path d="M4 4v18a2 2 0 0 0 2 2h18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="8" y="13" width="3.2" height="7" rx="1" stroke={color} strokeWidth="1.4" />
      <rect x="14" y="9" width="3.2" height="11" rx="1" stroke={color} strokeWidth="1.4" />
      <rect x="20" y="6" width="3.2" height="14" rx="1" stroke={color} strokeWidth="1.4" />
      <path d="M8 10l5-4 4 2 6-5" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Social icons ────────────────────────────────────────────────────────────────

function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.64h.05c.53-1 1.83-2.05 3.77-2.05C20.5 8.59 22 11 22 14.4V21h-4v-5.86c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21H9z" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

function IconMedium() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.5 5.5l1.7 2v9.7l-2 2.3h5.4l-2-2.3V8.4l4.9 11.1h.1l4.3-10.5v8.2l-1.3 1.3v.2h6.4v-.2l-1.3-1.3V6.9l1.3-1.3v-.1h-4.5L13 13.9 9.3 5.5z" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

const socials = [
  { label: "LinkedIn", href: "https://linkedin.com/in/wahidratul112296", Icon: IconLinkedIn },
  { label: "GitHub", href: "https://github.com/ratul003", Icon: IconGitHub },
  { label: "Medium", href: "https://medium.com/@wahidtratul", Icon: IconMedium },
  { label: "Email", href: "mailto:wahidtratul@gmail.com", Icon: IconEmail },
];

// ── Data ──────────────────────────────────────────────────────────────────────

const projects = [
  {
    title: "Product Intelligence Platform",
    description: "End-to-end analytics architecture spanning event instrumentation, warehouse-native metrics, and agentic AI measurement across a B2B experimentation platform's product suite.",
    color: "#6366f1",
    label: "Analytics · Enterprise SaaS",
    href: "https://product-intelligence-platform.vercel.app",
    Icon: IconRadar,
  },
  {
    title: "Data Engineering Foundation",
    description: "Three-layer Snowflake architecture with parallel ELT services, Kimball star schema modeling, and Reverse ETL patterns for operational data activation.",
    color: "#10b981",
    label: "Data Engineering · Enterprise SaaS",
    href: "https://data-engineering-foundation.vercel.app",
    Icon: IconLayers,
  },
  {
    title: "Experimentation Science",
    description: "Statistical framework behind a B2B experimentation platform's L1 metrics, 5K impression thresholding, dual frequentist/Bayesian inference, and Dev Agent quality findings.",
    color: "#f59e0b",
    label: "Experimentation · Enterprise SaaS",
    href: "https://experimentation-science.vercel.app",
    Icon: IconFlask,
  },
  {
    title: "Systems Architecture",
    description: "Two architectural decision records: Mixpanel → warehouse-native migration and a BigQuery evaluation, with egress cost analysis and migration strategy.",
    color: "#f43f5e",
    label: "Architecture · Enterprise SaaS",
    href: "https://systems-architecture.vercel.app",
    Icon: IconCompass,
  },
  {
    title: "When Demand Exceeds Supply",
    description: "Real-time demand-supply intelligence engine for two-sided marketplaces, with health scoring, surge pricing, and AI escalation routing.",
    color: "#06b6d4",
    label: "Pricing Analytics · On-Demand Marketplace",
    href: "https://when-demand-exceeds-supply.vercel.app",
    Icon: IconBalance,
  },
  {
    title: "Rank, Reward, Retain",
    description: "Expert scoring system using TOPSIS across five criteria, with dynamic revenue optimization and creator analytics, driving a 23% improvement in expert quality.",
    color: "#8b5cf6",
    label: "Incentive Design · On-Demand Marketplace",
    href: "https://rank-reward-retain.vercel.app",
    Icon: IconGem,
  },
  {
    title: "Cost-Benefit Optimization of Stacking",
    description: "Finding the order-stacking level where algorithmic dispatch stops paying for itself, cost vs. customer experience, modeled in BigQuery, R, and Tableau.",
    color: "#f97316",
    label: "Applied Analytics · Food Delivery",
    href: "https://cost-benefit-optimization.vercel.app",
    Icon: IconChart,
  },
];

const roles = [
  {
    org: "Just Move In",
    logo: "https://www.google.com/s2/favicons?domain=justmovein.com&sz=64",
    positions: [{ title: "Product Manager", period: "2026 - present" }],
  },
  {
    org: "Optimizely",
    logo: "https://www.google.com/s2/favicons?domain=optimizely.com&sz=64",
    positions: [
      { title: "Analytics Engineer, Product", period: "2024 - 2026" },
      { title: "Sr. Analyst, Go-To-Market", period: "2023 - 2024" },
    ],
  },
  {
    org: "foodpanda",
    logo: "https://www.google.com/s2/favicons?domain=foodpanda.com&sz=64",
    positions: [{ title: "Assistant Manager, Logistics & Analytics", period: "2021 - 2023" }],
  },
  {
    org: "InsideMaps",
    logo: "https://www.google.com/s2/favicons?domain=insidemaps.com&sz=64",
    positions: [{ title: "Product Analyst", period: "2020 - 2021" }],
  },
  {
    org: "Wells Fargo",
    logo: "https://www.google.com/s2/favicons?domain=wellsfargo.com&sz=64",
    positions: [{ title: "Accounting Operations Specialist", period: "2019 - 2020" }],
  },
  {
    org: "Apple",
    logo: "https://www.google.com/s2/favicons?domain=apple.com&sz=64",
    positions: [{ title: "Product Specialist", period: "2019" }],
  },
];

// Skills grouped by domain, each group shares a shining colour
const skillGroups = [
  {
    label: "AI / ML",
    color: "#a78bfa", // violet
    items: ["Agentic AI", "LLMs", "Machine Learning", "Predictive Modeling", "Prompt Engineering"],
  },
  {
    label: "Statistics & Data Science",
    color: "#22d3ee", // cyan
    items: ["Python", "SQL", "R", "Statistical Modeling", "Causal Inference", "A/B Testing", "Forecasting", "Monte Carlo Simulation"],
  },
  {
    label: "Data Engineering",
    color: "#34d399", // emerald
    items: ["Snowflake", "dbt", "Segment", "Fivetran", "Airbyte", "Data Modeling"],
  },
  {
    label: "Product & Analytics",
    color: "#fbbf24", // amber
    items: ["Product Analytics & Operations", "Experimentation", "Marketplace Operations", "Business Intelligence", "Mixpanel", "Power BI", "Looker", "Tableau"],
  },
];

// Marquee is derived dynamically from the skill groups so it always
// reflects the current skills, coloured to match each group's palette.
const marqueeItems = skillGroups.flatMap((g) =>
  g.items.map((label) => ({ label, color: g.color }))
);

const articles = [
  {
    title: "The Game That Outlived Empires",
    subtitle: "FIFA Corruption, Late-Stage Capitalism, Why Germany, and Who Wins in 2026",
    topic: "Football · Politics · Economics",
    date: "June 2026",
    excerpt: "What does a sporting tournament reveal about power, money, and who gets to write history? A deep dive into FIFA's grip on global football, Germany's statistical case for 2026, and what Monte Carlo models say when politics meets sport.",
    href: "https://fifa-wc2026-simulator.vercel.app/#article",
    color: "#34d399",
    image: "/maradona.png",
    imageAlt: "Diego Maradona lifting the 1986 World Cup trophy",
  },
];

const research = [
  {
    title: "Modeling Directional Dependence",
    role: "Statistics Senior Thesis",
    description: "A linear-model random algorithm for detecting bivariate directional dependence, the asymmetry ordinary correlation can't see.",
    color: "#a855f7",
    href: "https://research-directional-dependence.vercel.app",
  },
  {
    title: "Directional Dependence via Copulas",
    role: "HHMI Research",
    description: "Concomitants of order statistics on copulas, with Monte Carlo data designed to keep causal bias out of the directional estimate.",
    color: "#14b8a6",
    href: "https://research-copulas-directional-depend.vercel.app",
  },
  {
    title: "Cognitive Change & Neuropsychology",
    role: "UROP Research · NHANES",
    description: "Survey-weighted logistic regression on two NHANES cycles of CERAD, AFT & DSST testing to model cognitive change across gender and race.",
    color: "#0ea5e9",
    href: "https://research-nhanes-cognitive.vercel.app",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Abstract background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Drifting colour blobs */}
        <div className="drift-slow absolute -top-32 left-1/4 w-[700px] h-[700px] bg-indigo-500/[0.16] rounded-full blur-[150px]" />
        <div className="drift-slower absolute top-20 -right-32 w-[560px] h-[560px] bg-fuchsia-500/[0.13] rounded-full blur-[140px]" />
        <div className="drift-slow absolute top-1/2 -left-24 w-[480px] h-[480px] bg-cyan-500/[0.11] rounded-full blur-[130px]" />
        <div className="drift-slower absolute top-[60%] right-1/4 w-[560px] h-[560px] bg-violet-600/[0.13] rounded-full blur-[150px]" />
        <div className="drift-slow absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-amber-500/[0.08] rounded-full blur-[160px]" />
        <div className="drift-slower absolute bottom-10 right-10 w-[420px] h-[420px] bg-rose-500/[0.09] rounded-full blur-[140px]" />

        {/* Fine dot grid */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)",
          }}
        />

        {/* Rotating geometric rings, top right */}
        <svg className="spin-slow absolute -top-40 -right-40 w-[520px] h-[520px] opacity-[0.07]" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="95" stroke="white" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="70" stroke="white" strokeWidth="0.5" strokeDasharray="4 6" />
          <circle cx="100" cy="100" r="45" stroke="white" strokeWidth="0.5" />
          <circle cx="195" cy="100" r="2" fill="white" />
          <circle cx="100" cy="30" r="1.5" fill="white" />
        </svg>

        {/* Rotating polygon, bottom left */}
        <svg className="spin-slower absolute -bottom-32 -left-32 w-[440px] h-[440px] opacity-[0.06]" viewBox="0 0 200 200" fill="none">
          <polygon points="100,15 175,55 175,145 100,185 25,145 25,55" stroke="#a5b4fc" strokeWidth="0.6" />
          <polygon points="100,45 150,72 150,128 100,155 50,128 50,72" stroke="#a5b4fc" strokeWidth="0.5" strokeDasharray="3 5" />
          <circle cx="100" cy="100" r="8" stroke="#a5b4fc" strokeWidth="0.5" />
        </svg>

        {/* Constellation */}
        <svg className="absolute top-0 right-0 w-full h-full opacity-[0.06]" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <g fill="white" stroke="white">
            <circle cx="1200" cy="100" r="2" /><circle cx="1100" cy="210" r="1.5" />
            <circle cx="1310" cy="255" r="2.5" /><circle cx="1055" cy="78" r="1" />
            <circle cx="1385" cy="148" r="1.5" /><circle cx="1155" cy="325" r="2" />
            <circle cx="1258" cy="405" r="1" /><circle cx="985" cy="195" r="1.5" />
            <circle cx="855" cy="118" r="2" /><circle cx="905" cy="285" r="1" />
            <circle cx="780" cy="200" r="1.5" /><circle cx="1330" cy="380" r="1" />
            <circle cx="1420" cy="290" r="1.75" />
            <g strokeWidth="0.4" opacity="0.6">
              <line x1="1200" y1="100" x2="1100" y2="210" /><line x1="1100" y1="210" x2="1310" y2="255" />
              <line x1="1200" y1="100" x2="1310" y2="255" /><line x1="1200" y1="100" x2="1055" y2="78" />
              <line x1="1200" y1="100" x2="1385" y2="148" /><line x1="1310" y1="255" x2="1385" y2="148" />
              <line x1="1310" y1="255" x2="1420" y2="290" /><line x1="1100" y1="210" x2="1155" y2="325" />
              <line x1="1310" y1="255" x2="1155" y2="325" /><line x1="1155" y1="325" x2="1258" y2="405" />
              <line x1="1100" y1="210" x2="985" y2="195" /><line x1="985" y1="195" x2="855" y2="118" />
              <line x1="985" y1="195" x2="905" y2="285" /><line x1="855" y1="118" x2="1055" y2="78" />
              <line x1="855" y1="118" x2="780" y2="200" /><line x1="905" y1="285" x2="780" y2="200" />
            </g>
          </g>
        </svg>
      </div>

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-end gap-5">
          <a href="/resume" className="text-sm text-white/70 hover:text-white transition-colors">Résumé</a>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-5">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white/55 hover:text-white transition-colors"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-36 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-10 md:gap-14">

            {/* Photo */}
            <div className="animate-fade-up flex-shrink-0 pt-3">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden ring-1 ring-white/10">
                <Image src="/profile.png" alt="Wahid Tawsif Ratul" fill className="object-cover" priority />
              </div>
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="shiny-text animate-fade-up text-[11px] uppercase tracking-[0.25em] font-semibold mb-5">
                Data Scientist · Product Manager
              </p>
              <h1 className="animate-fade-up-delay font-bold tracking-tight leading-[1.05] mb-8 text-[clamp(1.9rem,5.2vw,3.75rem)] text-white whitespace-nowrap">
                Wahid Tawsif Ratul
              </h1>
              <div className="animate-fade-up-delay-2 flex items-start gap-6 mb-10">
                <div className="w-8 h-px bg-white/30 mt-[10px] flex-shrink-0" />
                <p className="text-sm sm:text-base text-white/70 max-w-md leading-relaxed">
                  Economist and Statistician by training. Data Scientist turned Product Manager in practice. I build the systems that close the gap between what product teams believe about their users and what&apos;s actually true.
                </p>
              </div>
              <div className="animate-fade-up-delay-2 flex flex-wrap items-center gap-3">
                <a href="#work" className="px-5 py-2.5 rounded-full bg-white text-[#0a0a0f] text-sm font-semibold hover:bg-white/90 transition-colors">
                  View Projects
                </a>
                <a href="#writing" className="px-5 py-2.5 rounded-full border border-white/15 text-sm text-white/80 hover:border-white/35 hover:text-white transition-all">
                  Read Articles
                </a>
                <a href="#research" className="px-5 py-2.5 rounded-full border border-white/15 text-sm text-white/80 hover:border-white/35 hover:text-white transition-all">
                  Research
                </a>
                <div className="flex items-center gap-1 sm:ml-2">
                  {socials.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="p-2.5 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee (dynamic, colour-matched to skills) ── */}
      <div className="border-y border-white/[0.06] py-4 overflow-hidden">
        <div className="marquee-track flex whitespace-nowrap select-none">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center">
              {marqueeItems.map((item, idx) => (
                <span key={`${i}-${idx}`} className="flex items-center gap-5 px-5">
                  <span
                    className="text-[11px] uppercase tracking-[0.18em] font-semibold"
                    style={{ color: item.color, textShadow: `0 0 14px ${item.color}77, 0 0 4px ${item.color}55` }}
                  >
                    {item.label}
                  </span>
                  <span className="text-xs" style={{ color: item.color + "66" }}>✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── About ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline gap-4 mb-14">
            <span className="text-[11px] font-mono text-white/40">01</span>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">About</p>
          </div>
          <div className="grid md:grid-cols-2 gap-16">

            {/* Left */}
            <div>
              <p className="text-white/75 leading-relaxed mb-4 text-sm">
                Economist and Statistician by training. Data Scientist turned Product Manager in practice.
              </p>
              <p className="text-white/75 leading-relaxed mb-10 text-sm">
                I build the systems that close the gap between what product teams believe about their users and what&apos;s actually true.
              </p>
              <div className="space-y-4">
                {skillGroups.map((g) => (
                  <div key={g.label}>
                    <p className="text-[9px] uppercase tracking-[0.18em] mb-2 font-semibold" style={{ color: g.color + "cc" }}>
                      {g.label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {g.items.map((s, idx) => {
                        const c = g.color;
                        return (
                          <span
                            key={s}
                            className="skill-pill text-[11px] px-3 py-1.5 rounded-full border font-medium"
                            style={
                              {
                                color: c,
                                borderColor: c + "55",
                                background: `linear-gradient(135deg, ${c}26, ${c}0a)`,
                                "--c": c,
                                "--glow": c + "55",
                                "--d": `${idx * 0.22}s`,
                              } as React.CSSProperties
                            }
                          >
                            {s}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-7">Experience</p>
              <div className="space-y-7 mb-12">
                {roles.map((company) => (
                  <div key={company.org} className="group/exp border-l border-white/10 pl-5">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      {company.logo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={company.logo} alt={company.org} width={20} height={20} className="logo-glow rounded-sm object-contain flex-shrink-0" />
                      )}
                      <p className="exp-name text-sm font-bold">{company.org}</p>
                    </div>
                    <div className={`space-y-3 ${company.positions.length > 1 ? "relative pl-5" : ""}`}>
                      {company.positions.length > 1 && (
                        <div
                          className="absolute left-1 top-2 bottom-2 w-px border-l border-dashed"
                          style={{ borderColor: "#a5b4fc", opacity: 0.7 }}
                        />
                      )}
                      {company.positions.map((pos) => (
                        <div key={pos.title} className="relative">
                          {company.positions.length > 1 && (
                            <span
                              className="glow-dot absolute -left-[18px] top-[5px] w-2.5 h-2.5 rounded-full ring-2 ring-[#0a0a0f]"
                              style={{
                                background: "linear-gradient(135deg, #c7d2fe, #818cf8)",
                                boxShadow: "0 0 10px #818cf8cc, 0 0 4px #c7d2fe",
                              }}
                            />
                          )}
                          <p className="exp-title text-sm font-medium leading-snug">{pos.title}</p>
                          <p className="text-xs text-white/45 mt-0.5">{pos.period}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-6">Education</p>
              <div className="border-l border-white/10 pl-5">
                <p className="text-sm font-semibold text-white/95">University of Minnesota</p>
                <div className="flex items-center gap-2 mt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://www.google.com/s2/favicons?domain=umn.edu&sz=64" alt="UMN" width={16} height={16} className="rounded-sm object-contain flex-shrink-0" style={{ opacity: 0.75 }} />
                  <p className="text-sm text-white/65">Bachelor&apos;s</p>
                </div>
                <div className="relative mt-2 pl-4">
                  <div
                    className="absolute left-[3px] top-2 bottom-2 w-px"
                    style={{ background: "linear-gradient(to bottom, #fcd34d, #f59e0b)", opacity: 0.7 }}
                  />
                  {[
                    { label: "Economics", minor: false },
                    { label: "Statistics", minor: false },
                    { label: "Mathematics Minor", minor: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 mb-2 relative">
                      <span
                        className="glow-dot absolute -left-[15px] top-[5px] w-2 h-2 rounded-full flex-shrink-0 ring-2 ring-[#0a0a0f]"
                        style={
                          item.minor
                            ? { background: "transparent", border: "1.5px solid #fcd34d", boxShadow: "0 0 6px #fbbf2480" }
                            : { background: "linear-gradient(135deg, #fde68a, #f59e0b)", boxShadow: "0 0 10px #fbbf24cc, 0 0 4px #fde68a" }
                        }
                      />
                      <p className={`text-xs ${item.minor ? "text-amber-200/55" : "text-amber-100/85"}`}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="work" className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline gap-4 mb-14">
            <span className="text-[11px] font-mono text-white/40">02</span>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">Projects</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {projects.map((p) => (
              <a
                key={p.title}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-lg border border-white/[0.07] overflow-hidden hover:border-white/[0.15] hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 ease-out"
              >
                {/* Content */}
                <div className="flex flex-col flex-1 p-3.5 bg-white/[0.02]">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0 transition-transform duration-300 ease-out group-hover:scale-110"
                      style={{ background: `${p.color}1a`, border: `1px solid ${p.color}33` }}
                    >
                      <span className="scale-[0.6]">
                        <p.Icon color={p.color} />
                      </span>
                    </div>
                    <p className="text-[9px] uppercase tracking-[0.12em] font-semibold leading-tight" style={{ color: p.color + "cc" }}>
                      {p.label}
                    </p>
                  </div>
                  <h3 className="text-[13px] font-semibold text-white mb-1.5 leading-snug">{p.title}</h3>
                  <p className="text-[11px] text-white/55 leading-relaxed flex-1 line-clamp-4">{p.description}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-white/45 group-hover:text-white/80 transition-colors">
                    <span>View project</span>
                    <ArrowUpRight />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Writing ── */}
      <section id="writing" className="relative py-24 px-6 border-t border-white/[0.06] overflow-hidden">
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-baseline justify-between mb-14">
            <div className="flex items-baseline gap-4">
              <span className="text-[11px] font-mono text-white/40">03</span>
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">Writing</p>
            </div>
            <a href="https://medium.com/@wahidtratul" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/55 hover:text-white transition-colors">
              All on Medium <ArrowUpRight />
            </a>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {articles.map((a) => (
              <a
                key={a.title}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col rounded-xl border border-white/[0.08] overflow-hidden min-h-[420px] hover:border-white/[0.2] hover:-translate-y-0.5 transition-all duration-300 ease-out"
              >
                {/* Sketched photo background, sitting inside the card box */}
                <div className="absolute inset-0 pointer-events-none">
                  <Image
                    src={a.image}
                    alt={a.imageAlt}
                    fill
                    className="maradona-sketch object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{ objectPosition: "50% 40%" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/45 to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${a.color}77, transparent)` }} />
                </div>

                {/* Content sits at the bottom, over the image */}
                <div className="relative z-10 flex flex-col flex-1 justify-end p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] uppercase tracking-[0.15em] font-semibold" style={{ color: a.color }}>{a.topic}</span>
                    <span className="text-white/30">·</span>
                    <span className="text-[10px] text-white/55">{a.date}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1 leading-snug">{a.title}</h3>
                  <p className="text-xs text-white/65 mb-4 leading-snug">{a.subtitle}</p>
                  <p className="text-xs text-white/70 leading-relaxed">{a.excerpt}</p>
                  <div className="mt-5 flex items-center gap-1.5 text-[11px] text-white/60 group-hover:text-white transition-colors">
                    <span>Read the article</span>
                    <ArrowUpRight />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Research ── */}
      <section id="research" className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="text-[11px] font-mono text-white/40">04</span>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">Research</p>
          </div>
          <p className="text-sm text-white/55 max-w-xl mb-12 leading-relaxed">
            Before product and pipelines, there was the lab and the proof. My academic
            research at the University of Minnesota grounded everything that came after.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {research.map((r) => (
              <a
                key={r.title}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-lg border border-white/[0.07] p-4 bg-white/[0.02] hover:border-white/[0.15] hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out"
                style={{ boxShadow: `inset 0 1px 0 ${r.color}1a` }}
              >
                <div
                  className="w-7 h-[3px] rounded-full mb-4 transition-all duration-300 group-hover:w-12"
                  style={{ background: r.color, boxShadow: `0 0 10px ${r.color}aa` }}
                />
                <p className="text-[9px] uppercase tracking-[0.14em] font-semibold mb-1.5" style={{ color: r.color + "cc" }}>
                  {r.role}
                </p>
                <h3 className="text-[13px] font-semibold text-white mb-2 leading-snug">{r.title}</h3>
                <p className="text-[11px] text-white/55 leading-relaxed flex-1">{r.description}</p>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-white/40 group-hover:text-white/75 transition-colors">
                  <span>View case study</span>
                  <ArrowUpRight />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-14 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-white/85 mb-1">Wahid Tawsif Ratul</p>
            <p className="text-xs text-white/45">© 2026 · Data Scientist · Product Manager</p>
          </div>
          <div className="flex items-center gap-5">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white/50 hover:text-white transition-colors"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
