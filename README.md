<div align="center">

  <img src="public/icon.svg" alt="Charticles Logo" width="84" height="84" />

  # Charticles
  
  **Data visualization, made of living light.**

  An open-source, studio-grade creative charting studio that transforms static numbers, CSV spreadsheets, and screenshots into mesmerizing 60 FPS GPU particle simulations.

  [![License: MIT](https://img.shields.io/badge/License-MIT-090A0D?style=for-the-badge&logoColor=2ff0d6&labelColor=000000&color=2ff0d6)](LICENSE)
  [![Next.js 16](https://img.shields.io/badge/Next.js-16.3-090A0D?style=for-the-badge&logo=next.js&logoColor=white&labelColor=000000)](https://nextjs.org/)
  [![React 19](https://img.shields.io/badge/React-19.2-090A0D?style=for-the-badge&logo=react&logoColor=61DAFB&labelColor=000000)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-090A0D?style=for-the-badge&logo=typescript&logoColor=3178C6&labelColor=000000)](https://www.typescriptlang.org/)
  [![100% Free](https://img.shields.io/badge/Price-100%25%20Free%20Forever-090A0D?style=for-the-badge&logoColor=2ff0d6&labelColor=000000&color=2ff0d6)](#)
  [![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black&labelColor=000000)](https://buymeacoffee.com/aasim161)
  [![Follow on X](https://img.shields.io/badge/X-@aasimtwt-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/aasimtwt)

  <p align="center">
    <a href="#-features">Features</a> •
    <a href="#-supported-chart-types">Chart Types</a> •
    <a href="#-quickstart">Quickstart</a> •
    <a href="#-export-engine">Export Engine</a> •
    <a href="#-project-structure">Architecture</a> •
    <a href="#-creator--support">Creator</a> •
    <a href="#-license">License</a>
  </p>

</div>

---

## 💡 Why Charticles?

Most presentation charts are cold, static, and uninspiring. Pitch decks and keynote presentations rely on flat vectors or boring spreadsheet screenshots.

**Charticles** reimagines data visualization through living physics:
- **120,000+ GPU particles** flowing simultaneously in real time.
- **Sub-pixel optical bloom** for a luminous, futuristic neon aesthetic.
- **Zero watermarks, zero accounts, zero paywalls** — 100% free forever for founders, creators, and analysts.

---

## ✨ Features

### 🌌 60 FPS Hardware Physics
- Direct GPU canvas simulation running smoothly at 60 FPS.
- Real-time particle morphing when changing chart types, data values, or themes.
- Sub-pixel bloom diffusion with customizable density, radius, and particle speed.

### 📐 Apple-Style Tilted Typography
- Automatic `-45°` rotated labels below category bars tailored for dense datasets.
- Bypasses traditional tick downsampling—**100% of category names are displayed**, never dropped.
- Interactive hit-testing: hovering over categories highlights the corresponding bar and reveals tooltips.

### 📸 Vision AI & CSV Ingestion
- **Screenshot to Chart**: Drag & drop any image of an existing graph; our OpenAI Vision pipeline reconstructs the labels, values, and series automatically.
- **Interactive Data Studio**: Full tabular spreadsheet editor with cell editing, row/column insertion, and 1-click CSV upload.
- **5 Instant Presets**: Curated demo datasets (Tech Giants, SaaS ARR, Crypto Rally, Cloud Share, AI Benchmarks).

### 🎬 Studio-Grade Export Engine
- **4K Ultra HD PNG**: Export crystal-clear rasterizations (1x Web, 2x Retina, 4K UHD) with transparent backgrounds or sleek Studio Frame cards.
- **60 FPS Video Loops**: Real-time composite recorder that outputs smooth 14 Mbps WebM video loops capturing the centered title, live particle canvas, and bottom series legend.

---

## 📊 Supported Chart Types

| Chart Type | Particle Physics Mode | Best For |
| :--- | :--- | :--- |
| **Bar (Single & Dual)** | Linear Column Projection | Categorical comparisons, revenue breakdowns, market caps |
| **Line & Area** | Continuous Particle Curves | ARR growth, crypto rallies, temporal trends |
| **Donut & Pie** | Polar Particle Slices (Multi-Color) | Market share, portfolio allocation, traffic distribution |
| **Radar** | Radial Web Geometry | AI benchmark capability matrices, skill distributions |
| **Scatter & Bubble** | 2D Multi-Axis Fluid Nodes | Correlation analysis, multi-dimensional distributions |

## 💻 Use in Your Own React & Next.js Apps

Charticles is open source. You can drop living 60 FPS particle charts or our interactive particle constellation background directly into any Next.js or React project.

### React / Next.js Component

1. Install the engine:
```bash
npm install particle-charts
```

2. Create a component (e.g. `LivingChart.tsx`):
```tsx
"use client";

import { useEffect, useRef } from "react";
import { ParticleChart } from "particle-charts";

export function LivingChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 120,000 sub-pixel particles simulated on GPU at 60 FPS
    const chart = ParticleChart(containerRef.current, {
      type: "bar",
      background: "#000000",
      theme: "dark",
      responsive: true,
      particle: { color: "#2ff0d6", size: 1.1, bloom: 0.8 },
      data: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        series: [{ name: "ARR ($M)", values: [12.4, 24.8, 38.2, 55.6] }]
      }
    });

    return () => chart.destroy();
  }, []);

  return <div ref={containerRef} className="w-full h-[500px] rounded-2xl bg-black" />;
}
```

> [!TIP]
> You can visually design, color, and tune your chart in the [Charticles Studio](https://charticles.vercel.app/dashboard), then click **Export → React / Next.js** to copy your exact component code in 1 click.

---

## 🚀 Quickstart

### Prerequisites
- Node.js 18.17 or higher
- npm, pnpm, or bun

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/aasimsaifi161/charticles.git

# Navigate into directory
cd charticles

# Install dependencies
npm install
```

### 2. Environment Configuration (Optional)

Charticles is completely functional locally without any API keys. If you wish to enable the **Screenshot Vision AI** feature:

```bash
# Create local environment file
cp .env.example .env.local # or create .env.local
```

Add your OpenAI API key to `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

Visit:
- **Landing Page**: [http://localhost:3000](http://localhost:3000)
- **Studio Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI & State**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Typography**: [Geist Sans & Geist Mono](https://vercel.com/font)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Particle Graphics**: GPU 2D Canvas & WebGL physics
- **Video Compositing**: Web Streams API & MediaRecorder (VP9/VP8 WebM @ 14 Mbps)

---

## 📁 Project Structure

```
charticles/
├── app/
│   ├── api/
│   │   └── parse-chart-image/   # OpenAI Vision chart extraction endpoint
│   ├── dashboard/               # Studio workspace & live stage
│   ├── globals.css              # Dark theme tokens & smooth scrolling
│   ├── layout.tsx               # Root layout & SEO OpenGraph metadata
│   └── page.tsx                 # Full-screen landing page & live demo
├── components/
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx   # Top navigation & preset loader
│   │   ├── DataEditorTable.tsx   # Spreadsheet data studio
│   │   ├── ExportStudioModal.tsx # Canva-inspired export dialog
│   │   └── PlaygroundKnobs.tsx   # Real-time particle physics inspector
│   ├── icons/
│   │   └── CharticlesLogo.tsx    # Bespoke glowing "C" geometric mark
│   └── ParticleChartStage.tsx    # Hardware-accelerated canvas stage wrapper
├── lib/
│   ├── apple-axis-labels.ts     # -45° Apple-style non-dropping category labels
│   ├── export-engine.ts         # High-DPI PNG & 60 FPS video composite recorder
│   ├── preset-templates.ts      # Curated starter datasets
│   └── theme.ts                 # Official dark & vibrant color palettes
└── types/                       # TypeScript definitions for charts & studio
```

---

## 👨‍💻 Creator & Support

Crafted with dedication by **Aasim Saifi**:

- **Twitter / X**: [@aasimtwt](https://x.com/aasimtwt)
- **GitHub**: [@aasimsaifi161](https://github.com/aasimsaifi161)
- **Support the Project**: [buymeacoffee.com/aasim161](https://buymeacoffee.com/aasim161)

If you find Charticles useful for your pitch decks, blogs, or social media posts, consider giving the repo a ⭐️ star or [buying me a coffee](https://buymeacoffee.com/aasim161)!

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.
