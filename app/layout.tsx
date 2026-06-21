import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wahid-ratul.vercel.app"),
  title: "Wahid Tawsif Ratul · Data Scientist & Product Manager",
  description:
    "Data Scientist turned Product Manager. Economist and Statistician by training. I build the systems that connect product behavior to business outcomes.",
  keywords: ["Wahid Tawsif Ratul", "Data Scientist", "Product Manager", "Analytics Engineer", "Statistics", "Optimizely", "Product Analytics"],
  authors: [{ name: "Wahid Tawsif Ratul" }],
  openGraph: {
    title: "Wahid Tawsif Ratul · Data Scientist & Product Manager",
    description:
      "Data Scientist turned Product Manager. I build the systems that connect product behavior to business outcomes.",
    url: "https://wahid-ratul.vercel.app",
    siteName: "Wahid Tawsif Ratul",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wahid Tawsif Ratul · Data Scientist & Product Manager",
    description: "Data Scientist turned Product Manager. Building systems that connect product behavior to business outcomes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
