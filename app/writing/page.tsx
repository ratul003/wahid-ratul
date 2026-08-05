import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { articles } from "./articles";

export const metadata: Metadata = {
  title: "Writing · Wahid Tawsif Ratul",
  description:
    "Essays on AI, economics, product and data, by Wahid Tawsif Ratul.",
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
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Essays</h1>
        <p className="text-sm text-white/55 max-w-xl mb-14 leading-relaxed">
          Long-form pieces on AI, economics, product and data. Where the numbers meet the story.
        </p>

        <div className="grid md:grid-cols-2 gap-3">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/writing/${a.slug}`}
              className="group relative flex flex-col rounded-xl border border-white/[0.08] overflow-hidden min-h-[420px] hover:border-white/[0.2] hover:-translate-y-0.5 transition-all duration-300 ease-out"
            >
              <div className="absolute inset-0 pointer-events-none">
                <Image
                  src={a.thumb ?? a.cover}
                  alt={a.coverAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  style={{ objectPosition: a.thumb ? "50% 50%" : "50% 40%" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/45 to-transparent" />
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${a.color}77, transparent)` }}
                />
              </div>
              <div className="relative z-10 flex flex-col flex-1 justify-end p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] uppercase tracking-[0.15em] font-semibold" style={{ color: a.color }}>
                    {a.topic}
                  </span>
                  <span className="text-white/30">·</span>
                  <span className="text-[10px] text-white/55">{a.date}</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-1 leading-snug">{a.title}</h3>
                <p className="text-xs text-white/65 mb-4 leading-snug">{a.subtitle}</p>
                <p className="text-xs text-white/70 leading-relaxed line-clamp-4">{a.excerpt}</p>
                <div className="mt-5 flex items-center gap-1.5 text-[11px] text-white/60 group-hover:text-white transition-colors">
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
