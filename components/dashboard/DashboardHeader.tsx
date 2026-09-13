"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  RotateCcw,
  Download,
  Activity,
  Pencil,
  ChevronDown,
  Layers,
  Check,
} from "lucide-react";
import type { ChartTabKey } from "@/types/chart";
import { CharticlesLogo } from "@/components/icons/CharticlesLogo";
import { PRESET_TEMPLATES, type PresetTemplate } from "@/lib/preset-templates";

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
  onSelectPreset?: (preset: PresetTemplate) => void;
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
  onSelectPreset,
}: DashboardHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(datasetName);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const presetsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempName(datasetName);
  }, [datasetName]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (presetsRef.current && !presetsRef.current.contains(e.target as Node)) {
        setIsPresetsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      {/* Left: Brand, 100% Free Badge & Editable Title */}
      <div className="flex items-center gap-3 min-w-[240px]">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#2ff0d6]/30 bg-black/80 shadow-md shadow-[#2ff0d6]/15 group transition-all">
          <CharticlesLogo className="h-5 w-5 transition-transform group-hover:scale-105" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-xs font-semibold tracking-tight text-white flex items-center gap-1.5">
              Charticles
            </h1>
            <span className="rounded-full bg-[#2ff0d6]/10 border border-[#2ff0d6]/30 px-1.5 py-0.2 text-[9px] font-mono font-medium text-[#2ff0d6] shadow-sm shadow-[#2ff0d6]/10">
              100% Free
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
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
                className="bg-black/80 border border-[#2ff0d6]/50 rounded px-1.5 py-0.5 text-[9px] font-mono text-white outline-none w-36 shadow-sm"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="group flex items-center gap-1 rounded bg-white/[0.04] border border-white/10 px-1.5 py-0.5 text-[9px] font-mono text-[#8E97A8] hover:text-white hover:border-[#2ff0d6]/40 hover:bg-white/[0.08] transition-all cursor-pointer"
                title="Click to rename graph"
              >
                <span className="truncate max-w-[130px]">{datasetName}</span>
                <Pencil className="h-2.5 w-2.5 opacity-40 group-hover:opacity-100 text-[#2ff0d6] transition-opacity shrink-0" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Center: Chart Types & Instant Presets */}
      <div className="hidden md:flex items-center gap-2">
        {/* Presets Dropdown */}
        <div className="relative" ref={presetsRef}>
          <button
            type="button"
            onClick={() => setIsPresetsOpen(!isPresetsOpen)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-[#cad2e0] hover:text-white hover:bg-white/[0.08] hover:border-[#2ff0d6]/40 transition-all cursor-pointer shadow-sm"
            title="Load ready-made demo datasets"
          >
            <Layers className="h-3.5 w-3.5 text-[#2ff0d6]" />
            <span>Templates</span>
            <ChevronDown className={`h-3 w-3 text-[#8E97A8] transition-transform ${isPresetsOpen ? "rotate-180" : ""}`} />
          </button>

          {isPresetsOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-64 rounded-xl border border-white/10 bg-[#0D0F14] p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#8E97A8] border-b border-white/[0.06] mb-1">
                Instant Presets (1-Click)
              </div>
              <div className="space-y-0.5">
                {PRESET_TEMPLATES.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      onSelectPreset?.(preset);
                      setIsPresetsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left hover:bg-white/[0.06] transition-colors cursor-pointer group"
                  >
                    <div>
                      <div className="text-white font-medium group-hover:text-[#2ff0d6] transition-colors">
                        {preset.name}
                      </div>
                      <div className="text-[10px] text-[#8E97A8]">
                        {preset.category} • {preset.chartType}
                      </div>
                    </div>
                    {datasetName === preset.name && (
                      <Check className="h-3.5 w-3.5 text-[#2ff0d6]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center: Figma-style Tool Dock (Chart Types) */}
        <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-black/40 p-1">
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
      </div>

      {/* Right: Live Stats, GitHub & Export Actions */}
      <div className="flex items-center gap-2.5 min-w-[240px] justify-end">
        {particleCount !== null && (
          <div className="hidden xl:flex items-center gap-1.5 rounded-lg border border-[#2ff0d6]/30 bg-[#2ff0d6]/10 px-2.5 py-1 text-xs font-mono text-[#2ff0d6]">
            <Activity className="h-3 w-3 text-[#2ff0d6] animate-pulse" />
            <span>~{particleCount.toLocaleString()}</span>
          </div>
        )}

        {/* GitHub Star Link */}
        <a
          href="https://github.com/aasimsaifi161/charticles"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-[#8E97A8] hover:text-white hover:bg-white/[0.06] transition-all"
          title="Star on GitHub"
        >
          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span>Star</span>
        </a>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-[#8E97A8] hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
          title="Clear all rows"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>

        <button
          type="button"
          onClick={onOpenExport}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#2ff0d6] px-3.5 py-1 text-xs font-semibold text-[#06070a] shadow-sm shadow-[#2ff0d6]/20 hover:bg-[#28d7bf] hover:shadow-[#2ff0d6]/30 active:scale-[0.98] transition-all cursor-pointer"
          title="Open Export Studio (PNG, 60fps Video)"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
}

