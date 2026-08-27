import Image from "next/image";
import Link from "next/link";
import { articles as hostedArticles } from "./writing/articles";
import { MARKS } from "./skill-marks";
import ExperimentConsole from "./experiment-console";
import { WorkOsPanel, DispatchPanel, SupplyPanel } from "./job-panels";
import { CopulaSurface, DirectionalDependence, SurveyWeights } from "./research-panels";
import SectionRail from "./section-rail";
import OutputPanel from "./output-panel";
import { StackPanel, DbtPanel, ArchPanel, TopsisPanel } from "./impl-panels";

// ── Project icons ──────────────────────────────────────────────────────────────

function ArrowUpRight() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Shared bits ───────────────────────────────────────────────────────────────

/** A skill's logo (brand colour) or glyph (group colour), glowing in its own hue. */
function SkillMark({ name, color, size = 14 }: { name: string; color: string; size?: number }) {
  const mark = MARKS[name];
  if (!mark) return null;
  return (
    <span
      className="skill-mark inline-flex items-center justify-center flex-shrink-0"
      style={{ "--mglow": (mark.hex ?? color) + "bb" } as React.CSSProperties}
    >
      {mark.render(color, size)}
    </span>
  );
}

/**
 * Project names that appear inside role bullets, linked to the thing they name
 * and coloured to match its card. A reader should not have to guess that
 * "WorkOS" in a bullet is the same WorkOS shown below it.
 */
const LINKED: { term: string; href: string; color: string }[] = [
  { term: "Product Intelligence Platform", href: "https://product-intelligence-platform.vercel.app", color: "#6366f1" },
  { term: "experimentation platform", href: "https://experimentation-science.vercel.app", color: "#f59e0b" },
  { term: "Snowflake-to-BigQuery", href: "https://systems-architecture.vercel.app", color: "#f43f5e" },
  { term: "warehouse-native stack", href: "https://systems-architecture.vercel.app", color: "#f43f5e" },
  { term: "WorkOS", href: "https://claude-ing.vercel.app", color: "#F5A524" },
  { term: "partner-ranking product", href: "https://rank-reward-retain.vercel.app", color: "#8b5cf6" },
  { term: "dynamic pay engine", href: "https://when-demand-exceeds-supply.vercel.app", color: "#06b6d4" },
  { term: "demand-supply engine", href: "https://when-demand-exceeds-supply.vercel.app", color: "#06b6d4" },
  { term: "national order dispatch policy", href: "https://cost-benefit-optimization.vercel.app", color: "#f97316" },
];

/** One bullet chunk: bold the **figures**, link and colour any project named. */
function Linkify({ text }: { text: string }) {
  const hit = LINKED.find((l) => text.includes(l.term));
  if (!hit) return <>{text}</>;
  const [before, ...rest] = text.split(hit.term);
  return (
    <>
      {before}
      <a
        href={hit.href}
        target="_blank"
        rel="noopener noreferrer"
        className="impl-link font-medium"
        style={{ color: hit.color, "--c": hit.color } as React.CSSProperties}
      >
        {hit.term}
        <ArrowUpRight />
      </a>
      <Linkify text={rest.join(hit.term)} />
    </>
  );
}

/** Renders **wrapped** spans as emphasised figures. */
function Impact({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((chunk, i) =>
        i % 2 === 1 ? (
          <b key={i} className="font-semibold text-white/90">
            <Linkify text={chunk} />
          </b>
        ) : (
          <Linkify key={i} text={chunk} />
        )
      )}
    </>
  );
}

type CaseLink = { label: string; href: string; color: string };

/** One impact bullet. */
function Bullet({ line }: { line: string }) {
  return (
    <li className="flex gap-2 text-[11.5px] leading-relaxed text-white/55">
      <span
        className="mt-[6px] w-[3px] h-[3px] rounded-full flex-shrink-0"
        style={{ background: "#a5b4fc", boxShadow: "0 0 6px #818cf8" }}
      />
      <span>
        <Impact text={line} />
      </span>
    </li>
  );
}

/** Every bullet, expanded. No dropdown: a collapsed bullet is a bullet nobody reads. */
function ImpactList({ lines }: { lines: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {lines.map((line) => (
        <Bullet key={line} line={line} />
      ))}
    </ul>
  );
}

/** Chips linking a role to the implementations it produced. */
function CaseLinks({ links }: { links: CaseLink[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2.5">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="case-chip inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide px-2 py-[3px] rounded-full border"
          style={
            {
              color: l.color,
              borderColor: l.color + "4d",
              background: l.color + "12",
              "--c": l.color,
            } as React.CSSProperties
          }
        >
          {l.label}
          <ArrowUpRight />
        </a>
      ))}
    </div>
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

/**
 * Every deployed project, thumbnailed with a real screenshot of the running
 * site rather than a stock photo. `org` ties each one back to the job that
 * produced it, so the catalogue and the job sections agree.
 */
const projects = [
  {
    title: "Wired Claude Into 15+ Production Systems",
    name: "Claude-ing WorkOS",
    org: "Just Move In",
    label: "AI Operating Layer",
    description:
      "An AI operating layer where one PM runs the whole stack. Wires Claude into 15+ production systems for UAT, bug triage, data pipelines and every function's reporting, then walks you through it session by session in a live IDE demo.",
    inside: "19 runnable sessions · tiered-context harness · narrated film",
    color: "#F5A524",
    href: "https://claude-ing.vercel.app",
    image: "/shots/claude-ing-workos.jpg",
    interactive: "workos" as const,
    magnitude: [
      { v: "15+", l: "production systems wired" },
      { v: "6", l: "job functions covered" },
      { v: "21", l: "runnable sessions" },
    ],
    detail:
      "Claude wired into 15+ production systems, with a harness that opens every session already knowing the repo and the metric definitions. Eleven AI workflows close 83% of 76K yearly tickets without an agent ever replying.",
  },
  {
    title: "Standardised Product Metrics Across 10+ SaaS Teams",
    name: "Product Intelligence Platform",
    org: "Optimizely",
    label: "Product Analytics",
    description:
      "The system of record 10+ SaaS product teams shipped against: one governed L1 engagement and L2 adoption metric per product over 1.2M+ daily events, plus the 8-step gating process that ended metric drift for good.",
    inside: "Metric tree · gating workflow · adoption cohorts",
    color: "#6366f1",
    href: "https://product-intelligence-platform.vercel.app",
    image: "/shots/product-intelligence-platform.jpg",
    interactive: "stack" as const,
    magnitude: [
      { v: "10+", l: "product teams shipping on it" },
      { v: "1.2M+", l: "events a day" },
      { v: "70+", l: "stakeholders self-serving" },
    ],
    detail:
      "Ten products, ten definitions of engagement, no way to compare any of them. One instrumentation contract, one governed metric per product, and an eight-gate intake that ended the drift for good.",
  },
  {
    title: "Built the Frequentist and Bayesian A/B Testing Framework",
    name: "Running Meaningful Experiments",
    org: "Optimizely",
    label: "Experimentation",
    description:
      "The statistical framework behind the platform: a 5,000-impression gate at 80% power, dual frequentist and Bayesian inference, and the Dev Agent quality finding that came out of actually reading the results.",
    inside: "Power curves · sequential testing · ship-or-kill rule",
    color: "#f59e0b",
    href: "https://experimentation-science.vercel.app",
    image: "/shots/experimentation-science.jpg",
    interactive: "console" as const,
    magnitude: [
      { v: "10+", l: "teams shipping on it" },
      { v: "5,000", l: "impression gate per arm" },
      { v: "58% → 74%", l: "cross-sell qualification" },
    ],
    detail:
      "A PM can launch a test in minutes. Trusting the readout is the hard part. A declared MDE, a 5,000-impression floor, 80% power, and exactly one ship-or-kill call per launch.",
  },
  {
    title: "Built the Snowflake Data Warehouse and ELT Pipelines",
    name: "Data Engineering Foundation",
    org: "Optimizely",
    label: "Data Engineering",
    description:
      "The warehouse everything else runs on. Three-layer Snowflake architecture with four parallel ELT services above it, Kimball star schemas, and Reverse ETL pushing scores back into Salesforce and Gainsight.",
    inside: "Layer diagram · star schemas · reverse-ETL flow",
    color: "#10b981",
    href: "https://data-engineering-foundation.vercel.app",
    image: "/shots/data-engineering-foundation.jpg",
    interactive: "lineage" as const,
    magnitude: [
      { v: "4", l: "parallel ELT services" },
      { v: "3", l: "dbt layers above them" },
      { v: "8", l: "teams migrated in 6 months" },
    ],
    detail:
      "Eight products generating data nobody could join together. Four ELT services into an immutable RAW layer, Kimball marts as the only layer a dashboard may read, and Reverse ETL back into the CRM.",
  },
  {
    title: "Migrated 8 Product Teams from Mixpanel to the Warehouse",
    name: "Systems Architecture",
    org: "Optimizely",
    label: "Architecture",
    description:
      "Two architectural decision records, written to be argued with: the Mixpanel to warehouse-native migration across 8 product teams, and a Snowflake versus BigQuery evaluation that traced 80-90% of spend to egress.",
    inside: "2 ADRs · egress cost model · migration plan",
    color: "#f43f5e",
    href: "https://systems-architecture.vercel.app",
    image: "/shots/systems-architecture.jpg",
    interactive: "egress" as const,
    magnitude: [
      { v: "2", l: "architectural decision records" },
      { v: "8", l: "product teams migrated" },
      { v: "80-90%", l: "of spend traced to egress" },
    ],
    detail:
      "Two decisions that kept being reopened because nobody had written down the cost model. Off Mixpanel across eight teams in six months, and the finding that 80-90% of warehouse spend was egress.",
  },
  {
    title: "Built the Real-Time Supply Health and Surge Pricing Engine",
    name: "When Demand Exceeds Supply",
    org: "Coto",
    label: "Marketplace Ops",
    description:
      "A real-time demand-supply engine for a two-sided marketplace. Health scores the queue, fires surge pricing and incentives when supply thins, and routes the escalations a human still has to answer.",
    inside: "Live barometer · queue simulator · surge bands",
    color: "#06b6d4",
    href: "https://when-demand-exceeds-supply.vercel.app",
    image: "/shots/when-demand-exceeds-supply.jpg",
    interactive: "supply" as const,
    magnitude: [
      { v: "3M+", l: "consultations behind it" },
      { v: "95%", l: "supply retention held" },
      { v: "30-90%", l: "revenue-share bands" },
    ],
    detail:
      "A two-sided marketplace fails on the supply side first, and it fails quietly. Health scoring that catches it live, and pay bands that answer it, funded by the surge fees that caused them.",
  },
  {
    title: "Ranked 500+ Marketplace Experts with TOPSIS Scoring",
    name: "Rank, Reward, Retain",
    org: "Coto",
    label: "Incentive Design",
    description:
      "TOPSIS scoring across five criteria to rank 500+ marketplace experts, wired to dynamic 30-90% revenue-share bands so that ranking actually pays. Expert quality rose 23%.",
    inside: "TOPSIS scorer · pay bands · creator analytics",
    color: "#8b5cf6",
    href: "https://rank-reward-retain.vercel.app",
    image: "/shots/rank-reward-retain.jpg",
    interactive: "topsis" as const,
    magnitude: [
      { v: "500+", l: "partners ranked" },
      { v: "5", l: "quality criteria" },
      { v: "+23%", l: "expert quality" },
    ],
    detail:
      "TOPSIS across five quality signals, not a weighted average, because an average lets a partner max one signal and coast. Then wired to money, so ranking actually pays. Expert quality rose 23%.",
  },
  {
    title: "Found the Dispatch Intensity Where Cost and Experience Balance",
    name: "Cost-Benefit Optimization",
    org: "foodpanda",
    label: "Applied Analytics",
    description:
      "Finds the order-assignment intensity where algorithmic dispatch balances delivery cost against customer experience, per city. Modelled in BigQuery, R and Tableau, with a live metric console to move the assumptions.",
    inside: "Metric console · per-city bands · equilibrium curve",
    color: "#f97316",
    href: "https://cost-benefit-optimization.vercel.app",
    image: "/shots/cost-benefit-optimization.jpg",
    interactive: "dispatch" as const,
    magnitude: [
      { v: "2M+", l: "orders a month" },
      { v: "64", l: "cities live" },
      { v: "€377K", l: "saved in a year" },
    ],
    detail:
      "Stacking cuts cost per order and raises lateness, and the whole argument was where to stop. The optimum sits wherever you price a late order, which turned an opinion into a pricing question.",
  },
  {
    title: "Built an Algorithm to Detect Directional Dependence",
    name: "Modeling Directional Dependence",
    org: "University of Minnesota",
    label: "Statistics Thesis",
    description:
      "A linear-model random algorithm for detecting bivariate directional dependence, the asymmetry a correlation coefficient is blind to by construction. My statistics senior thesis, written up as a working instrument.",
    inside: "Simulation study · WebGL surfaces · derivations in KaTeX",
    color: "#a855f7",
    href: "https://research-directional-dependence.vercel.app",
    image: "/shots/research-directional-dependence.jpg",
    interactive: "direction" as const,
    magnitude: [
      { v: "Senior", l: "statistics thesis" },
      { v: "Order", l: "statistics and concomitants" },
      { v: "Monte Carlo", l: "simulation study" },
    ],
    detail:
      "Correlation cannot tell you which variable is doing the moving: it is symmetric by construction. An algorithm using order statistics and concomitants to recover the asymmetry it discards.",
  },
  {
    title: "Modelled Directional Dependence Using Copulas",
    name: "Directional Dependence via Copulas",
    org: "University of Minnesota",
    label: "Howard Hughes Medical Institute",
    description:
      "Concomitants of order statistics on copulas, with Monte Carlo data designed specifically to keep causal bias out of the directional estimate. Funded by a Howard Hughes Medical Institute Grant.",
    inside: "Copula families · Monte Carlo design · order statistics",
    color: "#14b8a6",
    href: "https://research-copulas-directional-depend.vercel.app",
    image: "/shots/research-copulas.jpg",
    interactive: "copula" as const,
    magnitude: [
      { v: "+$14,000", l: "in research grants awarded" },
      { v: "Copula", l: "families compared" },
      { v: "Monte Carlo", l: "designed for bias" },
    ],
    detail:
      "A copula strips away the marginals and leaves dependence in its pure form. The Monte Carlo design keeps causal bias out of the estimate, so it measures dependence and not the way the sample was built.",
  },
  {
    title: "Modelled Cognitive Change Across Two NHANES Cycles",
    name: "Cognitive Change & Neuropsychology",
    org: "University of Minnesota",
    label: "UROP Research",
    description:
      "Survey-weighted logistic regression on CERAD, AFT and DSST testing across two NHANES cycles, modelling how cognitive change differs by gender and race on a nationally representative sample.",
    inside: "Survey weighting · 1,580 paired adults · two cycles",
    color: "#0ea5e9",
    href: "https://research-nhanes-cognitive.vercel.app",
    image: "/shots/research-nhanes-cognitive.jpg",
    interactive: "weights" as const,
    magnitude: [
      { v: "2", l: "NHANES cycles" },
      { v: "1,580", l: "paired adults" },
      { v: "3", l: "test batteries" },
    ],
    detail:
      "Which cognitive tests actually predict impairment, and does that differ by gender and race? Two NHANES cycles, survey-weighted, because an unweighted prevalence drifts with a design that oversamples on purpose.",
  },
];

/** Favicon marks, shared by the scorecard and the experience timeline. */
const LOGO = {
  jmi: "https://www.google.com/s2/favicons?domain=justmovein.com&sz=64",
  optimizely: "https://www.google.com/s2/favicons?domain=optimizely.com&sz=64",
  coto: "https://www.google.com/s2/favicons?domain=coto.world&sz=64",
  foodpanda: "https://www.google.com/s2/favicons?domain=foodpanda.com&sz=64",
};

// Case-study colours reused by the experience links so a role points at the
// published work it produced.
const CS = {
  workos: "#F5A524",
  pip: "#6366f1",
  def: "#10b981",
  arch: "#f43f5e",
  exp: "#f59e0b",
  supply: "#06b6d4",
  rank: "#8b5cf6",
  cost: "#f97316",
};

type Position = { title: string; period: string; impact?: string[]; links?: CaseLink[] };
/**
 * A `feature` turns a role into a full section of its own: a headline, a
 * sentence framing the work, one live panel, and the essay it produced. Roles
 * without one fall into the compact "Earlier" list instead.
 */
type Feature = {
  industry: string;
  status: string;
  headline: string;
  narrative: string;
  article?: { slug: string; title: string };
};
type Role = {
  org: string;
  logo?: string;
  location?: string;
  positions: Position[];
  feature?: Feature;
};

const roles: Role[] = [
  {
    org: "Just Move In",
    logo: LOGO.jmi,
    location: "United Kingdom",
    feature: {
      industry: "Home Services",
      status: "UK home-moving marketplace, B2B2C across three revenue channels",
      headline:
        "Built an AI Layer That Automates Feature Prototype & UAT, Reporting and Personalized A/B Testing with Claude WorkOS",
      narrative:
        "One person covering product, data, growth and platform, because WorkOS wires Claude into the systems each of those jobs actually runs on. Pick a session below and watch it run: the same harness, the same repo, the same output that lands in Slack and Linear.",
      article: {
        slug: "the-night-i-deleted-the-best-slide-in-the-deck",
        title: "The Night I Deleted the Best Slide in the Deck",
      },
    },
    positions: [
      {
        title: "Product Manager",
        period: "2026 - present",
        impact: [
          "Own the product end to end across **seven workstreams**: experimentation, analytics, reporting, automation and AI initiatives, UAT, feature building, and the new digital journey.",
          "Shipped the digital move journey against a **£1M ARR target**: broadband, energy and insurance deals fetched live by API, personalising **580K mover journeys** and 40K+ emails at a 52.9% open rate, A/B tested in PostHog.",
          "Turned Service Ops' 28-tab spreadsheet into an in-house ticketing product on HubSpot: 11 AI workflows classify 76K tickets/yr at 94% precision, **83% closing with no agent reply**; 9 agents absorb **2.8× the moves, averting £100-175K/yr in hires**.",
          "Founded WorkOS, an internal AI product across **6 job functions**: Claude wired to **15+ production systems** for user-acceptance testing, bug triage, data pipelines and **every function**'s reporting; SSO-gated dashboards **replaced enterprise BI**.",
          "Shipped the funnel product for phone sales, its largest channel: **1.4M call records** stitched to **880K moves**; the board attributes **~90% of phone revenue** through it, its daily digest coaching closers.",
        ],
        links: [{ label: "Claude-ing WorkOS", href: "https://claude-ing.vercel.app", color: CS.workos }],
      },
    ],
  },
  {
    org: "Optimizely",
    logo: LOGO.optimizely,
    location: "Hybrid · Dhaka",
    feature: {
      industry: "Enterprise SaaS",
      status: "Global digital experience platform, 100K+ B2B customers",
      headline:
        "Built the Product Intelligence Platform and Experimentation Framework 10+ SaaS Product Teams Ship On",
      narrative:
        "Ten product teams shipped against one governed metric per product and one gate: 5,000 impressions per arm, 80% power against a declared MDE. This is that gate, running in your browser.",
    },
    positions: [
      {
        title: "Analytics Engineer, Product",
        period: "2024 - 2026",
        impact: [
          "Built the churn and adoption product over **500K+ users**, erasing **$5M** of annual churn, briefed quarterly to the CEO and Insight Partners; self-serve NLP agents retired **85% of ad-hoc requests**.",
          "Delivered the **Product Intelligence Platform**, the system of record **10+ SaaS product teams** ship against: one governed L1 engagement and L2 feature-adoption metric per product over **1.2M+ daily events**, an 8-step gating process that ended metric drift, and **70+ stakeholders** self-serving instead of queueing for an analyst.",
          "Built the experimentation platform **10+ product teams** ship on: a frequentist and Bayesian framework with a 5K-impression gate at **80% power**, turning every launch into one ship-or-kill call. Lifted cross-sell qualification **58% to 74%**.",
          "Architected the move off Mixpanel onto a warehouse-native stack and ran the migration across **8 product teams in 6 months**, retiring a per-event SaaS bill and giving every team one governed definition to query.",
          "Built the warehouse it all runs on: 4 parallel ELT services, 3-layer dbt models above them and reverse ETL pushing scores into Salesforce and Gainsight; a **Snowflake-to-BigQuery** review traced **80-90% of spend** to egress and settled the platform decision.",
        ],
        links: [
          { label: "Product Intelligence", href: "https://product-intelligence-platform.vercel.app", color: CS.pip },
          { label: "Data Engineering", href: "https://data-engineering-foundation.vercel.app", color: CS.def },
          { label: "Systems Architecture", href: "https://systems-architecture.vercel.app", color: CS.arch },
          { label: "Running Meaningful Experiments", href: "https://experimentation-science.vercel.app", color: CS.exp },
        ],
      },
      {
        title: "Senior Analyst, Go-To-Market Analytics",
        period: "2023 - 2024",
        impact: [
          "Built the forecasting product behind C-suite KPI targets, delivering **12% YoY ARR growth**, beating the **DXP benchmark by 7%**, and cutting leadership decision time **30%** over a **$50M+ pipeline**.",
        ],
      },
      {
        title: "Senior Analyst, Pricing Strategy & Operations",
        period: "2023",
        impact: [
          "Re-priced a global DXP (**100K+ B2B customers**) from freemium to pay-per-use over **15+ A/B tests**: **40% gross margin** hit, **LTV +28%**, **$12M upsell** unlocked.",
        ],
      },
    ],
  },
  {
    org: "Coto",
    logo: LOGO.coto,
    location: "Remote · Part-time",
    feature: {
      industry: "Expert Marketplaces",
      status: "On-demand expert marketplace, Singapore",
      headline:
        "Built the Expert Ranking, Incentive Design and Demand-Supply Engine for an On-Demand Marketplace",
      narrative:
        "A two-sided marketplace fails on the supply side first, and it fails quietly. I built the health scoring that reads the failure early, and the pay bands that answer it.",
      article: {
        slug: "you-cannot-surge-price-a-therapist",
        title: "Why surge pricing does not work in every online marketplace",
      },
    },
    positions: [
      {
        title: "Analytics Consultant",
        period: "2024 - 2025",
        impact: [
          "Owned **four functions** for an on-demand expert marketplace: live marketplace operations, incentive design, analytics and reporting, and the data architecture beneath them.",
          "Shipped the partner-ranking product behind **3M+ consultations**, TOPSIS-scoring **500+ partners** (300+ verified) on 5 criteria for reward and retention, **raising expert quality 23%**.",
          "Designed the dynamic pay engine holding **95% supply retention**: **30-90% revenue-share bands** feeding the demand-supply engine for health scoring, surge pricing and escalation routing.",
        ],
        links: [
          { label: "Rank, Reward, Retain", href: "https://rank-reward-retain.vercel.app", color: CS.rank },
          { label: "Demand Exceeds Supply", href: "https://when-demand-exceeds-supply.vercel.app", color: CS.supply },
        ],
      },
    ],
  },
  {
    org: "foodpanda",
    logo: LOGO.foodpanda,
    location: "Dhaka, Bangladesh",
    feature: {
      industry: "On-Demand Marketplace",
      status: "Bangladesh's largest Q-commerce platform",
      headline:
        "Implemented the National Order Dispatch Policy, Surge Pricing and Return-Order Compliance Across 64 Cities",
      narrative:
        "Put more orders on one rider trip and cost per order falls while lateness climbs. The optimum is not a matter of taste, it is wherever you price a late order. So that is the second slider.",
    },
    positions: [
      {
        title: "Assistant Manager, Logistics & Analytics",
        period: "2021 - 2023",
        impact: [
          "Owned last-mile operations at Bangladesh's largest Q-commerce platform: **2M+ monthly orders** across 5 verticals and **50+ ops stakeholders**, ML fleet forecasting compounding **3% monthly KPI gains** at **75%+ on-time** delivery, and deployed the **national order dispatch policy** driving customer reorder-rate.",
          "Shipped the return-order product, a daily compliance dashboard flipping cancelled-order billing across **2,200+ vendors**: **€377K saved in a year**, food-quality complaints down **60.6%**.",
          "Launched surge pricing across **64 cities**, generating **€100K+/mo incremental revenue** and **+21% basket size**; automated tooling and compliance penalties raised **16K-rider fleet** performance **20%**.",
        ],
        links: [{ label: "Cost-Benefit Optimization", href: "https://cost-benefit-optimization.vercel.app", color: CS.cost }],
      },
    ],
  },
  {
    org: "InsideMaps",
    logo: "https://www.google.com/s2/favicons?domain=insidemaps.com&sz=64",
    location: "Mountain View, CA",
    positions: [
      {
        title: "Product Analyst",
        period: "2020 - 2021",
        impact: [
          "Shipped a MongoDB store and search product over **10K+ HVAC assets**, cutting costs **$150K/yr** and raising project completion **20%**; lifted efficacy **27%** across **120 offshore operators** on 3D tours.",
        ],
      },
    ],
  },
  {
    org: "Wells Fargo",
    logo: "https://www.google.com/s2/favicons?domain=wellsfargo.com&sz=64",
    location: "Minneapolis, MN",
    positions: [
      {
        title: "Accounting Operations Specialist",
        period: "2019 - 2020",
        impact: [
          "Processed **$600M+ in monthly transactions**, resolved carrier commission discrepancies and cut cash loss **2%** through weekly client leadership reviews.",
        ],
      },
    ],
  },
  {
    org: "Apple",
    logo: "https://www.google.com/s2/favicons?domain=apple.com&sz=64",
    location: "Minneapolis, MN",
    positions: [
      {
        title: "Product Specialist",
        period: "2019",
        impact: [
          "Genius Bar front line: advised and sold to customers, then set up, migrated and secured their devices.",
        ],
      },
    ],
  },
];

// University of Minnesota, Morris - the jobs held alongside the dual degree.
type CampusRole = { title: string; period: string; detail: string; links?: CaseLink[] };

const campusRoles: CampusRole[] = [
  {
    title: "Undergraduate Research Assistant",
    period: "2016 - 2019",
    detail:
      "Four projects across probability, econometrics and biostatistics, funded by a Howard Hughes Medical Institute Grant and UROP twice: directional dependence through order statistics and copulas, conditional cash transfers and maternal health in Bangladesh, and survey-weighted models of NHANES cognitive testing.",
  },
  {
    title: "Research Analyst",
    period: "2018 - 2019",
    detail:
      "Primary socio-economic data on 100+ Native American artists for a non-profit, grant proposals and a 50-town housing database for the Minnesota Chamber of Commerce, and clinical survey design with survival analysis for an anti-trafficking organisation.",
  },
  {
    title: "Residence Hall Director",
    period: "2018 - 2019",
    detail: "Ran hall operations and supervised the resident advisor staff, owning policy and student development programming.",
  },
  {
    title: "Teaching Assistant, Economics",
    period: "2016 - 2017",
    detail: "Principles of Microeconomics, Microeconomic Theory and Public Economics.",
  },
];

// Every sector worked in, strongest first. No scale figures here: the numbers
// live in the hero strip and in the role bullets, and repeating them turned a
// list of industries into a wall of digits.
const industries = [
  { label: "Enterprise SaaS", color: "#6366f1" },
  { label: "On-Demand Marketplace", color: "#f97316" },
  { label: "Home Services", color: "#2dd4bf" },
  { label: "Expert Marketplaces", color: "#8b5cf6" },
  { label: "Financial Services", color: "#34d399" },
  { label: "Consumer Retail", color: "#f43f5e" },
];

/**
 * The scorecard, organised by company rather than by figure. A bare number with
 * a favicon next to it answers none of the questions a reader actually has:
 * what does it count, what did I do, who was it for, what industry, and how big
 * a name is that company in it. Each tile answers all five.
 */
// Reverse-chronological, matching the order the job sections run in below.
const heroCompanies = [
  {
    org: "Just Move In",
    logo: LOGO.jmi,
    industry: "Home Services",
    status: "UK home-moving marketplace, B2B2C across three revenue channels",
    value: "16K",
    unit: "moves / month",
    did: "Own **seven workstreams** end to end: experimentation, analytics, reporting, automation, AI, UAT and the new digital journey",
  },
  {
    org: "Optimizely",
    logo: LOGO.optimizely,
    industry: "Enterprise SaaS",
    status: "Global digital experience platform, 100K+ B2B customers",
    value: "500K+",
    unit: "users",
    did: "Built the **Product Intelligence Platform** and the experimentation framework **10+ product teams** ship on",
  },
  {
    org: "Coto",
    logo: LOGO.coto,
    industry: "Expert Marketplaces",
    status: "On-demand expert marketplace, Singapore",
    value: "3M+",
    unit: "consultations",
    did: "Owned **four functions**: live operations, incentive design, analytics and data architecture",
  },
  {
    org: "foodpanda",
    logo: LOGO.foodpanda,
    industry: "On-Demand Marketplace",
    status: "Bangladesh's largest Q-commerce platform",
    value: "2M+",
    unit: "orders / month",
    did: "Owned last-mile operations end to end, **5 verticals** and **50+ stakeholders**",
  },
];

const honors = [
  "Winner, Undergraduate Research Poster · Twin Cities ASA Fall Research Conference",
  "Scholar of the College Award",
  "Faculty Assistantship",
  "UROP recipient ×2",
  "Howard Hughes Medical Institute Grant",
];

// Skills grouped by domain, each group shares a shining colour. Every label
// resolves to a logo or glyph in ./skill-marks.
const skillGroups = [
  {
    label: "AI / ML",
    color: "#a78bfa", // violet
    items: ["Agentic AI", "Claude Code", "MCP", "LLMs", "Machine Learning", "Predictive Modeling", "Prompt Engineering"],
  },
  {
    label: "Statistics & Data Science",
    color: "#22d3ee", // cyan
    items: ["Python", "SQL", "R", "Statistical Modeling", "Causal Inference", "A/B Testing", "Forecasting", "Monte Carlo Simulation"],
  },
  {
    label: "Data Engineering",
    color: "#34d399", // emerald
    items: ["Snowflake", "dbt", "Segment", "Fivetran", "Airbyte", "BigQuery", "PostgreSQL", "MongoDB", "Data Modeling"],
  },
  {
    label: "Product & Analytics",
    color: "#fbbf24", // amber
    items: ["Product Analytics & Operations", "Experimentation", "Marketplace Operations", "Business Intelligence", "Mixpanel", "Power BI", "Looker", "Tableau", "PostHog", "HubSpot"],
  },
];

// Marquee is derived dynamically from the skill groups so it always
// reflects the current skills, coloured to match each group's palette.
const marqueeItems = skillGroups.flatMap((g) =>
  g.items.map((label) => ({ label, color: g.color }))
);

// Hosted on-site at /writing/<slug>; single source of truth in ./writing/articles.ts
const articles = hostedArticles.map((a) => ({
  title: a.title,
  subtitle: a.subtitle,
  topic: a.topic,
  date: a.date,
  readTime: a.readTime,
  excerpt: a.excerpt,
  href: `/writing/${a.slug}`,
  color: a.color,
  image: a.thumb ?? a.cover,
  imageAlt: a.coverAlt,
  links: a.links,
}));


type Project = (typeof projects)[number];
type ArticleCard = (typeof articles)[number];

/**
 * One shipped implementation, at full width: the running site as a backdrop, the
 * magnitude of it, an explanation long enough to be worth reading, and its own
 * interactive visual. The whole header links out to the deployed thing.
 */
function ImplementationBlock({ pr }: { pr: Project }) {
  const Visual = pr.interactive ? VISUALS[pr.interactive] : undefined;
  const bare = pr.interactive ? BARE.has(pr.interactive) : false;

  return (
    <article className="rounded-2xl border border-white/[0.09] bg-[#0b0b11] overflow-hidden">
      {/* Header: the copy on the left, the running site as a real thumbnail on
          the right. It used to sit behind the text as a washed background, where
          the site's own headline ghosted through the paragraph. */}
      <a href={pr.href} target="_blank" rel="noopener noreferrer"
        className="impl-head group grid lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-8 p-5 sm:p-7">
        <span className="block min-w-0">
          <span className="flex items-center gap-2.5 mb-3 flex-wrap">
            <span
              className="text-[9.5px] uppercase tracking-[0.13em] font-bold px-2.5 py-[4px] rounded-full border"
              style={{ color: pr.color, borderColor: pr.color + "55", background: pr.color + "1a" }}
            >
              {pr.label}
            </span>
            <span className="text-[11px] text-white/45">{pr.name}</span>
          </span>

          <span className="block text-[1.3rem] sm:text-[1.55rem] font-bold tracking-tight text-white leading-[1.25] mb-3.5">
            {pr.title}
          </span>
          <span className="block text-[13px] text-white/70 leading-relaxed mb-5">
            {pr.detail}
          </span>

          {/* Magnitude */}
          <span className="flex flex-wrap gap-x-8 gap-y-3 mb-5">
            {pr.magnitude.map((m) => (
              <span key={m.l} className="block">
                <span
                  className="block text-[1.25rem] font-bold tracking-tight leading-none tabular-nums mb-1"
                  style={{ color: pr.color }}
                >
                  {m.v}
                </span>
                <span className="block text-[10px] uppercase tracking-[0.1em] text-white/40">
                  {m.l}
                </span>
              </span>
            ))}
          </span>

          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/70 group-hover:text-white transition-colors">
            Open {pr.name}
            <ArrowUpRight />
          </span>
        </span>

        {/* The deployed site, framed */}
        <span className="impl-thumb relative block self-start rounded-xl overflow-hidden border"
          style={{ borderColor: pr.color + "33" }}>
          <Image
            src={pr.image}
            alt={`${pr.name}, as deployed`}
            width={1600}
            height={900}
            sizes="(max-width: 1024px) 100vw, 440px"
            className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <span className="absolute inset-0 pointer-events-none"
            style={{ boxShadow: `inset 0 0 40px -12px ${pr.color}66` }} />
        </span>
      </a>

      {/* Its own interactive visual */}
      {Visual && (
        <div className="border-t border-white/[0.07]">
          <div className="px-5 sm:px-7 pt-5 pb-1">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">
              Run it here
            </p>
          </div>
          <div className={bare ? "px-2 pb-2" : "px-5 sm:px-7 pb-6 pt-3"}>
            {bare ? (
              <div className="rounded-xl border border-white/[0.07] overflow-hidden">
                <Visual />
              </div>
            ) : (
              <Visual />
            )}
          </div>
        </div>
      )}

      <div className="px-5 sm:px-7 py-3.5 border-t border-white/[0.07] bg-white/[0.015]">
        <p className="text-[10.5px] text-white/40">{pr.inside}</p>
      </div>
    </article>
  );
}

/**
 * An article preview. `featured` lays the cover beside the text instead of
 * above it, which gives the lead piece the room its cover art deserves and
 * stops a five-item grid from orphaning a card on its own row.
 */
function ArticlePreview({ a, featured = false }: { a: ArticleCard; featured?: boolean }) {
  return (
    <div
      className={`proj-card group flex rounded-xl border border-white/[0.08] bg-[#0b0b11] overflow-hidden ${
        featured ? "flex-col md:flex-row" : "flex-col"
      }`}
    >
      <Link
        href={a.href}
        className={`flex ${featured ? "flex-col md:flex-row md:items-stretch w-full" : "flex-col flex-1"}`}
      >
        <span
          className={`relative block overflow-hidden ${
            featured
              ? "md:w-[52%] aspect-[16/9] md:aspect-auto md:min-h-[300px] border-b md:border-b-0 md:border-r"
              : "aspect-[16/9] border-b"
          } border-white/[0.06]`}
        >
          <Image
            src={a.image}
            alt={a.imageAlt}
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 540px" : "(max-width: 640px) 100vw, 500px"}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
          <span
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${a.color}88, transparent)` }}
          />
        </span>
        <span className={`flex flex-col flex-1 ${featured ? "p-6 justify-center" : "p-4"}`}>
          <span className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className="text-[9px] uppercase tracking-[0.12em] font-semibold px-2 py-[3px] rounded-full border"
              style={{ color: a.color, borderColor: a.color + "40", background: a.color + "12" }}
            >
              {a.topic}
            </span>
            <span className="text-[10px] text-white/35">{a.date}</span>
            <span className="text-white/20 text-[10px]">·</span>
            <span className="text-[10px] text-white/35">{a.readTime}</span>
            <span className="ml-auto text-white/30 group-hover:text-white/80 transition-colors">
              <ArrowUpRight />
            </span>
          </span>
          <span
            className={`block font-semibold text-white leading-snug mb-2 ${
              featured ? "text-[1.35rem] tracking-tight" : "text-[15px]"
            }`}
          >
            {a.title}
          </span>
          <span
            className={`block text-white/60 leading-relaxed ${featured ? "text-[13px]" : "text-[12px]"}`}
          >
            {featured ? a.excerpt : a.subtitle}
          </span>
          {featured && a.links && a.links.length > 0 && (
            <span className="flex flex-wrap gap-x-4 gap-y-1 mt-4">
              {a.links.map((l) => (
                <span key={l.href} className="text-[11px] text-white/45">
                  {l.label}
                </span>
              ))}
            </span>
          )}
        </span>
      </Link>
      {!featured && a.links && a.links.length > 0 && (
        <span className="flex flex-wrap gap-x-4 gap-y-1 px-4 pb-4 pt-1 mt-auto">
          {a.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10.5px] text-white/45 hover:text-white transition-colors"
            >
              {l.label}
              <ArrowUpRight />
            </a>
          ))}
        </span>
      )}
    </div>
  );
}

/** Each implementation's own interactive visual, keyed off the project. */
const VISUALS: Record<string, React.ComponentType> = {
  workos: WorkOsPanel,
  stack: StackPanel,
  console: ExperimentConsole,
  lineage: DbtPanel,
  egress: ArchPanel,
  supply: SupplyPanel,
  topsis: TopsisPanel,
  dispatch: DispatchPanel,
  copula: CopulaSurface,
  direction: DirectionalDependence,
  weights: SurveyWeights,
};

/** The three research bodies ship without the shared window chrome. */
const BARE = new Set(["copula", "direction", "weights"]);

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/**
 * One job, as a section. The role's own panel is gone: every interactive visual
 * now belongs to the implementation that produced it, so the section reads
 * experience, then what shipped, then what I wrote about it.
 */
function JobSection({ role, n }: { role: Role; n: string }) {
  const f = role.feature!;
  const built = projects.filter((pr) => pr.org === role.org);

  return (
    <section id={slugify(role.org)} className="scroll-mt-20 py-24 px-6 border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        {/* Who, what industry, and how big a name they are in it */}
        <div className="flex flex-wrap items-center gap-3 mb-2.5">
          <span className="text-[11px] font-mono text-white/40 mr-1">{n}</span>
          {role.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={role.logo} alt="" width={26} height={26} className="rounded-md object-contain flex-shrink-0" />
          )}
          <span className="text-[1.2rem] font-bold tracking-tight text-white">{role.org}</span>
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.11em] text-indigo-100 border border-indigo-300/45 bg-indigo-400/[0.16] rounded-full px-2.5 py-[4px]">
            {f.industry}
          </span>
          {role.location && <span className="text-[11.5px] text-white/50">{role.location}</span>}
        </div>

        <h2 className="text-[1.3rem] sm:text-[1.6rem] font-bold tracking-tight text-white leading-[1.25] mb-4 max-w-4xl">
          {f.headline}
        </h2>
        <p className="text-sm text-white/60 max-w-3xl mb-12 leading-relaxed">{f.narrative}</p>

        {/* The role itself */}
        <div className={`mb-16 ${role.positions.length > 1 ? "relative pl-5" : ""}`}>
          {role.positions.length > 1 && (
            <div
              className="absolute left-1 top-2 bottom-2 w-px border-l border-dashed"
              style={{ borderColor: "#a5b4fc", opacity: 0.6 }}
            />
          )}
          <div className="space-y-7">
            {role.positions.map((pos) => (
              <div key={pos.title} className="relative">
                {role.positions.length > 1 && (
                  <span
                    className="glow-dot absolute -left-[18px] top-[6px] w-2.5 h-2.5 rounded-full ring-2 ring-[#0a0a0f]"
                    style={{
                      background: "linear-gradient(135deg, #c7d2fe, #818cf8)",
                      boxShadow: "0 0 10px #818cf8cc, 0 0 4px #c7d2fe",
                    }}
                  />
                )}
                <div className="flex flex-wrap items-baseline gap-x-3 mb-2.5">
                  <p className="exp-title text-[15px] font-semibold leading-snug">{pos.title}</p>
                  <p className="text-[11.5px] text-white/45">{pos.period}</p>
                </div>
                {pos.impact && (
                  <ul className="space-y-2.5 max-w-3xl">
                    {pos.impact.map((line) => (
                      <li key={line} className="flex gap-2.5 text-[12.5px] leading-relaxed text-white/65">
                        <span
                          className="mt-[8px] w-[3px] h-[3px] rounded-full flex-shrink-0"
                          style={{ background: "#a5b4fc", boxShadow: "0 0 6px #818cf8" }}
                        />
                        <span><Impact text={line} /></span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* What shipped, each with its own visual */}
        {built.length > 0 && (
          <>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/35 mb-5">
              What I shipped{built.length > 1 && ` · ${built.length}`}
            </p>
            <div className="space-y-6">
              {built.map((pr) => (
                <ImplementationBlock key={pr.href} pr={pr} />
              ))}
            </div>
          </>
        )}

        {/* And what I wrote about it */}
        {f.article && (
          <div className="mt-14">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/35 mb-4">
              What I wrote about it
            </p>
            <Link
              href={`/writing/${f.article.slug}`}
              className="case-chip group flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3.5 max-w-2xl"
              style={{ "--c": "#a5b4fc" } as React.CSSProperties}
            >
              <span className="text-[13px] font-medium text-white/85 leading-snug">
                {f.article.title}
              </span>
              <span className="text-white/40 group-hover:text-white/80 transition-colors flex-shrink-0">
                <ArrowUpRight />
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <SectionRail />

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
          <a
            href="/resume"
            className="text-[13px] font-medium text-white/55 hover:text-white transition-colors"
          >
            Résumé
          </a>
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
      <section className="pt-32 pb-14 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-10 md:gap-14">

            {/* Photo */}
            <div className="animate-fade-up flex-shrink-0 pt-3">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden ring-1 ring-white/10">
                <Image
                  src="/profile.png"
                  alt="Wahid Tawsif Ratul"
                  fill
                  sizes="(max-width: 640px) 176px, 208px"
                  className="object-cover"
                  priority
                />
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
              {/* The bio belongs here, not 3,000px down the page */}
              <div className="animate-fade-up-delay-2 flex items-start gap-6 mb-6">
                <div className="w-8 h-px bg-white/30 mt-[10px] flex-shrink-0" />
                <div className="max-w-xl">
                  <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-3.5">
                    Data Scientist turned Product Manager. $17M+ in measured revenue gains in
                    roles across Systems Product Management, B2B2C SaaS Pricing and Analytics,
                    and On-Demand Marketplace Operations.
                  </p>
                  <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                    Now deep into Agentic AI: building AI-native workflows automating new feature
                    prototype and releases, customer campaign and comms, UAT, Reporting and
                    Systems Integration.
                  </p>
                </div>
              </div>

              {/* Industries, up here where breadth reads immediately */}
              <div className="animate-fade-up-delay-2 mb-8">
                <p className="text-[9px] uppercase tracking-[0.18em] mb-2 font-semibold text-white/40">
                  Worked in
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {industries.map(({ label, color }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 text-[10.5px] px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03]"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: color, boxShadow: `0 0 7px ${color}cc` }}
                      />
                      <span className="text-white/65">{label}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="animate-fade-up-delay-2 flex flex-wrap items-center gap-3">
                <a href="mailto:wahidtratul@gmail.com" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#0a0a0f] text-sm font-semibold hover:bg-white/90 transition-colors">
                  <IconEmail />
                  Email me
                </a>
                {/* Only the two actions worth taking here. Résumé, writing and
                    every social link already live in the nav, and repeating
                    them put a third envelope on one screen. */}
                <a href="#just-move-in" className="px-5 py-2.5 rounded-full border border-white/15 text-sm text-white/80 hover:border-white/35 hover:text-white transition-all">
                  See the work
                </a>
              </div>
            </div>
          </div>

          {/* ── Scale, above the fold ── */}
          <div className="animate-fade-up-delay-2 mt-14">
            {/* gap-px over a lit background renders the dividers, so the grid
                stays correct at any column count without per-cell border rules */}
            <div className="grid sm:grid-cols-2 gap-px rounded-xl border border-white/[0.08] bg-white/[0.07] overflow-hidden">
              {heroCompanies.map((c) => (
                <div key={c.org} className="stat-tile relative px-5 py-[19px] bg-[#0b0b11]">
                  {/* The number leads, with the company and its industry beside it */}
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                    <p className="flex items-baseline gap-1.5">
                      <span className="stat-figure text-[2rem] font-bold tracking-tight leading-none tabular-nums">
                        {c.value}
                      </span>
                      <span className="text-[11.5px] font-medium text-white/50">{c.unit}</span>
                    </p>
                    <span className="flex items-center gap-2 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.logo}
                        alt=""
                        width={17}
                        height={17}
                        className="rounded-sm object-contain flex-shrink-0"
                      />
                      <span className="text-[12.5px] font-bold text-white">{c.org}</span>
                      <span className="text-[9px] uppercase tracking-[0.1em] text-indigo-200/65 border border-indigo-300/20 bg-indigo-400/[0.07] rounded-full px-2 py-[2px] whitespace-nowrap">
                        {c.industry}
                      </span>
                    </span>
                  </div>

                  {/* The boast, then who they are */}
                  <p className="text-[12.5px] text-white/80 leading-relaxed font-medium">
                    <Impact text={c.did} />
                  </p>
                  <p className="text-[10.5px] text-white/35 leading-snug mt-2 pt-2 border-t border-white/[0.05]">
                    {c.status}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3.5 text-[11.5px] text-white/40">
              Every figure is sourced in a role below, and every project links to the built thing behind it.
            </p>
          </div>
        </div>
      </section>

      {/* ── The stack, in full. This replaced a marquee that scrolled the
             same 34 labels past the reader without letting them read any. ── */}
      <section id="expertise" className="scroll-mt-20 py-14 px-6 border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 mb-6">
            Areas of Expertise
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
                        className="skill-pill inline-flex items-center gap-1.5 text-[11px] pl-2 pr-3 py-1.5 rounded-full border font-medium"
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
                        <SkillMark name={s} color={c} />
                        {s}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* ── Working output: one snapshot, one live feed ── */}
      <section id="output" className="scroll-mt-20 py-20 px-6 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline gap-4 mb-4">
            <span className="text-[11px] font-mono text-white/40">00</span>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">Output</p>
          </div>
          <h2 className="text-[1.3rem] sm:text-[1.6rem] font-bold tracking-tight text-white leading-[1.25] mb-3.5">
            What the last month of building actually looked like.
          </h2>
          <p className="text-sm text-white/60 max-w-2xl mb-8 leading-relaxed">
            Not a claim about how I work. The agent transcripts and the push history, counted.
            One is a snapshot because there is no API for it; the other is read live on load.
          </p>
          <OutputPanel />
        </div>
      </section>

      {/* ── One section per job, each with a live panel of the actual work ── */}
      {roles
        .filter((r) => r.feature)
        .map((role, i) => (
          <JobSection key={role.org} role={role} n={String(i + 1).padStart(2, "0")} />
        ))}

      {/* ── Research, on its own, with the real sites as thumbnails ── */}
      <section id="research" className="scroll-mt-20 py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <span className="text-[11px] font-mono text-white/40 mr-1.5">05</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://www.google.com/s2/favicons?domain=umn.edu&sz=64"
              alt=""
              width={26}
              height={26}
              className="rounded-md object-contain flex-shrink-0"
            />
            <span className="text-[1.2rem] font-bold tracking-tight text-white">University of Minnesota</span>
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.11em] text-indigo-100 border border-indigo-300/45 bg-indigo-400/[0.16] rounded-full px-2.5 py-[4px]">
              Research
            </span>
            <span className="text-[11.5px] text-white/50">Minnesota, USA</span>
          </div>

          <h2 className="text-[1.6rem] sm:text-[2rem] font-bold tracking-tight text-white leading-tight mb-3.5">
            Undergraduate Research Assistant expanding in areas of Econometrics,
            Causal Inference and Biostatistics.
          </h2>
          <p className="text-sm text-white/60 max-w-2xl mb-10 leading-relaxed">
            Before the pipelines and the launches there was the lab and the proof. Each of these
            is written up as a working instrument, with the derivations and the simulations you
            can read rather than take on trust.
          </p>

          <div className="space-y-6">
            {projects
              .filter((pr) => pr.org === "University of Minnesota")
              .map((pr) => (
                <ImplementationBlock key={pr.href} pr={pr} />
              ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="scroll-mt-20 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline gap-4 mb-5">
            <span className="text-[11px] font-mono text-white/40">06</span>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">Earlier &amp; foundations</p>
          </div>
          <h2 className="text-[1.6rem] sm:text-[2rem] font-bold tracking-tight text-white leading-tight mb-10">
            Where the toolkit came from.
          </h2>
          <div className="grid md:grid-cols-2 md:grid-rows-[auto_1fr] gap-x-16 gap-y-14 items-start">

            {/* Left, row 1: bio + industries + skills */}
            <div className="md:col-start-1 md:row-start-1">
            </div>

            {/* Right, spanning both rows: experience */}
            <div className="md:col-start-2 md:row-start-1 md:row-span-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-7">Earlier roles</p>
              <div className="space-y-8">
                {roles.filter((r) => !r.feature).map((company) => (
                  <div key={company.org} className="group/exp border-l border-white/10 pl-5">
                    <div className="flex items-center gap-2.5 mb-1">
                      {company.logo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={company.logo} alt={company.org} width={20} height={20} className="logo-glow rounded-sm object-contain flex-shrink-0" />
                      )}
                      <p className="exp-name text-sm font-bold">{company.org}</p>
                      {company.location && (
                        <span className="text-[10px] text-white/35 tracking-wide">{company.location}</span>
                      )}
                    </div>
                    <div className={`space-y-4 mt-3 ${company.positions.length > 1 ? "relative pl-5" : ""}`}>
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
                          {pos.impact && <ImpactList lines={pos.impact} />}
                          {pos.links && <CaseLinks links={pos.links} />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Left, row 2: education and the jobs held alongside the degree */}
            <div className="md:col-start-1 md:row-start-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-7">Education</p>

              <div className="border-l border-white/10 pl-5">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://www.google.com/s2/favicons?domain=umn.edu&sz=64" alt="University of Minnesota" width={20} height={20} className="logo-glow rounded-sm object-contain flex-shrink-0" />
                  <p className="exp-name text-sm font-bold">University of Minnesota</p>
                </div>
                <p className="text-xs text-white/45 mt-1.5">B.S. dual major · Minnesota, USA · 2015 - 2019</p>
                <div className="relative mt-3.5 pl-4">
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

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {honors.map((h) => (
                    <span
                      key={h}
                      className="text-[10px] leading-relaxed px-2 py-[3px] rounded-full border border-amber-300/25 bg-amber-400/[0.07] text-amber-100/70"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40 mt-9 mb-4">
                Roles held alongside the degree
              </p>
              <div className="relative pl-5 border-l border-white/10">
                <div className="space-y-4">
                  {campusRoles.map((role) => (
                    <div key={role.title} className="relative">
                      <span
                        className="glow-dot absolute -left-[23px] top-[6px] w-1.5 h-1.5 rounded-full ring-2 ring-[#0a0a0f]"
                        style={{ background: "#c7d2fe", boxShadow: "0 0 8px #818cf8cc" }}
                      />
                      <div className="flex flex-wrap items-baseline gap-x-2.5">
                        <p className="text-[13px] font-medium text-white/85">{role.title}</p>
                        <p className="text-[11px] text-white/40">{role.period}</p>
                      </div>
                      <p className="text-[11.5px] leading-relaxed text-white/50 mt-1">{role.detail}</p>
                      {role.links && <CaseLinks links={role.links} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Writing ── */}
      <section id="writing" className="scroll-mt-20 relative py-24 px-6 border-t border-white/[0.06] overflow-hidden">
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-baseline justify-between mb-5">
            <div className="flex items-baseline gap-4">
              <span className="text-[11px] font-mono text-white/40">07</span>
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">Articles</p>
            </div>
            <a href="https://medium.com/@wahidtratul" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-white/55 hover:text-white transition-colors">
              All on Medium <ArrowUpRight />
            </a>
          </div>
          <h2 className="text-[1.6rem] sm:text-[2rem] font-bold tracking-tight text-white leading-tight mb-10">
            Articles on AI, economics, and how data gets used.
          </h2>
          {/* The lead article gets the wide treatment, the rest a clean 2x2 */}
          <div className="mb-4">
            <ArticlePreview a={articles[0]} featured />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {articles.slice(1).map((a) => (
              <ArticlePreview key={a.title} a={a} />
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
