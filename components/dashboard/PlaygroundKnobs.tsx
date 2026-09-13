"use client";

import React from "react";
import {
  Sliders,
  RotateCcw,
  Layers,
  CircleDot,
  Sun,
  Activity,
  Eye,
  Palette,
  Maximize2,
  Monitor,
} from "lucide-react";
import {
  type PlaygroundKnobsState,
  DEFAULT_PLAYGROUND_KNOBS,
} from "@/types/dashboard";
import { OFFICIAL_PALETTE } from "@/lib/theme";

interface PlaygroundKnobsProps {
  state: PlaygroundKnobsState;
  onChange: (updated: PlaygroundKnobsState) => void;
}

export function PlaygroundKnobs({ state, onChange }: PlaygroundKnobsProps) {
  // Ensure all knobs are strictly defined with defaults so inputs are never uncontrolled
  const safeState: PlaygroundKnobsState = {
    ...DEFAULT_PLAYGROUND_KNOBS,
    ...state,
  };

  const updateField = <K extends keyof PlaygroundKnobsState>(
    field: K,
    value: PlaygroundKnobsState[K]
  ) => {
    onChange({
      ...safeState,
      [field]: value,
    });
  };

  const handleReset = () => {
    onChange({ ...DEFAULT_PLAYGROUND_KNOBS });
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#09090B] text-[#eef1f6] select-none">
      {/* Inspector Panel Title */}
      <div className="h-11 shrink-0 px-4 flex items-center justify-between border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Sliders className="h-3.5 w-3.5 text-[#2ff0d6]" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8E97A8]">
            Inspector / Physics
          </span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8E97A8] hover:text-white transition-colors"
          title="Reset physics parameters"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Scrollable Inspector Body */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/[0.06]">
        {/* Section 1: Particle Dynamics */}
        <div className="p-4 space-y-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#8E97A8] font-semibold">
            Particle Dynamics
          </div>

          {/* Density */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="knob-density"
                className="inline-flex items-center gap-1.5 text-[#8E97A8]"
              >
                <Layers className="h-3 w-3 text-[#2ff0d6]" />
                <span>Density</span>
              </label>
              <span className="font-mono text-white text-[11px] bg-white/[0.04] px-1.5 py-0.5 rounded">
                {(safeState.density ?? DEFAULT_PLAYGROUND_KNOBS.density).toFixed(1)}
              </span>
            </div>
            <input
              id="knob-density"
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={safeState.density ?? DEFAULT_PLAYGROUND_KNOBS.density}
              onChange={(e) =>
                updateField("density", parseFloat(e.target.value))
              }
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2ff0d6]"
            />
          </div>

          {/* Particle Size */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="knob-size"
                className="inline-flex items-center gap-1.5 text-[#8E97A8]"
              >
                <CircleDot className="h-3 w-3 text-[#2ff0d6]" />
                <span>Particle Size</span>
              </label>
              <span className="font-mono text-white text-[11px] bg-white/[0.04] px-1.5 py-0.5 rounded">
                {(safeState.size ?? DEFAULT_PLAYGROUND_KNOBS.size).toFixed(2)}px
              </span>
            </div>
            <input
              id="knob-size"
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={safeState.size ?? DEFAULT_PLAYGROUND_KNOBS.size}
              onChange={(e) => updateField("size", parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2ff0d6]"
            />
          </div>

          {/* Bloom */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="knob-bloom"
                className="inline-flex items-center gap-1.5 text-[#8E97A8]"
              >
                <Sun className="h-3 w-3 text-[#2ff0d6]" />
                <span>Glow / Bloom</span>
              </label>
              <span className="font-mono text-white text-[11px] bg-white/[0.04] px-1.5 py-0.5 rounded">
                {Math.round((safeState.bloom ?? DEFAULT_PLAYGROUND_KNOBS.bloom) * 100)}%
              </span>
            </div>
            <input
              id="knob-bloom"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={safeState.bloom ?? DEFAULT_PLAYGROUND_KNOBS.bloom}
              onChange={(e) => updateField("bloom", parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2ff0d6]"
            />
          </div>

          {/* Jitter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="knob-jitter"
                className="inline-flex items-center gap-1.5 text-[#8E97A8]"
              >
                <Activity className="h-3 w-3 text-[#2ff0d6]" />
                <span>Thermal Jitter</span>
              </label>
              <span className="font-mono text-white text-[11px] bg-white/[0.04] px-1.5 py-0.5 rounded">
                {(safeState.jitter ?? DEFAULT_PLAYGROUND_KNOBS.jitter).toFixed(1)}
              </span>
            </div>
            <input
              id="knob-jitter"
              type="range"
              min="0"
              max="3"
              step="0.2"
              value={safeState.jitter ?? DEFAULT_PLAYGROUND_KNOBS.jitter}
              onChange={(e) =>
                updateField("jitter", parseFloat(e.target.value))
              }
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2ff0d6]"
            />
          </div>

          {/* Graph Internal Padding */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="knob-padding"
                className="inline-flex items-center gap-1.5 text-[#8E97A8]"
              >
                <Maximize2 className="h-3 w-3 text-[#2ff0d6]" />
                <span>Graph Padding</span>
              </label>
              <span className="font-mono text-white text-[11px] bg-white/[0.04] px-1.5 py-0.5 rounded">
                {safeState.chartPadding ?? DEFAULT_PLAYGROUND_KNOBS.chartPadding}px
              </span>
            </div>
            <input
              id="knob-padding"
              type="range"
              min="16"
              max="96"
              step="2"
              value={safeState.chartPadding ?? DEFAULT_PLAYGROUND_KNOBS.chartPadding}
              onChange={(e) =>
                updateField("chartPadding", parseInt(e.target.value, 10))
              }
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2ff0d6]"
            />
          </div>
        </div>

        {/* Section 2: Chrome Visibility */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#8E97A8] font-semibold">
            <Eye className="h-3 w-3 text-[#2ff0d6]" />
            <span>Display Chrome</span>
          </div>

          <div className="space-y-2">
            {[
              { id: "showAxis", label: "Axes & Baseline", val: Boolean(safeState.showAxis) },
              { id: "showGrid", label: "Grid Lines", val: Boolean(safeState.showGrid) },
              { id: "tiltLabels", label: "Tilt X Labels (Apple Style)", val: Boolean(safeState.tiltLabels) },
              { id: "showLegend", label: "Series Legend", val: Boolean(safeState.showLegend) },
              { id: "showValues", label: "Value Labels", val: Boolean(safeState.showValues) },
            ].map((toggle) => (
              <label
                key={toggle.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.03] cursor-pointer transition-colors"
              >
                <span className="text-xs text-[#8E97A8]">{toggle.label}</span>
                <input
                  type="checkbox"
                  checked={Boolean(toggle.val)}
                  onChange={(e) =>
                    updateField(
                      toggle.id as keyof PlaygroundKnobsState,
                      e.target.checked
                    )
                  }
                  className="rounded bg-white/10 border-white/20 text-[#2ff0d6] focus:ring-0 focus:ring-offset-0 h-4 w-4 accent-[#2ff0d6]"
                />
              </label>
            ))}
          </div>

          {/* Adaptive Fullscreen Scaling */}
          <div className="pt-2 border-t border-white/[0.06]">
            <label className="flex items-start justify-between p-2 rounded-lg hover:bg-white/[0.03] cursor-pointer transition-colors">
              <div className="flex flex-col pr-2">
                <span className="text-xs text-white flex items-center gap-1.5">
                  <Monitor className="h-3 w-3 text-[#2ff0d6]" />
                  Adaptive Fullscreen
                </span>
                <span className="text-[10px] text-[#8E97A8] leading-tight mt-0.5">
                  Compensates density, particle size & glow on fullscreen displays
                </span>
              </div>
              <input
                type="checkbox"
                checked={Boolean(safeState.fullscreenScale ?? true)}
                onChange={(e) =>
                  updateField("fullscreenScale", e.target.checked)
                }
                className="mt-0.5 rounded bg-white/10 border-white/20 text-[#2ff0d6] focus:ring-0 focus:ring-offset-0 h-4 w-4 accent-[#2ff0d6]"
              />
            </label>
          </div>
        </div>

        {/* Section 3: Palette Specs */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#8E97A8] font-semibold">
            <Palette className="h-3 w-3 text-[#2ff0d6]" />
            <span>Color Specs</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between p-1.5 rounded bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: OFFICIAL_PALETTE.primary }}
                />
                <span className="text-[#8E97A8]">Primary (Teal)</span>
              </div>
              <span className="text-white text-[11px]">
                {OFFICIAL_PALETTE.primary}
              </span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: OFFICIAL_PALETTE.secondary }}
                />
                <span className="text-[#8E97A8]">Secondary (Violet)</span>
              </div>
              <span className="text-white text-[11px]">
                {OFFICIAL_PALETTE.secondary}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
