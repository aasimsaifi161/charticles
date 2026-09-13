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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://charticles.com",
    title: "Charticles — Free 60 FPS Particle Chart Studio",
    description:
      "Turn any data or chart image into mesmerizing, living particle visualizations. 100% free, zero watermarks.",
    siteName: "Charticles",
  },
  twitter: {
    card: "summary_large_image",
    title: "Charticles — Free 60 FPS Particle Chart Studio",
    description:
      "Turn any data or chart image into mesmerizing, living particle visualizations. 100% free, zero watermarks.",
    creator: "@aasimtwt",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
