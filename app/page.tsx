"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  LineChart,
  CircleDot,
  Hexagon,
  Sparkles,
  Download,
  Upload,
  Cpu,
  ShieldCheck,
  Coffee,
} from "lucide-react";
import { CharticlesLogo } from "@/components/icons/CharticlesLogo";
import { ParticleChartStage } from "@/components/ParticleChartStage";
import { ParticleBackground } from "@/components/landing/ParticleBackground";
import { OFFICIAL_PALETTE } from "@/lib/theme";
import type { ChartOptions } from "particle-charts";

// Lightweight demo configs for the live hero chart
const HERO_DEMOS: Record<
  "bar" | "line" | "donut" | "radar",
  { label: string; icon: any; title: string; config: ChartOptions }
> = {
  bar: {
    label: "Bar",
    icon: BarChart3,
    title: "Tech Giants Market Cap ($T)",
    config: {
      type: "bar",
      background: "#000000",
      theme: "dark",
      responsive: true,
      padding: { top: 40, right: 36, bottom: 64, left: 48 },
      particle: {
        color: "#2ff0d6",
        size: 0.85,
        density: 16,
        bloom: 0.8,
        bloomRadius: 14,
        speed: 0.08,
      },
      data: {
        labels: ["Apple", "Microsoft", "NVIDIA", "Alphabet", "Amazon", "Meta"],
        series: [
          {
            name: "Market Cap",
            values: [3.4, 3.1, 2.9, 2.1, 1.9, 1.3],
            color: "#2ff0d6",
          },
        ],
      },
      showAxis: true,
      showGrid: true,
      showTooltip: true,
      bar: { padding: 0.42, fade: 0.45, radius: 4 },
      axis: { ticks: 5, beginAtZero: true, fontSize: 11, xLabels: false },
    },
  },
  line: {
    label: "Line / Area",
    icon: LineChart,
    title: "SaaS ARR Velocity ($M)",
    config: {
      type: "line",
      background: "#000000",
      theme: "dark",
      responsive: true,
      padding: { top: 40, right: 36, bottom: 64, left: 48 },
      particle: {
        color: "#2ff0d6",
        size: 0.85,
        density: 16,
        bloom: 0.85,
        bloomRadius: 14,
        speed: 0.08,
      },
      data: {
        labels: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8"],
        series: [
          {
            name: "ARR",
            values: [1.2, 2.4, 4.1, 6.8, 10.5, 15.2, 21.0, 28.5],
            color: "#2ff0d6",
          },
        ],
      },
      showAxis: true,
      showGrid: true,
      showTooltip: true,
      line: { curve: "smooth", width: 2, area: true, areaAmount: 0.5 },
      axis: { ticks: 5, beginAtZero: true, fontSize: 11, xLabels: false },
    },
  },
  donut: {
    label: "Donut",
    icon: CircleDot,
    title: "Global Cloud Market Share (%)",
    config: {
      type: "donut",
      background: "#000000",
      theme: "dark",
      responsive: true,
      padding: { top: 48, right: 48, bottom: 48, left: 48 },
      particle: {
        color: OFFICIAL_PALETTE.slices, // Vibrant multi-color slices!
        size: 0.9,
        density: 18,
        bloom: 0.85,
        bloomRadius: 14,
      },
      data: {
        labels: ["AWS", "Azure", "Google Cloud", "Alibaba", "Others"],
        values: [31, 24, 11, 4, 30],
      },
      showLegend: true,
      showTooltip: true,
      pie: { innerRadius: 0.62, padAngle: 1.2, startAngle: -90, center: "total" },
    },
  },
  radar: {
    label: "Radar",
    icon: Hexagon,
    title: "AI Benchmark Capability Matrix",
    config: {
      type: "radar",
      background: "#000000",
      theme: "dark",
      responsive: true,
      padding: 56,
      particle: {
        color: "#2ff0d6",
        size: 0.85,
        density: 18,
        bloom: 0.85,
        bloomRadius: 14,
      },
      data: {
        labels: ["Reasoning", "Coding", "Math", "Vision", "Speed", "Memory"],
        series: [
          {
            name: "Model v4",
            values: [96, 92, 88, 94, 98, 86],
            color: "#2ff0d6",
          },
        ],
      },
      showLegend: false,
      showTooltip: true,
    },
  },
};

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"bar" | "line" | "donut" | "radar">("bar");
  const activeDemo = HERO_DEMOS[activeTab];

  return (
    <div className="relative min-h-screen bg-black text-[#eef1f6] antialiased selection:bg-[#2ff0d6]/30 selection:text-[#2ff0d6]">
      {/* Living Interactive Particle Field - Spans Entire Landing Page Across All Sections */}
      <ParticleBackground className="fixed inset-0 pointer-events-none z-0" />

      {/* 1. Minimal Header */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-black/80 backdrop-blur-md px-6 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#2ff0d6]/30 bg-black/90 shadow-sm shadow-[#2ff0d6]/20 transition-transform group-hover:scale-105">
              <CharticlesLogo className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">Charticles</span>
          </Link>
          <span className="rounded-full bg-[#2ff0d6]/10 border border-[#2ff0d6]/30 px-2 py-0.5 text-[10px] font-mono text-[#2ff0d6]">
            100% Free
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/aasimsaifi161/charticles"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#8E97A8] hover:text-white transition-colors"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span>GitHub</span>
          </a>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2ff0d6] px-3.5 py-1.5 text-xs font-semibold text-[#06070a] shadow-sm shadow-[#2ff0d6]/25 hover:bg-[#28d7bf] hover:shadow-[#2ff0d6]/35 active:scale-[0.98] transition-all"
          >
            <span>Open Studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main id="main-content" className="relative z-10">
        {/* 2. Hero Section (Full Viewport Height & Width with Ambient Glow) */}
        <section className="relative w-full overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center text-center">
          {/* Ambient Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] pointer-events-none z-0 blur-3xl opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(47,240,214,0.6) 0%, rgba(124,77,255,0.3) 60%, transparent 80%)",
            }}
          />

          {/* Empty spacer for flex-between balance */}
          <div className="relative z-10 hidden sm:block h-2" />

          {/* Center Content Stack */}
          <div className="relative z-10 flex flex-col items-center max-w-4xl px-6 lg:px-12 my-auto">
            {/* Feature Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-[#8E97A8] mb-8 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#2ff0d6] animate-pulse" />
              <span>No Sign-up • Zero Watermarks • 100% Free Forever</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-3xl leading-[1.12]">
              Data visualization, <br />
              <span className="bg-gradient-to-r from-[#2ff0d6] via-[#5cf7e4] to-[#9b72ff] bg-clip-text text-transparent">
                made of living light.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-[#8E97A8] max-w-2xl font-normal leading-relaxed">
              Transform numbers, spreadsheets, or boring graph screenshots into mesmerizing 60 FPS particle
              visualizations. Export in 4K Ultra HD and video loops for pitch decks and social media.
            </p>

            {/* Primary CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2ff0d6] px-6 py-3 text-sm font-semibold text-[#06070a] shadow-lg shadow-[#2ff0d6]/25 hover:bg-[#28d7bf] hover:shadow-[#2ff0d6]/35 active:scale-[0.98] transition-all"
              >
                <span>Open Studio — Free</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="https://github.com/aasimsaifi161/charticles"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-[#cad2e0] hover:text-white hover:bg-white/[0.07] hover:border-white/20 transition-all"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>Star on GitHub</span>
              </a>
            </div>

            {/* Value Micro-Pills */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#8E97A8]">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2ff0d6]" />
                <span>120,000 GPU Particles</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2ff0d6]" />
                <span>AI Vision Ingestion</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2ff0d6]" />
                <span>4K Ultra HD & Video Loops</span>
              </div>
            </div>
          </div>

          {/* Scroll Cue Prompt Linking to Interactive Demo Below */}
          <a
            href="#demo"
            className="relative z-10 mt-10 sm:mt-12 mb-12 inline-flex flex-col items-center gap-2.5 text-xs font-mono text-[#8E97A8]/70 hover:text-[#2ff0d6] transition-colors group cursor-pointer"
          >
            <span className="tracking-wide">Explore Interactive Demo</span>
            <div className="w-5 h-9 rounded-full border border-white/20 group-hover:border-[#2ff0d6]/50 flex items-start justify-center p-1.5 transition-colors">
              <div className="w-1.5 h-2 rounded-full bg-[#2ff0d6] animate-bounce" />
            </div>
          </a>
        </section>

      {/* 3. Live Interactive Sample Showcase Section (Appears When Scrolling Down) */}
      <section id="demo" className="py-24 px-6 lg:px-12 max-w-6xl mx-auto border-t border-white/[0.08]">
        {/* Showcase Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2ff0d6]/20 bg-[#2ff0d6]/5 px-3 py-1 text-xs text-[#2ff0d6] mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Live Preview</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Living Particle Physics in Action
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#8E97A8]">
            Switch between chart modes below. Over 120,000 sub-pixel particles morph smoothly on your GPU in real time.
          </p>
        </div>

        {/* Live Interactive Hero Canvas Frame (Generous Presentation Scale) */}
        <div className="w-full max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#090A0D]/90 backdrop-blur-md p-3 sm:p-5 shadow-2xl overflow-hidden relative group">
          {/* Card Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3 mb-3 px-1">
            {/* Chart Title and Live Indicator */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#2ff0d6] animate-pulse" />
              <span className="text-xs font-mono font-medium text-white tracking-tight">
                {activeDemo.title}
              </span>
            </div>

            {/* Interactive Morph Switcher */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
              {(
                [
                  { id: "bar", label: "Bar", icon: BarChart3 },
                  { id: "line", label: "Area", icon: LineChart },
                  { id: "donut", label: "Donut", icon: CircleDot },
                  { id: "radar", label: "Radar", icon: Hexagon },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#2ff0d6] text-[#06070a] font-semibold shadow-sm shadow-[#2ff0d6]/20"
                        : "text-[#8E97A8] hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actual Live Particle Canvas Rendering (High Breathing Room) */}
          <div className="relative w-full h-[480px] sm:h-[560px] lg:h-[620px] rounded-xl bg-black overflow-hidden border border-white/[0.04]">
            <ParticleChartStage
              key={activeTab}
              config={activeDemo.config}
              className="w-full h-full"
              tiltLabels={true}
            />

            {/* Subtle Overlay Badge */}
            <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 border border-white/10 text-[10px] font-mono text-[#8E97A8] backdrop-blur-md">
              <span>60 FPS GPU Canvas</span>
            </div>
          </div>

          {/* Bottom Bar: Jump into Studio CTA */}
          <div className="mt-3 flex items-center justify-between px-2 pt-1 text-xs text-[#8E97A8]">
            <span>Click any tab above to see real-time particle morphing</span>
            <Link
              href="/dashboard"
              className="text-[#2ff0d6] hover:underline inline-flex items-center gap-1 font-medium"
            >
              <span>Edit this chart in Studio</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Three High-Signal Feature Pillars (No AI Slop) */}
      <section className="py-16 px-6 lg:px-12 max-w-6xl mx-auto border-t border-white/[0.08]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#090A0D]/85 backdrop-blur-md p-6 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#2ff0d6]/10 border border-[#2ff0d6]/30 flex items-center justify-center text-[#2ff0d6] mb-4">
                <Upload className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Image & CSV Ingestion</h3>
              <p className="mt-2 text-xs text-[#8E97A8] leading-relaxed">
                Drop a screenshot of any existing chart or upload CSV data. Our vision pipeline extracts the
                categories and numbers directly into particles with zero manual transcription.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-[#2ff0d6]">
              Vision AI + CSV Table
            </div>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#090A0D]/85 backdrop-blur-md p-6 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#2ff0d6]/10 border border-[#2ff0d6]/30 flex items-center justify-center text-[#2ff0d6] mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white">60 FPS Hardware Physics</h3>
              <p className="mt-2 text-xs text-[#8E97A8] leading-relaxed">
                Over 120,000 particles simulated simultaneously on GPU canvas. Includes bloom diffusion,
                Apple-style tilted dynamic typography, and adaptive fullscreen scaling.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-[#2ff0d6]">
              Sub-pixel Bloom & Motion
            </div>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#090A0D]/85 backdrop-blur-md p-6 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-xl bg-[#2ff0d6]/10 border border-[#2ff0d6]/30 flex items-center justify-center text-[#2ff0d6] mb-4">
                <Download className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Studio-Grade Export</h3>
              <p className="mt-2 text-xs text-[#8E97A8] leading-relaxed">
                Export 4K Ultra HD PNGs or smooth 60 FPS video loops at 14 Mbps. Ready for Apple Keynote,
                Google Slides, Twitter/X, or LinkedIn. Completely watermark-free.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-[#2ff0d6]">
              Ultra HD PNG + 60fps WebM
            </div>
          </div>
        </div>
      </section>

      {/* 5. Built by the Creator Section */}
      <section className="py-20 px-6 lg:px-12 max-w-4xl mx-auto border-t border-white/[0.08]">
        <div className="rounded-3xl border border-white/10 bg-[#090A0D]/85 backdrop-blur-md p-8 sm:p-10 relative overflow-hidden shadow-2xl">
          {/* Ambient Glow */}
          <div
            className="absolute top-0 right-0 w-80 h-80 pointer-events-none -z-0 blur-3xl opacity-15"
            style={{
              background: "radial-gradient(circle, rgba(47,240,214,0.5) 0%, rgba(124,77,255,0.25) 70%, transparent 100%)",
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 justify-between">
            {/* Left: Avatar + Identity + Story */}
            <div className="flex flex-col sm:flex-row items-start gap-5 max-w-2xl">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src="https://github.com/aasimsaifi161.png"
                  alt="Aasim Saifi"
                  width={80}
                  height={80}
                  loading="lazy"
                  decoding="async"
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border border-[#2ff0d6]/40 shadow-lg shadow-[#2ff0d6]/10"
                />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2ff0d6] opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#2ff0d6] border-2 border-[#090A0D]" />
                </span>
              </div>

              {/* Story Details */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-mono text-[#8E97A8] mb-2">
                  <span>Built by an Independent Creator</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Aasim Saifi
                </h3>
                <p className="text-xs font-mono text-[#2ff0d6] mb-3">
                  Full Stack Engineer & Creator of Charticles
                </p>

                <p className="text-xs sm:text-sm text-[#8E97A8] leading-relaxed">
                  I built Charticles because presentation graphs always felt cold, static, and rigid.
                  I wanted to see data behave like living matter—with 60 FPS GPU particle physics, bloom diffusion,
                  and zero paywalls or subscriptions. Charticles is 100% free forever and crafted for anyone who cares about visual craft.
                </p>
              </div>
            </div>

            {/* Right: Actions & Support */}
            <div className="flex flex-col gap-2.5 w-full md:w-auto md:min-w-[190px] flex-shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/[0.08]">
              {/* Buy Me a Coffee */}
              <a
                href="https://buymeacoffee.com/aasim161"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFDD00] px-4 py-2.5 text-xs font-semibold text-black shadow-md shadow-[#FFDD00]/15 hover:bg-[#ffea55] active:scale-[0.98] transition-all"
              >
                <Coffee className="h-4 w-4" />
                <span>Buy me a coffee</span>
              </a>

              {/* GitHub Profile */}
              <a
                href="https://github.com/aasimsaifi161"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-[#cad2e0] hover:text-white hover:bg-white/[0.08] transition-all"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>GitHub @aasimsaifi161</span>
              </a>

              {/* Twitter / X */}
              <a
                href="https://x.com/aasimtwt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-[#cad2e0] hover:text-white hover:bg-white/[0.08] transition-all"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>@aasimtwt</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Minimal Launch CTA Banner */}
      <section className="py-20 px-6 lg:px-12 max-w-4xl mx-auto text-center">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#0D0F14]/90 to-black/90 backdrop-blur-md p-8 sm:p-12 relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Make your data unforgettable.
          </h2>
          <p className="mt-3 text-sm text-[#8E97A8] max-w-lg mx-auto">
            No account required. Open the studio and export your first living particle chart in under 30
            seconds.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2ff0d6] px-6 py-3 text-xs sm:text-sm font-semibold text-[#06070a] shadow-lg shadow-[#2ff0d6]/25 hover:bg-[#28d7bf] active:scale-[0.98] transition-all"
            >
              <span>Launch Studio</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      </main>

      {/* 7. Minimal Footer */}
      <footer className="relative z-10 border-t border-white/[0.08] py-8 px-6 lg:px-12 text-xs text-[#8E97A8] flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <CharticlesLogo className="h-4 w-4" />
          <span className="font-semibold text-white">Charticles</span>
          <span>— 100% Free & Open Source</span>
        </div>

        <div className="flex items-center gap-5">
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Studio
          </Link>
          <a
            href="https://github.com/aasimsaifi161/charticles"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://x.com/aasimtwt"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Twitter / X
          </a>
          <a
            href="https://buymeacoffee.com/aasim161"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors inline-flex items-center gap-1 text-[#eef1f6]/90"
          >
            <Coffee className="h-3 w-3 text-[#FFDD00]" />
            <span>Buy me a coffee</span>
          </a>
          <a
            href="https://github.com/aasimsaifi161/charticles/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            MIT License
          </a>
        </div>
      </footer>
    </div>
  );
}
