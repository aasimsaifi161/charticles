"use client";

import { useEffect, useRef } from "react";
import { ParticleChart, type Chart } from "particle-charts";
import type { ParticleChartStageProps } from "@/types/chart";
import {
  attachAppleAxisEnhancements,
  updateAppleAxisState,
} from "@/lib/apple-axis-labels";

export function ParticleChartStage({
  config,
  className = "w-full h-[520px]",
  style,
  onParticleCountChange,
  onInit,
  tiltLabels = true,
  isCompensated = false,
}: ParticleChartStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const previousTypeRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!containerRef.current) return;

    const currentType = config.type || "line";
    const typeChanged = previousTypeRef.current !== currentType;

    // If type changed or no chart exists yet, instantiate freshly
    if (!chartInstanceRef.current || typeChanged) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }

      const chart: Chart = ParticleChart(containerRef.current, config);
      attachAppleAxisEnhancements(chart, Boolean(isCompensated), Boolean(tiltLabels));
      chartInstanceRef.current = chart;
      previousTypeRef.current = currentType;

      onInit?.(chart);

      // Report initial particle field count
      const fieldCount = (chart as unknown as { field?: { count?: number } })
        .field?.count;
      if (typeof fieldCount === "number") {
        onParticleCountChange?.(fieldCount);
      }
    } else {
      // If same chart type, use the library's morphing update API
      chartInstanceRef.current.update(config.data, config);
      updateAppleAxisState(
        chartInstanceRef.current,
        Boolean(isCompensated),
        Boolean(tiltLabels)
      );

      const fieldCount = (
        chartInstanceRef.current as unknown as { field?: { count?: number } }
      ).field?.count;
      if (typeof fieldCount === "number") {
        onParticleCountChange?.(fieldCount);
      }
    }
  }, [config, onInit, onParticleCountChange, tiltLabels, isCompensated]);

  // Clean teardown on unmount
  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: "100%",
        height: "520px",
        minHeight: "500px",
        ...style,
      }}
    />
  );
}
