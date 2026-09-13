"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  UploadCloud,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileImage,
  RefreshCw,
  Zap,
  BarChart3,
  LineChart,
  PieChart,
} from "lucide-react";
import type { ExtractedChartData } from "@/types/dashboard";

interface ImageChartUploaderProps {
  onChartExtracted: (data: ExtractedChartData) => void;
}

// Built-in Demo Sample Charts (SVG Data URLs)
const DEMO_PRESETS: Array<{
  name: string;
  icon: typeof BarChart3;
  type: "bar" | "line-area" | "donut";
  title: string;
  svgDataUrl: string;
  fallbackResult: ExtractedChartData;
}> = [
  {
    name: "Bar Chart",
    icon: BarChart3,
    type: "bar",
    title: "Quarterly Revenue",
    svgDataUrl:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240" style="background:#0a0a0f;">
        <rect x="50" y="140" width="45" height="60" rx="4" fill="#2ff0d6"/>
        <rect x="135" y="70" width="45" height="130" rx="4" fill="#2ff0d6"/>
        <rect x="220" y="105" width="45" height="95" rx="4" fill="#2ff0d6"/>
        <rect x="305" y="40" width="45" height="160" rx="4" fill="#2ff0d6"/>
        <line x1="30" y1="200" x2="370" y2="200" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.3"/>
        <text x="72" y="220" fill="#8E97A8" font-size="12" font-family="sans-serif" text-anchor="middle">Q1</text>
        <text x="157" y="220" fill="#8E97A8" font-size="12" font-family="sans-serif" text-anchor="middle">Q2</text>
        <text x="242" y="220" fill="#8E97A8" font-size="12" font-family="sans-serif" text-anchor="middle">Q3</text>
        <text x="327" y="220" fill="#8E97A8" font-size="12" font-family="sans-serif" text-anchor="middle">Q4</text>
        <text x="72" y="130" fill="#ffffff" font-size="11" font-family="sans-serif" text-anchor="middle">45k</text>
        <text x="157" y="60" fill="#ffffff" font-size="11" font-family="sans-serif" text-anchor="middle">98k</text>
        <text x="242" y="95" fill="#ffffff" font-size="11" font-family="sans-serif" text-anchor="middle">72k</text>
        <text x="327" y="30" fill="#ffffff" font-size="11" font-family="sans-serif" text-anchor="middle">120k</text>
        <text x="200" y="22" fill="#ffffff" font-size="13" font-weight="bold" font-family="sans-serif" text-anchor="middle">Quarterly Revenue Growth</text>
      </svg>`),
    fallbackResult: {
      chartType: "bar",
      datasetName: "Quarterly Revenue Growth",
      data: {
        headers: ["Quarter", "Revenue (k)"],
        rows: [
          ["Q1", 45],
          ["Q2", 98],
          ["Q3", 72],
          ["Q4", 120],
        ],
      },
    },
  },
  {
    name: "Line Trend",
    icon: LineChart,
    type: "line-area",
    title: "User Traffic",
    svgDataUrl:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240" style="background:#0a0a0f;">
        <path d="M50 170 Q130 140 200 90 T350 40" fill="none" stroke="#2ff0d6" stroke-width="3"/>
        <circle cx="50" cy="170" r="5" fill="#2ff0d6"/>
        <circle cx="125" cy="142" r="5" fill="#2ff0d6"/>
        <circle cx="200" cy="90" r="5" fill="#2ff0d6"/>
        <circle cx="275" cy="65" r="5" fill="#2ff0d6"/>
        <circle cx="350" cy="40" r="5" fill="#2ff0d6"/>
        <line x1="30" y1="200" x2="370" y2="200" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.3"/>
        <text x="50" y="220" fill="#8E97A8" font-size="11" font-family="sans-serif" text-anchor="middle">Jan</text>
        <text x="125" y="220" fill="#8E97A8" font-size="11" font-family="sans-serif" text-anchor="middle">Feb</text>
        <text x="200" y="220" fill="#8E97A8" font-size="11" font-family="sans-serif" text-anchor="middle">Mar</text>
        <text x="275" y="220" fill="#8E97A8" font-size="11" font-family="sans-serif" text-anchor="middle">Apr</text>
        <text x="350" y="220" fill="#8E97A8" font-size="11" font-family="sans-serif" text-anchor="middle">May</text>
        <text x="200" y="22" fill="#ffffff" font-size="13" font-weight="bold" font-family="sans-serif" text-anchor="middle">Active Users Trend</text>
      </svg>`),
    fallbackResult: {
      chartType: "line-area",
      datasetName: "Active Users Trend",
      data: {
        headers: ["Month", "Users"],
        rows: [
          ["Jan", 15],
          ["Feb", 32],
          ["Mar", 58],
          ["Apr", 84],
          ["May", 112],
        ],
      },
    },
  },
  {
    name: "Donut / Share",
    icon: PieChart,
    type: "donut",
    title: "Market Share",
    svgDataUrl:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240" style="background:#0a0a0f;">
        <circle cx="200" cy="120" r="70" fill="none" stroke="#2ff0d6" stroke-width="28" stroke-dasharray="220 220" stroke-dashoffset="0"/>
        <circle cx="200" cy="120" r="70" fill="none" stroke="#7c4dff" stroke-width="28" stroke-dasharray="120 320" stroke-dashoffset="-220"/>
        <circle cx="200" cy="120" r="70" fill="none" stroke="#ff5c8a" stroke-width="28" stroke-dasharray="100 340" stroke-dashoffset="-340"/>
        <text x="200" y="115" fill="#ffffff" font-size="18" font-weight="bold" font-family="sans-serif" text-anchor="middle">100%</text>
        <text x="200" y="132" fill="#8E97A8" font-size="10" font-family="sans-serif" text-anchor="middle">Market</text>
        <text x="200" y="24" fill="#ffffff" font-size="13" font-weight="bold" font-family="sans-serif" text-anchor="middle">Global Market Share</text>
      </svg>`),
    fallbackResult: {
      chartType: "donut",
      datasetName: "Global Market Share",
      data: {
        headers: ["Platform", "Share"],
        rows: [
          ["Product A", 50],
          ["Product B", 28],
          ["Product C", 22],
        ],
      },
    },
  },
];

export function ImageChartUploader({ onChartExtracted }: ImageChartUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImageBase64 = useCallback(
    async (base64Data: string, mimeType: string, filename = "Uploaded Graph") => {
      setIsAnalyzing(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      setPreviewUrl(base64Data);

      try {
        const res = await fetch("/api/parse-chart-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageBase64: base64Data,
            mimeType,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setErrorMessage(data.message || "Failed to parse chart image.");
          setIsAnalyzing(false);
          return;
        }

        const result: ExtractedChartData = data.result;
        setSuccessMessage(
          `Extracted ${result.data.rows.length} data rows (${result.chartType.toUpperCase()})`
        );
        onChartExtracted(result);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Error communicating with Vision AI service."
        );
      } finally {
        setIsAnalyzing(false);
      }
    },
    [onChartExtracted]
  );

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        processImageBase64(result, file.type, file.name);
      }
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read image from disk.");
    };
    reader.readAsDataURL(file);
  };

  // Clipboard Paste Support (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            handleFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [processImageBase64]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  // Instant Demo Preset Runner
  const handleDemoPreset = (preset: typeof DEMO_PRESETS[0]) => {
    setPreviewUrl(preset.svgDataUrl);
    setErrorMessage(null);
    processImageBase64(preset.svgDataUrl, "image/svg+xml", preset.title);
  };

  return (
    <div className="w-full flex flex-col space-y-4 p-4 text-xs font-mono select-none">
      {/* 1-Click Quick Demo Presets */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-[#8E97A8]">
          <span className="flex items-center gap-1.5 uppercase font-semibold tracking-wider">
            <Zap className="h-3 w-3 text-[#2ff0d6]" />
            Quick Test Charts
          </span>
          <span className="text-[10px] text-white/40">1-click demo</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {DEMO_PRESETS.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleDemoPreset(preset)}
                disabled={isAnalyzing}
                className="flex flex-col items-center justify-center p-2 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-[#2ff0d6]/40 transition-all text-left group cursor-pointer disabled:opacity-50"
              >
                <Icon className="h-4 w-4 text-[#2ff0d6] mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] text-white/90 font-medium truncate w-full text-center">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Drag & Drop / Paste Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isAnalyzing && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer overflow-hidden ${
          dragActive
            ? "border-[#2ff0d6] bg-[#2ff0d6]/10 scale-[0.99]"
            : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
        } ${isAnalyzing ? "cursor-wait pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        {/* Preview with Scanning Laser Line when analyzing */}
        {previewUrl ? (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10 bg-black/60 mb-3 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Chart preview"
              className={`max-h-full max-w-full object-contain ${
                isAnalyzing ? "brightness-75 contrast-125" : ""
              }`}
            />

            {/* Neon Cyan Laser Sweep Animation */}
            {isAnalyzing && (
              <div
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#2ff0d6] to-transparent shadow-[0_0_15px_#2ff0d6] animate-[scan_1.5s_ease-in-out_infinite]"
                style={{
                  animation: "scan 1.5s ease-in-out infinite",
                }}
              />
            )}
          </div>
        ) : (
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#2ff0d6] group-hover:scale-110 transition-transform">
            <UploadCloud className="h-5 w-5" />
          </div>
        )}

        <div className="space-y-1">
          <p className="text-xs font-semibold text-white flex items-center justify-center gap-1.5">
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 text-[#2ff0d6] animate-spin" />
                <span>Scanning Graph with Vision AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-[#2ff0d6]" />
                <span>Upload Chart or Paste (Ctrl+V)</span>
              </>
            )}
          </p>
          <p className="text-[11px] text-[#8E97A8]">
            {isAnalyzing
              ? "Extracting categories, scales & numerical values"
              : "Drop screenshot, paste from clipboard, or click"}
          </p>
        </div>

        {/* Keyboard Shortcut Badge */}
        <div className="mt-3 inline-flex items-center gap-1 rounded bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 text-[10px] text-[#8E97A8]">
          <span>Tip: Press</span>
          <kbd className="rounded bg-black/80 px-1 py-0.5 text-white font-semibold">Ctrl+V</kbd>
          <span>to paste screenshot</span>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-[#2ff0d6]/30 bg-[#2ff0d6]/10 p-2.5 text-[11px] text-[#2ff0d6]">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="truncate">{successMessage}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-[11px] text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}



      <style jsx>{`
        @keyframes scan {
          0% {
            top: 0%;
            opacity: 0.8;
          }
          50% {
            top: 96%;
            opacity: 1;
          }
          100% {
            top: 0%;
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
