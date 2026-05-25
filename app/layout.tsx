import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
// @ts-ignore: CSS side-effect import handled by Next.js
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", 
  preload: true,
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, 
};

export const metadata: Metadata = {
  metadataBase: new URL('https://careerlabconsulting.com'),
  title: {
    default: "Career Lab Consulting | Enterprise AI Solution Ecosystem",
    template: "%s | Career Lab Consulting",
  },
  description: "Transform your business with precision-engineered AI agents, RAG pipelines, and LLMOps. We bridge the gap between enterprise needs and AI innovation.",
  keywords: ["AI Consulting", "LLMOps", "RAG Engineering", "AI Business Automation", "Career Lab Consulting"],
  authors: [{ name: "Career Lab Team" }],
  creator: "Career Lab Consulting",
  publisher: "Career Lab Consulting",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Career Lab Consulting | AI & Career Solutions",
    description: "Scale your intelligence with enterprise-grade AI solutions and professional career engineering.",
    url: 'https://careerlabconsulting.com',
    siteName: 'Career Lab Consulting',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Career Lab Consulting - AI Ecosystem',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Lab Consulting',
    description: 'Enterprise AI and Career Solutions.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://careerlabconsulting.com',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://images.pexels.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />

        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="worker" 
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Career Lab Consulting",
              "alternateName": "CLC AI",
              "url": "https://careerlabconsulting.com",
              "logo": "https://careerlabconsulting.com/logo.png",
              "description": "Expert AI and Business Consulting firm specializing in LLMOps and RAG.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              },
              "sameAs": [
                "https://linkedin.com/company/careerlabconsulting",
                "https://twitter.com/careerlab"
              ]
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} antialiased font-sans bg-[#020617] text-white selection:bg-blue-500/30`} suppressHydrationWarning>
        <main className="min-h-screen relative" id="main-content">
          {children}
        </main>
        
      </body>
    </html>
  );
}