"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, RotateCcw, Download, Activity, Pencil } from "lucide-react";
import type { ChartTabKey } from "@/types/chart";

export interface ChartTypeItem {
  id: ChartTabKey;
  label: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardHeaderProps {
  datasetName: string;
  onDatasetNameChange?: (name: string) => void;
  onReset: () => void;
  particleCount: number | null;
  activeChartType: ChartTabKey;
  onChartTypeChange: (type: ChartTabKey) => void;
  chartTypes: ChartTypeItem[];
  onOpenExport: () => void;
}

export function DashboardHeader({
  datasetName,
  onDatasetNameChange,
  onReset,
  particleCount,
  activeChartType,
  onChartTypeChange,
  chartTypes,
  onOpenExport,
}: DashboardHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(datasetName);

  useEffect(() => {
    setTempName(datasetName);
  }, [datasetName]);

  const handleFinishEdit = () => {
    setIsEditing(false);
    if (tempName.trim()) {
      onDatasetNameChange?.(tempName.trim());
    } else {
      setTempName(datasetName);
    }
  };

  return (
    <header className="w-full h-14 shrink-0 flex items-center justify-between border-b border-white/[0.08] bg-[#09090B] px-4 backdrop-blur-md z-40 select-none">
      {/* Left: Brand & File/Dataset Identity */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2ff0d6]/30 bg-[#2ff0d6]/10 shadow-sm shadow-[#2ff0d6]/20">
          <Sparkles className="h-4 w-4 text-[#2ff0d6]" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-xs font-semibold tracking-tight text-white">
              Particle Studio
            </h1>
            {isEditing ? (
              <input
                autoFocus
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleFinishEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFinishEdit();
                  if (e.key === "Escape") {
                    setTempName(datasetName);
                    setIsEditing(false);
                  }
                }}
                className="bg-black/80 border border-[#2ff0d6]/50 rounded px-1.5 py-0.5 text-[9px] font-mono text-white outline-none w-32 shadow-sm"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="group flex items-center gap-1 rounded bg-white/[0.05] border border-white/10 px-1.5 py-0.5 text-[9px] font-mono text-[#8E97A8] hover:text-white hover:border-[#2ff0d6]/40 hover:bg-white/[0.08] transition-all cursor-pointer"
                title="Click to rename graph"
              >
                <span>{datasetName}</span>
                <Pencil className="h-2.5 w-2.5 opacity-40 group-hover:opacity-100 text-[#2ff0d6] transition-opacity" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Center: Figma-style Tool Dock (Chart Types) */}
      <div className="hidden md:flex items-center gap-1 rounded-xl border border-white/[0.08] bg-black/40 p-1">
        {chartTypes.map((type) => {
          const isSelected = activeChartType === type.id;
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onChartTypeChange(type.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                isSelected
                  ? "bg-[#2ff0d6] text-[#06070a] shadow-sm font-semibold shadow-[#2ff0d6]/20"
                  : "text-[#8E97A8] hover:bg-white/[0.06] hover:text-white"
              }`}
              title={type.label}
            >
              <Icon
                className={`h-3.5 w-3.5 ${
                  isSelected ? "text-[#06070a]" : "text-[#8E97A8]"
                }`}
              />
              <span className="hidden lg:inline">{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Live Stats & Export Actions */}
      <div className="flex items-center gap-2.5 min-w-[200px] justify-end">
        {particleCount !== null && (
          <div className="hidden xl:flex items-center gap-1.5 rounded-lg border border-[#2ff0d6]/30 bg-[#2ff0d6]/10 px-2.5 py-1 text-xs font-mono text-[#2ff0d6]">
            <Activity className="h-3 w-3 text-[#2ff0d6] animate-pulse" />
            <span>~{particleCount.toLocaleString()}</span>
          </div>
        )}

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-[#8E97A8] hover:text-white hover:bg-white/[0.06] transition-all"
          title="Clear all rows"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>

        <button
          type="button"
          onClick={onOpenExport}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#2ff0d6] px-3.5 py-1 text-xs font-semibold text-[#06070a] shadow-sm shadow-[#2ff0d6]/20 hover:bg-[#28d7bf] hover:shadow-[#2ff0d6]/30 active:scale-[0.98] transition-all cursor-pointer"
          title="Open Export Studio (PNG, 60fps Video, Embed)"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
}
