"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  UploadCloud,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileImage,
  RefreshCw,
} from "lucide-react";
import type { ExtractedChartData } from "@/types/dashboard";

interface ImageChartUploaderProps {
  onChartExtracted: (data: ExtractedChartData) => void;
}

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

  return (
    <div className="w-full flex flex-col space-y-4 p-4 text-xs font-mono select-none">
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
