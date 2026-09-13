import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://charticles.vercel.app"),
  title: "Charticles — Free 60 FPS Particle Chart Studio",
  description:
    "Turn any data or chart image into mesmerizing, living particle visualizations. Export Ultra HD PNGs and 60 FPS video loops for pitch decks and social media. 100% free, zero watermarks.",
  keywords: [
    "particle charts",
    "data visualization",
    "chart maker",
    "60fps chart video",
    "pitch deck visualizer",
    "canva alternative for charts",
    "ray.so for charts",
    "free chart export",
  ],
  authors: [{ name: "Aasim Saifi", url: "https://x.com/aasimtwt" }],
  creator: "Aasim Saifi (@aasimtwt)",
  publisher: "Charticles",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://charticles.vercel.app",
    title: "Charticles — Free 60 FPS Particle Chart Studio",
    description:
      "Turn any data or chart image into mesmerizing, living particle visualizations. 100% free, zero watermarks.",
    siteName: "Charticles",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "Charticles Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Charticles — Free 60 FPS Particle Chart Studio",
    description:
      "Turn any data or chart image into mesmerizing, living particle visualizations. 100% free, zero watermarks.",
    creator: "@aasimtwt",
    images: ["/icon.svg"],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Charticles",
  url: "https://charticles.vercel.app",
  description:
    "Turn any data or chart image into mesmerizing, living particle visualizations. Export Ultra HD PNGs and 60 FPS video loops.",
  applicationCategory: "DesignApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Aasim Saifi",
    url: "https://x.com/aasimtwt",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
