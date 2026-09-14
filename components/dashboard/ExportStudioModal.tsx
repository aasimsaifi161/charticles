"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Download,
  Image as ImageIcon,
  Video,
  Loader2,
  Coffee,
  Code2,
  Copy,
  Check,
  Terminal,
} from "lucide-react";
import { CharticlesLogo } from "@/components/icons/CharticlesLogo";
import {
  exportChartPng,
  recordCanvasVideo,
} from "@/lib/export-engine";
import { generateReactComponent } from "@/lib/code-generator";
import { trackEvent } from "@/lib/analytics";
import type { ChartOptions } from "particle-charts";

interface ExportStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasetName: string;
  activeChartType: string;
  chartConfig?: ChartOptions;
}

export function ExportStudioModal({
  isOpen,
  onClose,
  datasetName,
  activeChartType,
  chartConfig,
}: ExportStudioModalProps) {
  const [activeTab, setActiveTab] = useState<"image" | "video" | "code">("image");
  const [hasCopied, setHasCopied] = useState(false);
  const [hasCopiedInstall, setHasCopiedInstall] = useState(false);

  // Image Export Settings
  const [resolution, setResolution] = useState<"1x" | "2x" | "4k">("2x");
  const [transparent, setTransparent] = useState(false);
  const [studioFrame, setStudioFrame] = useState(true);

  // Video Export Settings
  const [duration, setDuration] = useState<number>(4);
  const [recordingProgress, setRecordingProgress] = useState<number | null>(null);

  // General Loading & Status
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  const getCanvas = (): HTMLCanvasElement | null => {
    return document.querySelector<HTMLCanvasElement>(".pchart-canvas");
  };

  const handleExportImage = async () => {
    const canvas = getCanvas();
    if (!canvas) {
      alert("Chart canvas not found. Please ensure the chart is rendered.");
      return;
    }

    try {
      setIsProcessing(true);
      setStatusMessage(`Rendering ${resolution.toUpperCase()} PNG...`);
      await exportChartPng({
        canvas,
        title: datasetName,
        resolution,
        transparent,
        studioFrame,
        activeChartType,
      });
      trackEvent("chart_exported", {
        format: "png",
        resolution,
        studioFrame,
        chartType: activeChartType,
      });
      setTimeout(() => {
        setIsProcessing(false);
        setStatusMessage(null);
        onClose();
      }, 300);
    } catch (err) {
      console.error("PNG export failed:", err);
      setIsProcessing(false);
      setStatusMessage("Export failed.");
    }
  };

  const handleRecordVideo = async () => {
    const canvas = getCanvas();
    if (!canvas) {
      alert("Chart canvas not found. Please ensure the chart is rendered.");
      return;
    }

    try {
      setIsProcessing(true);
      setRecordingProgress(0);
      setStatusMessage(`Recording ${duration}s GPU stream at 60 FPS...`);

      await recordCanvasVideo({
        canvas,
        title: datasetName,
        durationSeconds: duration,
        onProgress: (pct) => {
          setRecordingProgress(pct);
        },
      });

      trackEvent("chart_exported", {
        format: "webm",
        duration,
        fps: 60,
        chartType: activeChartType,
      });

      setIsProcessing(false);
      setRecordingProgress(null);
      setStatusMessage(null);
      onClose();
    } catch (err) {
      console.error("Video recording failed:", err);
      setIsProcessing(false);
      setRecordingProgress(null);
      setStatusMessage("Video recording failed.");
    }
  };

  const getGeneratedSnippet = () => {
    if (!chartConfig) return "// Configure your chart in the studio to generate code";
    const sanitizedName =
      (datasetName || "Chart")
        .replace(/[^a-zA-Z0-9]/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("") || "LivingParticleChart";
    return generateReactComponent(
      chartConfig,
      sanitizedName.endsWith("Chart") ? sanitizedName : `${sanitizedName}Chart`
    );
  };

  const handleCopyCode = async () => {
    try {
      const snippet = getGeneratedSnippet();
      await navigator.clipboard.writeText(snippet);
      setHasCopied(true);
      trackEvent("chart_exported", {
        format: "react_component",
        chartType: activeChartType,
      });
      setTimeout(() => setHasCopied(false), 2200);
    } catch (err) {
      console.error("Failed to copy snippet:", err);
    }
  };

  const handleCopyInstall = async () => {
    try {
      await navigator.clipboard.writeText("npm install particle-charts");
      setHasCopiedInstall(true);
      setTimeout(() => setHasCopiedInstall(false), 2000);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className={`relative w-full ${
          activeTab === "code" ? "max-w-lg" : "max-w-md"
        } bg-[#090A0D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-150`}
        style={{
          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 30px rgba(47, 240, 214, 0.08)",
        }}
      >
        {/* Sleek Header */}
        <div className="p-4 px-5 border-b border-white/[0.08] flex items-center justify-between bg-[#0D0F14]">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg border border-[#2ff0d6]/30 bg-black/80 flex items-center justify-center">
              <CharticlesLogo className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-white tracking-tight">
                Export Chart
              </h2>
              <p className="text-[10px] text-[#8E97A8]">
                {datasetName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="h-7 w-7 rounded-lg text-[#8E97A8] hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="p-2 border-b border-white/[0.06] bg-[#0A0B0E]">
          <div className="grid grid-cols-3 gap-1 bg-black/60 p-1 rounded-xl border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setActiveTab("image")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "image"
                  ? "bg-[#2ff0d6] text-[#06070a] font-semibold shadow-sm shadow-[#2ff0d6]/20"
                  : "text-[#8E97A8] hover:text-white"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Image</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("video")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "video"
                  ? "bg-[#2ff0d6] text-[#06070a] font-semibold shadow-sm shadow-[#2ff0d6]/20"
                  : "text-[#8E97A8] hover:text-white"
              }`}
            >
              <Video className="h-3.5 w-3.5" />
              <span>Video</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "code"
                  ? "bg-[#2ff0d6] text-[#06070a] font-semibold shadow-sm shadow-[#2ff0d6]/20"
                  : "text-[#8E97A8] hover:text-white"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>React / Next.js</span>
            </button>
          </div>
        </div>

        {/* Modal Body - Simple & High Signal */}
        <div className="p-5 space-y-4">
          {/* TAB 1: PNG IMAGE */}
          {activeTab === "image" && (
            <div className="space-y-4">
              {/* Resolution Pills */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white">Resolution</label>
                <div className="grid grid-cols-3 gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10">
                  {(
                    [
                      { id: "1x", label: "1x Web" },
                      { id: "2x", label: "2x Retina" },
                      { id: "4k", label: "4K UHD" },
                    ] as const
                  ).map((res) => (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => setResolution(res.id)}
                      className={`py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        resolution === res.id
                          ? "bg-[#2ff0d6] text-[#06070a] font-semibold shadow-sm"
                          : "text-[#8E97A8] hover:text-white"
                      }`}
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-1 border-t border-white/[0.06]">
                <label className="flex items-center justify-between text-xs text-[#8E97A8] cursor-pointer hover:text-white py-1">
                  <span>Studio Presentation Frame</span>
                  <input
                    type="checkbox"
                    checked={studioFrame}
                    onChange={(e) => setStudioFrame(e.target.checked)}
                    className="rounded border-white/20 bg-black accent-[#2ff0d6] h-4 w-4 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-[#8E97A8] cursor-pointer hover:text-white py-1">
                  <span>Transparent Background</span>
                  <input
                    type="checkbox"
                    checked={transparent}
                    onChange={(e) => setTransparent(e.target.checked)}
                    className="rounded border-white/20 bg-black accent-[#2ff0d6] h-4 w-4 cursor-pointer"
                  />
                </label>
              </div>

              {/* Status or Progress Feedback */}
              {statusMessage && (
                <div className="flex items-center gap-2 text-xs font-mono text-[#2ff0d6] bg-[#2ff0d6]/10 p-2.5 rounded-xl border border-[#2ff0d6]/20 animate-pulse">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>{statusMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 60 FPS VIDEO */}
          {activeTab === "video" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white">Loop Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { sec: 3, label: "3 Seconds" },
                    { sec: 4, label: "4 Seconds" },
                    { sec: 6, label: "6 Seconds" },
                  ].map((dur) => (
                    <button
                      key={dur.sec}
                      type="button"
                      onClick={() => setDuration(dur.sec)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                        duration === dur.sec
                          ? "border-[#2ff0d6] bg-[#2ff0d6]/10 text-white shadow-sm font-semibold"
                          : "border-white/10 bg-white/[0.02] text-[#8E97A8] hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-[#8E97A8] bg-black/40 p-3 rounded-xl border border-white/[0.06] text-center">
                Records a smooth 60 FPS video loop directly from the GPU canvas.
              </div>

              {/* Recording Progress Bar */}
              {recordingProgress !== null && (
                <div className="space-y-1.5 p-3 rounded-xl bg-[#2ff0d6]/10 border border-[#2ff0d6]/30">
                  <div className="flex items-center justify-between text-xs font-mono text-[#2ff0d6]">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Recording 60 FPS Canvas...
                    </span>
                    <span>{recordingProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2ff0d6] transition-all duration-100 ease-out"
                      style={{ width: `${recordingProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REACT / NEXT.JS COMPONENT */}
          {activeTab === "code" && (
            <div className="space-y-3.5">
              {/* Header Label */}
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-white">React / Next.js Component</label>
                <span className="text-[10px] text-[#2ff0d6] font-mono">React 18 & 19 • Next.js 14+</span>
              </div>

              {/* Install Command Pill */}
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-black/70 border border-white/10 text-xs font-mono text-[#8E97A8]">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Terminal className="h-3.5 w-3.5 text-[#2ff0d6] shrink-0" />
                  <span className="truncate text-white select-all">npm install particle-charts</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyInstall}
                  className="shrink-0 text-[#8E97A8] hover:text-[#2ff0d6] p-1 rounded transition-colors cursor-pointer"
                  title="Copy install command"
                >
                  {hasCopiedInstall ? (
                    <Check className="h-3.5 w-3.5 text-[#2ff0d6]" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              {/* Code Preview Box */}
              <div className="relative rounded-xl border border-white/10 bg-black/80 p-3 font-mono text-[11px] leading-relaxed text-[#cad2e0] overflow-hidden">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-[10px] text-[#8E97A8]">
                  <span className="font-mono text-[#2ff0d6]">LivingParticleChart.tsx</span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1 text-[#2ff0d6] hover:underline cursor-pointer"
                  >
                    {hasCopied ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy snippet</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="max-h-52 overflow-y-auto overflow-x-auto text-[10.5px] leading-relaxed scrollbar-thin scrollbar-thumb-white/10">
                  <code>{getGeneratedSnippet()}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Support Bar */}
        <div className="px-5 py-2.5 border-t border-white/[0.06] bg-black/40 flex items-center justify-between text-[11px] text-[#8E97A8]">
          <span>100% Free Forever • No Watermarks</span>
          <a
            href="https://buymeacoffee.com/aasim161"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("support_clicked", { location: "export_modal", target: "coffee" })}
            className="text-[#FFDD00] hover:text-[#ffea55] inline-flex items-center gap-1.5 font-medium transition-colors"
          >
            <Coffee className="h-3 w-3" />
            <span>Buy creator a coffee</span>
          </a>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 px-5 border-t border-white/[0.08] bg-[#0D0F14] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-3 py-1.5 rounded-lg text-xs text-[#8E97A8] hover:text-white transition-all cursor-pointer"
          >
            Cancel
          </button>

          {activeTab === "image" && (
            <button
              type="button"
              onClick={handleExportImage}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2ff0d6] hover:bg-[#28d7bf] px-4 py-2 text-xs font-semibold text-[#06070a] shadow-md shadow-[#2ff0d6]/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span>Download PNG</span>
            </button>
          )}

          {activeTab === "video" && (
            <button
              type="button"
              onClick={handleRecordVideo}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2ff0d6] hover:bg-[#28d7bf] px-4 py-2 text-xs font-semibold text-[#06070a] shadow-md shadow-[#2ff0d6]/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Video className="h-3.5 w-3.5" />
              )}
              <span>{isProcessing ? "Recording..." : `Record Video Loop`}</span>
            </button>
          )}

          {activeTab === "code" && (
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2ff0d6] hover:bg-[#28d7bf] px-4 py-2 text-xs font-semibold text-[#06070a] shadow-md shadow-[#2ff0d6]/25 active:scale-[0.98] transition-all cursor-pointer"
            >
              {hasCopied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy React Component</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
