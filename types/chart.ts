import type { ChartOptions, Chart } from "particle-charts";

export type ChartTabKey =
  | "bar"
  | "bar-dual"
  | "line-area"
  | "pie"
  | "donut"
  | "bubble"
  | "radar";

export interface PaletteDefinition {
  primary: string;
  secondary: string;
  slices: string[];
  background: string;
}

export interface ParticleChartStageProps {
  config: ChartOptions;
  className?: string;
  style?: React.CSSProperties;
  onParticleCountChange?: (count: number) => void;
  onInit?: (chart: Chart) => void;
  tiltLabels?: boolean;
  isCompensated?: boolean;
}
