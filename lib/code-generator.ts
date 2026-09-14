import type { ChartOptions } from "particle-charts";

/**
 * Generates a clean, production-ready React / Next.js TypeScript component
 * that can be directly pasted into any project with `particle-charts`.
 */
export function generateReactComponent(
  config: ChartOptions,
  componentName = "LivingParticleChart"
): string {
  const configString = JSON.stringify(config, null, 2);

  return `"use client";

import { useEffect, useRef } from "react";
import { ParticleChart, type Chart } from "particle-charts";

export function ${componentName}() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config = ${configString};

    // Instantiate living particle chart on hardware-accelerated canvas
    chartRef.current = ParticleChart(containerRef.current, config);

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[520px] rounded-2xl bg-black overflow-hidden border border-white/10 shadow-2xl relative"
      style={{ width: "100%", height: "520px", background: "#000000" }}
    />
  );
}
`;
}
