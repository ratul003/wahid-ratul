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
