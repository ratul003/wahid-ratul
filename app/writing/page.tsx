import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { articles } from "./articles";

export const metadata: Metadata = {
  title: "Writing · Wahid Tawsif Ratul",
  description:
    "Articles on AI, economics, product and data, by Wahid Tawsif Ratul.",
};

export default function WritingIndex() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">
            ← Wahid Tawsif Ratul
          </Link>
          <a
            href="https://medium.com/@wahidtratul"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.15em] text-white/45 hover:text-white/80 transition-colors"
          >
            Medium ↗
          </a>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex items-baseline gap-4 mb-4">
          <span className="text-[11px] font-mono text-white/40">·</span>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">Writing</p>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Articles</h1>
        <p className="text-sm text-white/55 max-w-xl mb-14 leading-relaxed">
          Long-form pieces on AI, economics, product and data. Where the numbers meet the story.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/writing/${a.slug}`}
              className="group relative flex flex-col rounded-lg border border-white/[0.07] overflow-hidden min-h-[250px] hover:border-white/[0.15] hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 ease-out"
            >
              <div className="absolute inset-0 pointer-events-none">
                <Image
                  src={a.thumb ?? a.cover}
                  alt={a.coverAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  style={{ objectPosition: a.thumb ? "50% 50%" : "50% 40%" }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a0a0f 16%, rgba(10,10,15,0.82) 52%, rgba(10,10,15,0.42) 100%)" }} />
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${a.color}77, transparent)` }}
                />
              </div>
              <div className="relative z-10 flex flex-col flex-1 justify-end p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] uppercase tracking-[0.12em] font-semibold leading-tight" style={{ color: a.color }}>
                    {a.topic}
                  </span>
                  <span className="text-white/30 text-[9px]">·</span>
                  <span className="text-[9px] text-white/55">{a.date}</span>
                </div>
                <h3 className="text-[13px] font-semibold text-white mb-1.5 leading-snug">{a.title}</h3>
                <p className="text-[11px] text-white/60 leading-relaxed line-clamp-3">{a.subtitle}</p>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-white/55 group-hover:text-white/90 transition-colors">
                  <span>Read the article →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
