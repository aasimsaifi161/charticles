import type { ChartData } from "particle-charts";
import type { ChartTabKey } from "@/types/chart";
import type { TabularData } from "@/types/dashboard";
import { OFFICIAL_PALETTE } from "@/lib/theme";

/**
 * Transforms user TabularData ([Category, Series 1, Series 2, ...]) into
 * ChartData shape expected by particle-charts for each chart type.
 */
export function transformTabularToChartData(
  tabular: TabularData,
  chartType: ChartTabKey
): ChartData {
  const { headers, rows } = tabular;

  // Filter for valid rows that have at least one numeric value
  const validRows = rows.filter((r) => {
    const v1 = typeof r[1] === "number" && Number.isFinite(r[1]);
    const v2 = typeof r[2] === "number" && Number.isFinite(r[2]);
    return v1 || v2;
  });

  if (validRows.length === 0) {
    return { labels: [], series: [] };
  }

  const labels = validRows.map(([cat], idx) => {
    const str = typeof cat === "string" ? cat.trim() : String(cat ?? "");
    return str !== "" ? str : `Item ${idx + 1}`;
  });

  const values = validRows.map((r) =>
    typeof r[1] === "number" && Number.isFinite(r[1]) ? (r[1] as number) : 0
  );
  const seriesName = headers[1] || "Value";

  switch (chartType) {
    case "bar":
      return {
        labels,
        series: [{ name: seriesName, data: values }],
      };

    case "bar-dual": {
      const series1Name = headers[1] || "Series 1";
      const series2Name = headers[2] || "Series 2";
      const s1Values = validRows.map((r) =>
        typeof r[1] === "number" && Number.isFinite(r[1]) ? (r[1] as number) : 0
      );
      const s2Values = validRows.map((r) =>
        typeof r[2] === "number" && Number.isFinite(r[2]) ? (r[2] as number) : 0
      );

      return {
        labels,
        series: [
          {
            name: series1Name,
            data: s1Values,
            color: OFFICIAL_PALETTE.primary, // #2ff0d6
          },
          {
            name: series2Name,
            data: s2Values,
            color: OFFICIAL_PALETTE.secondary, // #7c4dff
          },
        ],
      };
    }

    case "line-area":
      return {
        labels,
        series: [{ name: seriesName, data: values }],
      };

    case "pie":
    case "donut":
      return {
        labels,
        values,
      };

    case "radar":
      return {
        labels,
        series: [{ name: seriesName, data: values }],
      };

    case "bubble": {
      // For bubble: y is value, r is proportional to area
      const minVal = Math.min(...values);
      const maxVal = Math.max(...values);
      const range = maxVal - minVal || 1;

      const points = values.map((val, i) => {
        const normalized = (val - minVal) / range;
        const radius = 8 + normalized * 24; // 8px to 32px
        return {
          x: (i + 1) * 15,
          y: val,
          r: radius,
        };
      });

      return {
        series: [{ name: seriesName, data: points }],
      };
    }
  }
}
