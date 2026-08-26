import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const TITLE =
  "Wahid Tawsif Ratul — Product Manager & Data Scientist | Experimentation, Product Analytics, Agentic AI";
const DESCRIPTION =
  "Data Scientist turned Product Manager. $17M+ in measured revenue gains across Systems Product Management, B2B2C SaaS Pricing and Analytics, and On-Demand Marketplace Operations.";

export const metadata: Metadata = {
  metadataBase: new URL("https://wahid-ratul.vercel.app"),
  title: TITLE,
  description: DESCRIPTION,
  // Deliberately no `alternates.canonical`: the absence of a canonical tag is
  // what lets ?v=N force LinkedIn and Slack to re-scrape a retitled page.
  keywords: [
    "Wahid Tawsif Ratul",
    "Product Manager",
    "Data Scientist",
    "Analytics Engineer",
    "Product Analytics",
    "Experimentation",
    "A/B Testing",
    "Causal Inference",
    "Statistical Modeling",
    "Agentic AI",
    "Claude Code",
    "MCP",
    "LLM Evaluation",
    "Analytics Engineering",
    "Data Engineering",
    "Snowflake",
    "dbt",
    "BigQuery",
    "Segment",
    "Reverse ETL",
    "Dimensional Modeling",
    "Marketplace Analytics",
    "Two-Sided Marketplace",
    "Surge Pricing",
    "SaaS Pricing and Packaging",
    "Product-Led Growth",
    "Churn Modeling",
    "Monte Carlo Simulation",
    "Econometrics",
    "PostHog",
    "Mixpanel",
    "Tableau",
    "Optimizely",
    "University of Minnesota",
  ],
  authors: [{ name: "Wahid Tawsif Ratul", url: "https://wahid-ratul.vercel.app" }],
  creator: "Wahid Tawsif Ratul",
  category: "technology",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://wahid-ratul.vercel.app",
    siteName: "Wahid Tawsif Ratul",
    type: "profile",
    firstName: "Wahid",
    lastName: "Ratul",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

/**
 * Person schema. This is the part search engines actually consume for an
 * entity panel; `knowsAbout` is the honest place for the long tail of skills
 * that would look like stuffing in body copy.
 */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Wahid Tawsif Ratul",
  url: "https://wahid-ratul.vercel.app",
  image: "https://wahid-ratul.vercel.app/profile.png",
  jobTitle: "Product Manager & Data Scientist",
  description: DESCRIPTION,
  email: "mailto:wahidtratul@gmail.com",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Minnesota",
    sameAs: "https://umn.edu",
  },
  knowsAbout: [
    "Product Management",
    "Product Analytics",
    "Experimentation and A/B Testing",
    "Causal Inference",
    "Analytics Engineering",
    "Data Engineering",
    "Agentic AI",
    "Large Language Model Evaluation",
    "SaaS Pricing and Packaging",
    "Two-Sided Marketplace Operations",
    "Statistical Modeling",
    "Econometrics",
    "Monte Carlo Simulation",
    "Dimensional Data Modeling",
    "Snowflake",
    "dbt",
    "BigQuery",
    "Python",
    "SQL",
    "R",
  ],
  sameAs: [
    "https://linkedin.com/in/wahidratul112296",
    "https://github.com/ratul003",
    "https://medium.com/@wahidtratul",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
