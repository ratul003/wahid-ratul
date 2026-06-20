import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://wahid-ratul.vercel.app";
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/resume`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
