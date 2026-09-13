"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Download,
  Image as ImageIcon,
  Video,
  Loader2,
  Coffee,
} from "lucide-react";
import { CharticlesLogo } from "@/components/icons/CharticlesLogo";
import {
  exportChartPng,
  recordCanvasVideo,
} from "@/lib/export-engine";
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
}: ExportStudioModalProps) {
  const [activeTab, setActiveTab] = useState<"image" | "video">("image");

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md bg-[#090A0D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
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
          <div className="grid grid-cols-2 gap-1 bg-black/60 p-1 rounded-xl border border-white/[0.08]">
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
              <span>Image (PNG)</span>
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
              <span>60 FPS Video</span>
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
                          ? "bg-white/15 text-white font-semibold shadow-sm border border-white/20"
                          : "text-[#8E97A8] hover:text-white"
                      }`}
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-colors">
                  <span className="text-xs text-[#eef1f6]">Include Studio Frame Card</span>
                  <input
                    type="checkbox"
                    checked={studioFrame}
                    onChange={(e) => setStudioFrame(e.target.checked)}
                    className="h-4 w-4 rounded bg-white/10 border-white/20 text-[#2ff0d6] accent-[#2ff0d6] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-colors">
                  <span className="text-xs text-[#eef1f6]">Transparent Background</span>
                  <input
                    type="checkbox"
                    checked={transparent}
                    onChange={(e) => setTransparent(e.target.checked)}
                    className="h-4 w-4 rounded bg-white/10 border-white/20 text-[#2ff0d6] accent-[#2ff0d6] cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: 60 FPS VIDEO */}
          {activeTab === "video" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white">Loop Duration</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { sec: 4, label: "4-Second Loop" },
                    { sec: 6, label: "6-Second Loop" },
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
        </div>

        {/* Support Bar */}
        <div className="px-5 py-2.5 border-t border-white/[0.06] bg-black/40 flex items-center justify-between text-[11px] text-[#8E97A8]">
          <span>100% Free Forever • No Watermarks</span>
          <a
            href="https://buymeacoffee.com/aasim161"
            target="_blank"
            rel="noopener noreferrer"
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
        </div>
      </div>
    </div>
  );
}
