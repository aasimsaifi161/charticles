# ✨ Charticles

**Charts made of light.**

Charticles turns plain data into animated, glowing particle charts — instead of another flat bar graph nobody stops to look at, get bar, line, pie, donut, radar, and bubble charts rendered as living clouds of warm, drifting particles. Export them as MP4, GIF, or PNG for social content, pitch decks, or reports.

Free to use.

---

## Features

- **6 chart types** — Bar, Line, Pie, Donut, Radar, Bubble
- **Dual-series comparisons** — toggle on a second series (e.g. "This year vs Last year") with its own legend and colors
- **Two ways to add data** — type it in manually, or upload a CSV
- **Live particle preview** — see your chart animate in real time as you tweak colors, density, and style
- **Warm, distinctive aesthetic** — amber/coral/gold particle palettes on a dark or light theme, with a one-click theme toggle
- **Export anywhere** — download as MP4, animated GIF, or a high-res PNG snapshot
- **Aspect ratio presets** — 9:16, 1:1, and 16:9, sized correctly for Reels/Stories, Instagram feed, and landscape/decks

## Who it's for

- Social media managers and content creators who want a chart that stops the scroll
- Founders and small teams building a standout metric slide for a pitch deck
- Newsletter writers who want a distinct, recognizable visual style
- Small marketing and design agencies producing client deliverables

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Rendering engine:** [particle-charts](https://github.com/bwilliford/particleCharts) — an MIT-licensed particle chart rendering library
- **Auth & data:** Supabase
- **Theming:** next-themes

## Getting Started

```bash
git clone https://github.com/<your-username>/charticles.git
cd charticles
npm install
```

Create a `.env.local` file from the provided example and add your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Then run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Project Structure

```
charticles/
├── app/                # Routes (landing page, dashboard, auth)
├── components/
│   ├── charts/          # Particle chart rendering + overlay (axes, legend, tooltips)
│   ├── dashboard/        # Data input, style controls, export panel
│   └── landing/          # Landing page sections
├── lib/                 # Types, palettes, Supabase client/server setup
└── public/
```

## Credits

Charticles' particle rendering is built on top of [particle-charts](https://github.com/bwilliford/particleCharts) by Blake Williford, used under the MIT License.

## License

MIT
