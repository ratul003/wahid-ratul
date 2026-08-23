import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle } from "../articles";
import {
  QueueSim,
  Barometer,
  SupplyResponse,
  RecoveryTimeline,
} from "../widgets/when-demand";

/**
 * Marker name in an article body -> the live component it stands for.
 *
 * Built here rather than exported from the widgets module: a "use client" file
 * can only hand a server component individual client references, so exporting
 * the map itself yields a proxy and every lookup comes back undefined.
 */
const WIDGETS: Record<string, React.ComponentType> = {
  queue: QueueSim,
  barometer: Barometer,
  response: SupplyResponse,
  recovery: RecoveryTimeline,
};

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: `${a.title} · Wahid Tawsif Ratul`,
    description: a.subtitle,
    openGraph: {
      title: a.title,
      description: a.subtitle,
      type: "article",
      url: `https://wahid-ratul.vercel.app/writing/${a.slug}`,
      images: [{ url: a.cover }],
    },
    twitter: { card: "summary_large_image", title: a.title, description: a.subtitle },
  };
}

function readBody(slug: string): string {
  const file = path.join(process.cwd(), "app", "writing", "content", `${slug}.html`);
  return fs.readFileSync(file, "utf-8");
}

/**
 * Renders the article body, swapping `<!--WIDGET:name-->` markers for the live
 * component of that name. Prose chunks keep the `.article-prose` styling; the
 * widgets sit outside it so the typography rules do not reach into them.
 */
function ArticleBody({ html }: { html: string }) {
  const parts = html.split(/<!--\s*WIDGET:([a-z-]+)\s*-->/);
  return (
    <>
      {parts.map((chunk, i) => {
        if (i % 2 === 1) {
          const Widget = WIDGETS[chunk];
          return Widget ? <Widget key={i} /> : null;
        }
        // Only the opening chunk gets the larger lede paragraph.
        return chunk.trim() ? (
          <div
            key={i}
            className={i === 0 ? "article-prose" : "article-prose prose-cont"}
            dangerouslySetInnerHTML={{ __html: chunk }}
          />
        ) : null;
      })}
    </>
  );
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const body = readBody(slug);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* top bar */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">
            ← Wahid Tawsif Ratul
          </Link>
          <Link
            href="/writing"
            className="text-xs uppercase tracking-[0.15em] text-white/45 hover:text-white/80 transition-colors"
          >
            Writing
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pb-32">
        {/* header */}
        <header className="pt-14 pb-8">
          <div className="flex flex-wrap items-center gap-3 mb-5 text-[11px]">
            <span className="uppercase tracking-[0.15em] font-semibold" style={{ color: a.color }}>
              {a.topic}
            </span>
            <span className="text-white/30">·</span>
            <span className="text-white/55">{a.date}</span>
            <span className="text-white/30">·</span>
            <span className="text-white/55">{a.readTime}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight mb-5">
            {a.title}
          </h1>
          <p className="text-lg sm:text-xl text-white/60 leading-snug">{a.subtitle}</p>
        </header>

        {/* cover (skipped when the body already opens with it) */}
        {!a.coverInBody && (
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/[0.08] mb-4">
            <Image
              src={a.cover}
              alt={a.coverAlt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              style={{ objectPosition: "50% 40%" }}
            />
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${a.color}77, transparent)` }}
            />
          </div>
        )}

        {/* body */}
        <ArticleBody html={body} />

        {/* companion links */}
        {a.links && a.links.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-wrap gap-3">
            {a.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border text-sm transition-all hover:-translate-y-0.5"
                style={{ borderColor: `${a.color}55`, color: a.color }}
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        )}

        {/* footer nav */}
        <div className="mt-16 pt-8 border-t border-white/[0.08] flex items-center justify-between text-sm">
          <Link href="/writing" className="text-white/60 hover:text-white transition-colors">
            ← All writing
          </Link>
          <Link href="/#writing" className="text-white/60 hover:text-white transition-colors">
            Back to portfolio
          </Link>
        </div>
      </article>
    </div>
  );
}
