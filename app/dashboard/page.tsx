"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  Upload,
  BarChart3,
  Columns2,
  LineChart,
  PieChart,
  CircleDot,
  Circle,
  Hexagon,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  Pencil,
} from "lucide-react";
import type { ChartTabKey } from "@/types/chart";
import {
  type TabularData,
  type PlaygroundKnobsState,
  type DataStudioTab,
  type ExtractedChartData,
  DEFAULT_PLAYGROUND_KNOBS,
} from "@/types/dashboard";
import { OFFICIAL_PALETTE, DEFAULT_PARTICLE_CONFIG } from "@/lib/theme";
import { transformTabularToChartData } from "@/lib/data-transformer";
import {
  DashboardHeader,
  type ChartTypeItem,
} from "@/components/dashboard/DashboardHeader";
import { DataEditorTable } from "@/components/dashboard/DataEditorTable";
import { CsvUploader } from "@/components/dashboard/CsvUploader";
import { ImageChartUploader } from "@/components/dashboard/ImageChartUploader";
import { PlaygroundKnobs } from "@/components/dashboard/PlaygroundKnobs";
import { ParticleChartStage } from "@/components/ParticleChartStage";
import { ExportStudioModal } from "@/components/dashboard/ExportStudioModal";
import type { PresetTemplate } from "@/lib/preset-templates";
import {
  computeCategoryBottomPadding,
  shouldTiltCategoryLabels,
} from "@/lib/apple-axis-labels";
import type { ChartOptions } from "particle-charts";

const CHART_TYPES: ChartTypeItem[] = [
  { id: "bar", label: "Bar", badge: "Single", icon: BarChart3 },
  { id: "bar-dual", label: "Dual Bar", badge: "Dual", icon: Columns2 },
  { id: "line-area", label: "Line / Area", badge: "Smooth", icon: LineChart },
  { id: "pie", label: "Pie", badge: "Radial", icon: PieChart },
  { id: "donut", label: "Donut", badge: "Total", icon: CircleDot },
  { id: "bubble", label: "Bubble", badge: "Scatter", icon: Circle },
  { id: "radar", label: "Radar", badge: "Spoke", icon: Hexagon },
];

const EMPTY_TABULAR_DATA: TabularData = {
  headers: ["Category", "Value"],
  rows: [
    ["", ""],
    ["", ""],
    ["", ""],
  ],
};

export default function DashboardPage() {
  const [dataStudioTab, setDataStudioTab] = useState<DataStudioTab>("table");
  const [datasetName, setDatasetName] = useState<string>("Custom Data");
  const [tabularData, setTabularData] = useState<TabularData>(EMPTY_TABULAR_DATA);
  const [activeChartType, setActiveChartType] = useState<ChartTabKey>("bar");
  const [isAreaFill, setIsAreaFill] = useState(true);
  const [particleCount, setParticleCount] = useState<number | null>(null);
  const [knobs, setKnobs] = useState<PlaygroundKnobsState>(DEFAULT_PLAYGROUND_KNOBS);
  const stageContainerRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(datasetName);

  React.useEffect(() => {
    setTempTitle(datasetName);
  }, [datasetName]);

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim()) {
      setDatasetName(tempTitle.trim());
    } else {
      setTempTitle(datasetName);
    }
  };

  const isDualSeries = activeChartType === "bar-dual";

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      if (stageContainerRef.current) {
        try {
          await stageContainerRef.current.requestFullscreen();
        } catch (err) {
          console.error("Fullscreen request failed:", err);
        }
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 60);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Check if user has entered any valid numeric rows
  const hasValidData = useMemo(() => {
    return tabularData.rows.some((r) => {
      const v1 = typeof r[1] === "number" && Number.isFinite(r[1]);
      const v2 = typeof r[2] === "number" && Number.isFinite(r[2]);
      return v1 || v2;
    });
  }, [tabularData]);

  // Transform data into particle-charts options with adaptive fullscreen compensation
  const chartConfig = useMemo<ChartOptions>(() => {
    const rawData = transformTabularToChartData(tabularData, activeChartType);

    // Adaptive Fullscreen Scaling:
    // In particle-charts, budgetForArea scales sub-linearly as (area / 230400)^0.62.
    // When expanding to fullscreen (~4.5x - 6x larger canvas area), this causes
    // particle density per square pixel to drop by ~45-55%, and fixed CSS pixel
    // widths (bloom, lines, sizes) to appear visually diminished.
    const isCompensated = isFullscreen && knobs.fullscreenScale;
    const effectiveDensity = isCompensated
      ? Math.round(knobs.density * 1.85 * 10) / 10
      : knobs.density;
    const effectiveSize = isCompensated
      ? Math.round(knobs.size * 1.25 * 100) / 100
      : knobs.size;
    const effectiveBloomRadius = isCompensated ? 24 : 14;
    const effectiveMaxParticles = isCompensated ? 120000 : 60000;
    const effectiveAxisFontSize = isCompensated ? 13 : 11;
    const effectiveLegendFontSize = isCompensated ? 14 : 12;
    const effectiveLegendMarkerSize = isCompensated ? 10 : 8;

    const labels: string[] =
      "labels" in rawData && Array.isArray(rawData.labels)
        ? (rawData.labels as string[])
        : [];
    const isCartesianWithLabels = ["bar", "bar-dual", "line-area"].includes(
      activeChartType
    );
    const shouldTilt =
      isCartesianWithLabels &&
      Boolean(knobs.tiltLabels) &&
      shouldTiltCategoryLabels(labels);

    const basePadding = isCompensated
      ? Math.max(knobs.chartPadding, 48)
      : knobs.chartPadding;

    const responsivePadding = isCartesianWithLabels
      ? {
          top: basePadding,
          right: basePadding,
          bottom: computeCategoryBottomPadding(
            labels,
            isCompensated,
            basePadding,
            shouldTilt
          ),
          left: basePadding + (isCompensated ? 8 : 4),
        }
      : basePadding;

    const baseDefaults: Pick<
      ChartOptions,
      "background" | "theme" | "responsive" | "particle" | "padding"
    > = {
      background: OFFICIAL_PALETTE.background,
      theme: "dark",
      responsive: true,
      padding: responsivePadding,
      particle: {
        ...DEFAULT_PARTICLE_CONFIG,
        color: OFFICIAL_PALETTE.primary, // #2ff0d6
        density: effectiveDensity,
        size: effectiveSize,
        bloom: knobs.bloom,
        bloomRadius: effectiveBloomRadius,
        jitter: knobs.jitter,
        max: effectiveMaxParticles,
      },
    };

    const commonChrome = {
      showAxis: knobs.showAxis,
      showGrid: knobs.showGrid,
      showLegend: knobs.showLegend,
      showValues: knobs.showValues,
      legend: {
        position: "bottom" as const,
        align: "center" as const,
        fontSize: effectiveLegendFontSize,
        markerSize: effectiveLegendMarkerSize,
      },
    };

    switch (activeChartType) {
      case "bar":
        return {
          ...baseDefaults,
          ...commonChrome,
          showLegend: false,
          type: "bar",
          data: rawData,
          bar: { padding: 0.42, fade: 0.45, radius: isCompensated ? 6 : 4 },
          axis: {
            ticks: 5,
            beginAtZero: true,
            fontSize: effectiveAxisFontSize,
            xLabels: false, // Handled with Apple-style tilted labels engine
          },
          showTooltip: true,
        };

      case "bar-dual":
        return {
          ...baseDefaults,
          ...commonChrome,
          showLegend: knobs.showLegend,
          type: "bar",
          data: rawData,
          bar: {
            padding: 0.42,
            groupPadding: 0.22,
            fade: 0.45,
            radius: isCompensated ? 6 : 4,
          },
          axis: {
            ticks: 5,
            beginAtZero: true,
            fontSize: effectiveAxisFontSize,
            xLabels: false, // Handled with Apple-style tilted labels engine
          },
          legend: {
            position: "top",
            align: "start",
            interactive: true,
            fontSize: effectiveLegendFontSize,
            markerSize: effectiveLegendMarkerSize,
          },
          showTooltip: true,
        };

      case "line-area":
        return {
          ...baseDefaults,
          ...commonChrome,
          type: isAreaFill ? "area" : "line",
          data: rawData,
          line: {
            curve: "smooth",
            width: isCompensated ? 4.8 : 3.2,
            area: isAreaFill,
            areaAmount: 0.55,
            areaFade: 0.9,
            points: true,
            pointRadius: isCompensated ? 6.5 : 4.5,
          },
          axis: {
            ticks: 5,
            beginAtZero: true,
            fontSize: effectiveAxisFontSize,
            xLabels: false, // Handled with Apple-style tilted labels engine
          },
          showTooltip: true,
        };

      case "pie":
        return {
          ...baseDefaults,
          ...commonChrome,
          type: "pie",
          data: rawData,
          particle: {
            ...baseDefaults.particle,
            color: OFFICIAL_PALETTE.slices,
          },
          pie: { innerRadius: 0, padAngle: 1.2, startAngle: -90, labels: "percent" },
          axis: { fontSize: effectiveAxisFontSize },
          showTooltip: true,
        };

      case "donut":
        return {
          ...baseDefaults,
          ...commonChrome,
          type: "donut",
          data: rawData,
          particle: {
            ...baseDefaults.particle,
            color: OFFICIAL_PALETTE.slices,
          },
          pie: { innerRadius: 0.62, padAngle: 1.2, startAngle: -90, center: "total" },
          axis: { fontSize: effectiveAxisFontSize },
          showTooltip: true,
        };

      case "bubble":
        return {
          ...baseDefaults,
          ...commonChrome,
          type: "bubble",
          data: rawData,
          bubble: {
            minRadius: isCompensated ? 10 : 6,
            maxRadius: isCompensated ? 52 : 32,
            edgeFade: 0.35,
            outline: false,
          },
          axis: {
            ticks: 5,
            grid: true,
            xGrid: true,
            fontSize: effectiveAxisFontSize,
          },
          showTooltip: true,
        };

      case "radar":
        return {
          ...baseDefaults,
          ...commonChrome,
          type: "radar",
          data: rawData,
          radar: {
            levels: 4,
            shape: "polygon",
            width: isCompensated ? 4.0 : 2.8,
            fill: true,
            fillAmount: 0.55,
            fillFade: 0.3,
            points: true,
            pointRadius: isCompensated ? 6 : 4,
            startAngle: -90,
          },
          axis: { fontSize: effectiveAxisFontSize },
          showTooltip: true,
        };
    }
  }, [tabularData, activeChartType, isAreaFill, knobs, isFullscreen]);

  const handleCsvParsed = (data: TabularData, filename: string) => {
    setTabularData(data);
    setDatasetName(filename.replace(/\.csv$/i, ""));
    if (data.headers.length >= 3) {
      setActiveChartType("bar-dual");
    }
    setDataStudioTab("table");
  };

  const handleImageExtracted = (extracted: ExtractedChartData) => {
    setTabularData(extracted.data);
    setDatasetName(extracted.datasetName);
    setActiveChartType(extracted.chartType);
    setDataStudioTab("table");
  };

  const handleClear = () => {
    setTabularData({
      headers: isDualSeries
        ? ["Category", "Series 1", "Series 2"]
        : ["Category", "Value"],
      rows: isDualSeries ? [["", "", ""]] : [["", ""]],
    });
    setDatasetName("Custom Data");
    setParticleCount(null);
  };

  const handleSelectPreset = (preset: PresetTemplate) => {
    setDatasetName(preset.name);
    setTabularData(preset.data);
    setActiveChartType(preset.chartType);
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-black text-[#eef1f6] antialiased overflow-hidden selection:bg-[#2ff0d6]/30 selection:text-[#2ff0d6]">
      {/* Top Figma App Header */}
      <DashboardHeader
        datasetName={datasetName}
        onDatasetNameChange={setDatasetName}
        onReset={handleClear}
        particleCount={hasValidData ? particleCount : null}
        activeChartType={activeChartType}
        onChartTypeChange={setActiveChartType}
        chartTypes={CHART_TYPES}
        onOpenExport={() => setIsExportModalOpen(true)}
        onSelectPreset={handleSelectPreset}
      />

      {/* Main 3-Column Studio Workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Sidebar: Data Studio (Layers / Assets style) */}
        <aside className="w-80 shrink-0 border-r border-white/[0.08] bg-[#09090B] flex flex-col min-h-0 z-20">
          {/* Data Studio Header & Mode Tabs */}
          <div className="h-11 shrink-0 px-3 flex items-center justify-between border-b border-white/[0.08] bg-[#09090B]">
            <div className="flex items-center gap-1 bg-black/50 p-0.5 rounded-lg border border-white/[0.08] w-full">
              <button
                type="button"
                onClick={() => setDataStudioTab("table")}
                className={`flex-1 inline-flex items-center justify-center gap-1 py-1 text-[11px] font-medium rounded-md transition-all ${
                  dataStudioTab === "table"
                    ? "bg-[#2ff0d6] text-[#06070a] font-semibold shadow-sm shadow-[#2ff0d6]/20"
                    : "text-[#8E97A8] hover:text-white"
                }`}
              >
                <Table className="h-3 w-3" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setDataStudioTab("upload")}
                className={`flex-1 inline-flex items-center justify-center gap-1 py-1 text-[11px] font-medium rounded-md transition-all ${
                  dataStudioTab === "upload"
                    ? "bg-[#2ff0d6] text-[#06070a] font-semibold shadow-sm shadow-[#2ff0d6]/20"
                    : "text-[#8E97A8] hover:text-white"
                }`}
              >
                <Upload className="h-3 w-3" />
                <span>CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setDataStudioTab("image")}
                className={`flex-1 inline-flex items-center justify-center gap-1 py-1 text-[11px] font-medium rounded-md transition-all ${
                  dataStudioTab === "image"
                    ? "bg-[#2ff0d6] text-[#06070a] font-semibold shadow-sm shadow-[#2ff0d6]/20"
                    : "text-[#8E97A8] hover:text-white"
                }`}
              >
                <Sparkles className="h-3 w-3" />
                <span>Image AI</span>
              </button>
            </div>
          </div>

          {/* Data Studio Body */}
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            {dataStudioTab === "table" ? (
              <DataEditorTable
                data={tabularData}
                onChange={setTabularData}
                onClear={handleClear}
                isDualSeries={isDualSeries}
                datasetName={datasetName}
                onDatasetNameChange={setDatasetName}
              />
            ) : dataStudioTab === "upload" ? (
              <div className="p-4 overflow-y-auto flex-1">
                <CsvUploader onDataParsed={handleCsvParsed} />
              </div>
            ) : (
              <div className="overflow-y-auto flex-1">
                <ImageChartUploader onChartExtracted={handleImageExtracted} />
              </div>
            )}
          </div>

          {/* Bottom Sidebar Guideline Footer */}
          <div className="shrink-0 p-3 border-t border-white/[0.06] bg-[#060608] text-[11px] text-[#8E97A8] flex items-center gap-2">
            <Info className="h-3.5 w-3.5 text-[#2ff0d6] shrink-0" />
            <span className="truncate">
              {dataStudioTab === "image"
                ? "Drop or paste graph image to auto-detect & convert"
                : isDualSeries
                ? "Dual Series: Category + Series 1 & 2"
                : "Single Series: Category + Value"}
            </span>
          </div>
        </aside>

        {/* Center Viewport: The Hero Particle Stage */}
        <main
          ref={stageContainerRef}
          className={`flex-1 relative bg-black flex flex-col min-w-0 min-h-0 overflow-hidden ${
            isFullscreen ? "fixed inset-0 z-50" : ""
          }`}
        >
          {/* Subtle Ambient Glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              background:
                "radial-gradient(ellipse 65% 55% at 50% 30%, rgba(47, 240, 214, 0.12), transparent 70%)",
            }}
          />

          {/* Floating Graph Title: Centered at Top Middle & Small */}
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center max-w-[80%] select-none">
            {isEditingTitle ? (
              <div className="flex items-center gap-2 bg-black/90 border border-[#2ff0d6]/60 rounded-full px-3 py-1 backdrop-blur-md shadow-lg shadow-[#2ff0d6]/10">
                <Sparkles className="h-3 w-3 text-[#2ff0d6] shrink-0 animate-pulse" />
                <input
                  autoFocus
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveTitle();
                    if (e.key === "Escape") {
                      setTempTitle(datasetName);
                      setIsEditingTitle(false);
                    }
                  }}
                  className="bg-transparent text-xs font-medium text-white outline-none w-40 sm:w-56 text-center placeholder-[#555E6D]"
                  placeholder="Name this graph..."
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingTitle(true)}
                className="group flex items-center gap-1.5 bg-black/60 hover:bg-black/85 border border-white/10 hover:border-[#2ff0d6]/40 rounded-full px-3 py-1 backdrop-blur-md transition-all cursor-pointer shadow-md text-center"
                title="Click to rename graph"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[#2ff0d6] shadow-sm shadow-[#2ff0d6]/50 animate-pulse shrink-0" />
                <span className="text-xs font-medium text-white/90 group-hover:text-[#2ff0d6] transition-colors truncate max-w-[180px] sm:max-w-[300px]">
                  {datasetName}
                </span>
                <Pencil className="h-2.5 w-2.5 text-[#8E97A8] opacity-0 group-hover:opacity-100 group-hover:text-[#2ff0d6] transition-all ml-0.5 shrink-0" />
              </button>
            )}
          </div>

          {/* Floating Canvas Controls: Area Fill & Fullscreen */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
            {activeChartType === "line-area" && (
              <button
                type="button"
                onClick={() => setIsAreaFill(!isAreaFill)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono font-medium transition-all border shadow-lg backdrop-blur-md cursor-pointer ${
                  isAreaFill
                    ? "border-[#2ff0d6]/50 bg-[#2ff0d6]/15 text-[#2ff0d6]"
                    : "border-white/10 bg-black/60 text-[#8E97A8] hover:text-white"
                }`}
              >
                <Layers className="h-3 w-3" />
                <span>{isAreaFill ? "Area ON" : "Area OFF"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/60 px-2.5 py-1 text-xs font-medium text-[#8E97A8] hover:text-white hover:border-[#2ff0d6]/40 hover:bg-black/80 transition-all shadow-lg backdrop-blur-md cursor-pointer"
              title={
                isFullscreen
                  ? "Exit Fullscreen (ESC)"
                  : "View Graph in Fullscreen"
              }
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5 text-[#2ff0d6]" />
                  <span className="font-mono text-[11px]">Exit (ESC)</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5 text-[#2ff0d6]" />
                  <span className="font-mono text-[11px]">Fullscreen</span>
                </>
              )}
            </button>
          </div>

          {/* Main Stage: Canvas or Empty Viewport */}
          <div className="flex-1 w-full h-full relative flex items-center justify-center p-6 lg:p-10">
            {hasValidData ? (
              <ParticleChartStage
                config={chartConfig}
                onParticleCountChange={setParticleCount}
                className="w-full h-full"
                style={{ width: "100%", height: "100%", minHeight: "100%" }}
                tiltLabels={knobs.tiltLabels}
                isCompensated={isFullscreen && knobs.fullscreenScale}
              />
            ) : (
              <div className="flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl p-10 text-center max-w-md bg-white/[0.01]">
                <div className="h-12 w-12 rounded-full border border-[#2ff0d6]/30 bg-[#2ff0d6]/10 flex items-center justify-center text-[#2ff0d6] mb-3 shadow-sm shadow-[#2ff0d6]/20">
                  <Sparkles className="h-6 w-6 text-[#2ff0d6] animate-pulse" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  Empty Canvas
                </h3>
                <p className="text-xs text-[#8E97A8] leading-relaxed">
                  {isDualSeries
                    ? "Enter categories and numeric values for Series 1 and Series 2 in the Data Studio on the left to generate comparative particles."
                    : "Enter category labels and numbers in the Data Studio on the left, or drop a CSV file to generate living particles."}
                </p>
              </div>
            )}
          </div>

          {/* Figma-style Bottom Canvas Status Bar */}
          <div className="h-8 shrink-0 border-t border-white/[0.08] bg-[#09090B] px-4 flex items-center justify-between text-[11px] text-[#8E97A8] font-mono z-20 select-none">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2ff0d6]" />
                {activeChartType.toUpperCase()}
              </span>
              <span>
                Palette:{" "}
                {activeChartType === "bar-dual" ? (
                  <span className="text-white">
                    {OFFICIAL_PALETTE.primary} vs {OFFICIAL_PALETTE.secondary}
                  </span>
                ) : (
                  <span className="text-white">{OFFICIAL_PALETTE.primary}</span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {isFullscreen && (
                <span className="inline-flex items-center gap-1 text-[#2ff0d6]">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  <span>
                    {knobs.fullscreenScale
                      ? "Adaptive Fullscreen (1.85× Active)"
                      : "Fullscreen"}
                  </span>
                </span>
              )}
              <span>
                Active Rows:{" "}
                {
                  tabularData.rows.filter((r) => {
                    const v1 = typeof r[1] === "number" && Number.isFinite(r[1]);
                    const v2 = typeof r[2] === "number" && Number.isFinite(r[2]);
                    return v1 || v2;
                  }).length
                }
              </span>
              {particleCount !== null && (
                <span className="text-[#2ff0d6]">
                  ~{particleCount.toLocaleString()} Particles
                </span>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar: Figma Inspector / Tuning Knobs */}
        <aside className="w-72 shrink-0 border-l border-white/[0.08] bg-[#09090B] flex flex-col min-h-0 z-20">
          <PlaygroundKnobs
            state={knobs}
            onChange={(updated) =>
              setKnobs((prev) => ({ ...DEFAULT_PLAYGROUND_KNOBS, ...prev, ...updated }))
            }
          />
        </aside>
      </div>

      {/* Canva-Style Export Studio Modal */}
      <ExportStudioModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        datasetName={datasetName}
        activeChartType={activeChartType}
        chartConfig={chartConfig}
      />
    </div>
  );
}
