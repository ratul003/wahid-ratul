// Single source of truth for hosted articles.
// Body HTML lives in app/writing/content/<slug>.html and is read at build time.

export type ArticleLink = { label: string; href: string };

export type Article = {
  slug: string;
  title: string;
  subtitle: string;
  topic: string;
  date: string;
  readTime: string;
  excerpt: string;
  color: string;
  cover: string;
  coverAlt: string;
  /** Card image on /writing. Falls back to `cover` when absent. */
  thumb?: string;
  /** True when the body already opens with the cover, so the hero is skipped. */
  coverInBody?: boolean;
  links?: ArticleLink[];
};

export const articles: Article[] = [
  {
    slug: "the-frailty-in-the-economics-of-ai",
    title: "The Frailty in the Economics of AI",
    subtitle:
      "The trip got dearer and the traveller got poorer. I am part of the reason, and I found out in an empty bar in Penang.",
    topic: "AI · Economics · Statistics",
    date: "November 2026",
    readTime: "6 min read",
    excerpt:
      "The neon sign said FULLY BOOKED and every chair was empty. A record fuel price, 206,000 tech jobs cut in a year of $700 billion spent on AI, and the eight jobs I do from one chair. Every job a machine takes is a chair left empty somewhere else.",
    color: "#f87171",
    cover: "/writing/the-frailty-in-the-economics-of-ai/frailty-cover-fully-booked.jpg",
    thumb: "/writing/the-frailty-in-the-economics-of-ai/thumb.jpg",
    coverAlt:
      "An empty bar in Penang lit in red, every table unoccupied, with a neon sign by the stage reading FULLY BOOKED",
    coverInBody: true,
  },
  {
    slug: "the-power-of-mcp",
    title: "MCP Turned My Product Manager role into a SWE, Data Engineer, Product Designer, and many more",
    subtitle:
      "The Model Context Protocol wired my eighteen work systems together, and I stopped being the copy and paste between them. Now I am also the full stack software engineer, the data scientist, the designer, the quality assurance analyst, the marketer and the project manager.",
    topic: "AI · Product · Careers",
    date: "November 2026",
    readTime: "10 min read",
    excerpt:
      "An AI tool once answered every question I asked with the same fifteen characters. A year on, eighteen systems are wired into one protocol, the cable job is gone, and I wear eight hats. Where the Model Context Protocol came from, what it changed in my week, and where it bites.",
    color: "#fb923c",
    cover: "/writing/the-power-of-mcp/mcp-cover.png",
    thumb: "/writing/the-power-of-mcp/thumb.png",
    coverAlt:
      "Eighteen work systems, each with its logo, connected to a single hub labelled MCP",
    coverInBody: true,
  },
  {
    slug: "you-cannot-surge-price-a-therapist",
    title: "Why surge pricing does not work in every online marketplace",
    subtitle:
      "I ran surge pricing across sixty-four cities at foodpanda and watched it work. Then I took the same lever to a marketplace of licensed experts, and it did almost nothing.",
    topic: "Marketplaces · Operations · Pricing",
    date: "August 2026",
    readTime: "10 min read",
    excerpt:
      "11:08pm, 47 people waiting, three experts online and twelve asleep with no idea. At foodpanda I would have raised the incentive and watched riders appear. You cannot do that to a therapist. What I got wrong first, what turned out to be elastic instead, and the instruments to drive it yourself.",
    color: "#22d3ee",
    cover: "/writing/you-cannot-surge-price-a-therapist/cover.png",
    thumb: "/writing/you-cannot-surge-price-a-therapist/thumb.png",
    coverAlt:
      "Two supply-response curves against incentive per session: interchangeable supply climbing past 90 percent, credentialed supply flattening under a capacity ceiling at 60 percent, with the measured 8, 38 and 55 percent tiers ringed",
    links: [
      { label: "Watch the 2-minute film", href: "https://when-demand-exceeds-supply.vercel.app/#film" },
      { label: "Explore the live system", href: "https://when-demand-exceeds-supply.vercel.app" },
    ],
  },
  {
    slug: "ten-years-of-statistical-computing",
    title: "A Decade of Statistical Computing",
    subtitle:
      "Reflecting on a decade of highs and lows, the technological advancements behind it, and how it rewarded me professionally, spiritually, and financially.",
    topic: "Statistics · Career · AI",
    date: "August 2026",
    readTime: "15 min read",
    excerpt:
      "Fall 2016, a four-credit probability class, and a B plus. Ten years later, the machines can produce any number you ask for and still cannot doubt one. Nine jobs to pay for a degree, a visa that closed, a currency coming apart, and the one instinct that never depreciated.",
    color: "#f43f5e",
    cover: "/writing/ten-years-of-statistical-computing/cover.png",
    coverAlt:
      "Four independent samples of 1,400 draws from one distribution, plotted as histograms, with the density they all came from laid over the top",
    thumb: "/writing/ten-years-of-statistical-computing/thumb.png",
    coverInBody: true,
  },
  {
    slug: "the-invisible-hand",
    title: "The Invisible Hand: When AI meets Market Forces",
    subtitle:
      "The market quietly stops trading work between people and starts handing it to machines, one task at a time.",
    topic: "AI · Economics · Behavioral Economics",
    date: "July 2026",
    readTime: "11 min read",
    excerpt:
      "Tesla is rationing AI, Uber torched its budget by April, and everyone calls it collapse. It's the same mistake I made stacking food orders in Dhaka: optimize the cheap unit, ignore the expensive one. A unit-economics read on the 2026 AI cost panic, from Jevons to Baumol.",
    color: "#818cf8",
    cover: "/writing/the-invisible-hand/cover.png",
    coverAlt:
      "Illustration: a faint hand descending onto a divided pie while human hands reach up for the pieces",
  },
  {
    slug: "the-night-i-deleted-the-best-slide-in-the-deck",
    title: "The Night I Deleted the Best Slide in the Deck",
    subtitle:
      "It said 12%. The real number was 4%. This is the guardrail I built so I would never be that close again.",
    topic: "AI · Product · Data",
    date: "July 2026",
    readTime: "9 min read",
    excerpt:
      "Almost midnight, nine hours before a leadership review, I nearly walked a wrong number into the room. The story of the dependency tax, a one-person Claude Code operating layer, and the one check that separates breadth from trust.",
    color: "#F5A524",
    cover: "/writing/the-night-i-deleted-the-best-slide-in-the-deck/cover.png",
    coverAlt: "Claude-ing, an abstract illustration of the operating setup this story is about",
    links: [{ label: "Try the live demo", href: "https://claude-ing.vercel.app" }],
  },
  {
    slug: "the-game-that-outlived-empires",
    title: "The Game That Outlived Empires",
    subtitle: "FIFA corruption, late-stage capitalism, why Germany, and who wins in 2026.",
    topic: "Football · Politics · Economics",
    date: "June 2026",
    readTime: "19 min read",
    excerpt:
      "A barefoot boy with a rag ball in 1950 Rio, and everything being done to the game since. FIFA's grip on global football, Germany's statistical case for 2026, and what Monte Carlo says when politics meets sport.",
    color: "#34d399",
    cover: "/maradona.png",
    coverAlt: "Diego Maradona lifting the 1986 World Cup trophy",
    links: [
      { label: "Run the World Cup simulator", href: "https://fifa-wc2026-simulator.vercel.app/#cr" },
      {
        label: "Read on Medium",
        href: "https://medium.com/@wahidtratul/the-game-that-outlived-empires-7f527356d418",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
