export interface TabularData {
  headers: string[]; // Column 0: Category, Column 1+: Series Values
  rows: Array<Array<string | number | "">>;
}

export interface CsvParseResult {
  data: TabularData | null;
  error: string | null;
  rowCount: number;
  columnCount: number;
}

export type DataStudioTab = "table" | "upload" | "image";

export interface ExtractedChartData {
  chartType: "bar" | "bar-dual" | "line-area" | "pie" | "donut" | "bubble" | "radar";
  datasetName: string;
  data: TabularData;
}

export interface ImageParseResult {
  success: boolean;
  result?: ExtractedChartData;
  error?: string;
}

export interface PlaygroundKnobsState {
  density: number;
  size: number;
  bloom: number;
  jitter: number;
  chartPadding: number;
  showAxis: boolean;
  showGrid: boolean;
  showLegend: boolean;
  showValues: boolean;
  fullscreenScale: boolean;
  tiltLabels: boolean;
}

export const DEFAULT_PLAYGROUND_KNOBS: PlaygroundKnobsState = {
  density: 15.0,
  size: 0.8,
  bloom: 0.8,
  jitter: 1.0,
  chartPadding: 44,
  showAxis: true,
  showGrid: true,
  showLegend: true,
  showValues: false,
  fullscreenScale: true,
  tiltLabels: true,
};
