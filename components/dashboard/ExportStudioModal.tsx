"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Download,
  Image as ImageIcon,
  Video,
  Sparkles,
  Layers,
  Monitor,
  Loader2,
} from "lucide-react";
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

  // Get active canvas element from the DOM
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
      }, 500);
    } catch (err) {
      console.error("Export failed:", err);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#090A0D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(47, 240, 214, 0.08)",
        }}
      >
        {/* Canva-Style Modal Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#0D0F14]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#2ff0d6]/20 to-[#7c4dff]/20 border border-[#2ff0d6]/30 flex items-center justify-center text-[#2ff0d6] shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white tracking-tight">
                  Export Studio
                </h2>
                <span className="rounded bg-[#2ff0d6]/10 border border-[#2ff0d6]/25 px-1.5 py-0.2 text-[9px] font-mono text-[#2ff0d6]">
                  Ultra HD
                </span>
              </div>
              <p className="text-[11px] text-[#8E97A8] mt-0.5">
                Export &quot;{datasetName}&quot; for presentations, social media, and web embeds
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

        {/* Canva-Style Format Selector Tabs */}
        <div className="px-5 pt-4 pb-2 border-b border-white/[0.06] flex items-center gap-2 bg-[#090A0D]">
          {[
            { id: "image", label: "PNG Image", icon: ImageIcon, badge: "Slide Decks / X" },
            { id: "video", label: "60 FPS Video", icon: Video, badge: "Living Loop" },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#2ff0d6]/40 bg-[#2ff0d6]/10 text-white shadow-sm font-semibold"
                    : "border-transparent text-[#8E97A8] hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? "text-[#2ff0d6]" : "text-[#8E97A8]"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
          {/* TAB 1: PNG IMAGE EXPORT */}
          {activeTab === "image" && (
            <div className="space-y-4">
              {/* Resolution Selection */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white flex items-center justify-between">
                  <span>Image Resolution</span>
                  <span className="text-[11px] font-mono text-[#2ff0d6]">
                    {resolution === "1x"
                      ? "1080p (Standard Web)"
                      : resolution === "2x"
                      ? "2560×1440 (Retina / Keynote)"
                      : "3840×2160 (4K Ultra HD)"}
                  </span>
                </label>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: "1x", label: "1x Web", desc: "Fast & lightweight" },
                    { id: "2x", label: "2x Retina", desc: "Presentations & Pitch" },
                    { id: "4k", label: "4K Ultra HD", desc: "Lossless Print / 4K" },
                  ].map((res) => (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => setResolution(res.id as typeof resolution)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        resolution === res.id
                          ? "border-[#2ff0d6] bg-[#2ff0d6]/10 text-white shadow-sm"
                          : "border-white/10 bg-white/[0.02] text-[#8E97A8] hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-semibold">{res.label}</div>
                      <div className="text-[10px] text-[#8E97A8] mt-0.5">{res.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles: Studio Frame & Background */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {/* Studio Frame Toggle */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-colors">
                  <div className="flex flex-col pr-2">
                    <span className="text-xs font-medium text-white">Studio Frame</span>
                    <span className="text-[10px] text-[#8E97A8] mt-0.5">
                      Card border, title & glow
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={studioFrame}
                    onChange={(e) => setStudioFrame(e.target.checked)}
                    className="h-4 w-4 rounded bg-white/10 border-white/20 text-[#2ff0d6] accent-[#2ff0d6] cursor-pointer"
                  />
                </label>

                {/* Transparent Background Toggle */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-colors">
                  <div className="flex flex-col pr-2">
                    <span className="text-xs font-medium text-white">Transparent</span>
                    <span className="text-[10px] text-[#8E97A8] mt-0.5">
                      Remove black background
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={transparent}
                    onChange={(e) => setTransparent(e.target.checked)}
                    className="h-4 w-4 rounded bg-white/10 border-white/20 text-[#2ff0d6] accent-[#2ff0d6] cursor-pointer"
                  />
                </label>
              </div>

              {/* Export Summary Banner */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between text-xs text-[#8E97A8]">
                <span>Format: <strong className="text-white font-mono">PNG (Lossless)</strong></span>
                <span>Title: <strong className="text-white font-mono">{datasetName}</strong></span>
                <span>Framing: <strong className="text-[#2ff0d6]">{studioFrame ? "Studio Card" : "Clean Canvas"}</strong></span>
              </div>
            </div>
          )}

          {/* TAB 2: 60 FPS VIDEO EXPORT */}
          {activeTab === "video" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-white flex items-center justify-between">
                  <span>Loop Duration</span>
                  <span className="text-[11px] font-mono text-[#2ff0d6]">
                    Native GPU 60 FPS Stream
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { sec: 4, label: "4 Seconds Loop", desc: "Ideal for Twitter/X & Slack" },
                    { sec: 6, label: "6 Seconds Loop", desc: "Extended motion for web & decks" },
                  ].map((dur) => (
                    <button
                      key={dur.sec}
                      type="button"
                      onClick={() => setDuration(dur.sec)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        duration === dur.sec
                          ? "border-[#2ff0d6] bg-[#2ff0d6]/10 text-white shadow-sm"
                          : "border-white/10 bg-white/[0.02] text-[#8E97A8] hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-semibold">{dur.label}</div>
                      <div className="text-[10px] text-[#8E97A8] mt-0.5">{dur.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Quality Specs */}
              <div className="p-4 rounded-xl border border-white/[0.08] bg-black/40 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#8E97A8]">
                  <span>Frame Rate:</span>
                  <span className="font-mono text-white font-semibold">60.0 FPS Constant</span>
                </div>
                <div className="flex items-center justify-between text-[#8E97A8]">
                  <span>Encoder:</span>
                  <span className="font-mono text-white">WebM (VP9 High Profile)</span>
                </div>
                <div className="flex items-center justify-between text-[#8E97A8]">
                  <span>Bitrate:</span>
                  <span className="font-mono text-[#2ff0d6]">14.0 Mbps (Preserves Bloom Glow)</span>
                </div>
              </div>

              {/* Recording Progress Bar (if recording) */}
              {recordingProgress !== null && (
                <div className="space-y-1.5 p-3 rounded-xl bg-[#2ff0d6]/10 border border-[#2ff0d6]/30">
                  <div className="flex items-center justify-between text-xs font-mono text-[#2ff0d6]">
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Recording GPU Canvas Stream...
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

        {/* Canva-Style Modal Footer */}
        <div className="p-4 px-6 border-t border-white/[0.08] bg-[#0D0F14] flex items-center justify-between">
          <div className="text-xs text-[#8E97A8] flex items-center gap-1.5">
            {statusMessage && (
              <span className="text-[#2ff0d6] flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                {statusMessage}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#8E97A8] hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              Cancel
            </button>

            {activeTab === "image" && (
              <button
                type="button"
                onClick={handleExportImage}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2ff0d6] to-[#2ff0d6]/90 hover:brightness-110 px-5 py-2 text-xs font-semibold text-[#06070a] shadow-lg shadow-[#2ff0d6]/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
                <span>Download {resolution.toUpperCase()} PNG</span>
              </button>
            )}

            {activeTab === "video" && (
              <button
                type="button"
                onClick={handleRecordVideo}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2ff0d6] to-[#7c4dff] hover:brightness-110 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-[#2ff0d6]/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Video className="h-3.5 w-3.5" />
                )}
                <span>{isProcessing ? "Recording Video..." : `Record ${duration}s Loop (60 FPS)`}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
