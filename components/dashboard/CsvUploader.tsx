"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, FileSpreadsheet } from "lucide-react";
import { parseCsv } from "@/lib/csv-parser";
import type { TabularData } from "@/types/dashboard";

interface CsvUploaderProps {
  onDataParsed: (data: TabularData, filename: string) => void;
}

export function CsvUploader({ onDataParsed }: CsvUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      setErrorMessage("Please select a valid .csv file.");
      return;
    }

    setErrorMessage(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        const result = parseCsv(content);
        if (result.error || !result.data) {
          setErrorMessage(result.error || "Failed to parse CSV file.");
        } else {
          onDataParsed(result.data, file.name);
        }
      }
    };
    reader.onerror = () => {
      setErrorMessage("Error reading file from disk.");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Drag & Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          dragActive
            ? "border-[#2ff0d6] bg-[#2ff0d6]/10 scale-[0.99]"
            : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#2ff0d6] group-hover:scale-110 transition-transform">
          <UploadCloud className="h-6 w-6" />
        </div>

        <p className="text-sm font-medium text-white">
          Click to upload or drag & drop CSV
        </p>
        <p className="mt-1 text-xs text-[#8E97A8]">
          Supports 2 columns (<code className="text-[#2ff0d6]">Category, Value</code>) or 3 columns for Dual Bar (<code className="text-[#7c4dff]">Category, Series 1, Series 2</code>)
        </p>

        {fileName && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#2ff0d6]/30 bg-[#2ff0d6]/15 px-3 py-1 text-xs font-mono text-[#2ff0d6]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Loaded: {fileName}</span>
          </div>
        )}
      </div>

      {/* Error notification */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            <strong className="font-semibold">Upload Error:</strong> {errorMessage}
          </span>
        </div>
      )}

      {/* Format Helper Card */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-3 text-xs text-[#8E97A8] space-y-2">
        <div className="flex items-center gap-1.5 text-white font-semibold">
          <FileSpreadsheet className="h-3.5 w-3.5 text-[#2ff0d6]" />
          <span>CSV Format Guidelines:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#2ff0d6] block mb-0.5">Single Series (2 Col)</span>
            <pre className="font-mono text-[10px] text-[#2ff0d6] bg-black/30 p-2 rounded">
              Category,Value&#10;Q1,45&#10;Q2,60&#10;Q3,38
            </pre>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-[#7c4dff] block mb-0.5">Dual Bar (3 Col)</span>
            <pre className="font-mono text-[10px] text-[#7c4dff] bg-black/30 p-2 rounded">
              Category,Current,Prior&#10;Q1,45,38&#10;Q2,60,48&#10;Q3,38,32
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
