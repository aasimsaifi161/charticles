import type { TabularData } from "@/types/dashboard";
import type { ChartTabKey } from "@/types/chart";

export interface PresetTemplate {
  id: string;
  name: string;
  category: string;
  chartType: ChartTabKey;
  data: TabularData;
}

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: "tech-giants",
    name: "Tech Giants Market Cap",
    category: "Finance",
    chartType: "bar",
    data: {
      headers: ["Company", "Market Cap ($T)"],
      rows: [
        ["Apple", 3.4],
        ["Microsoft", 3.1],
        ["NVIDIA", 2.9],
        ["Alphabet", 2.1],
        ["Amazon", 1.9],
        ["Meta", 1.3],
      ],
    },
  },
  {
    id: "saas-arr",
    name: "SaaS ARR vs Burn",
    category: "Startups",
    chartType: "bar-dual",
    data: {
      headers: ["Quarter", "ARR ($M)", "Burn ($M)"],
      rows: [
        ["Q1", 1.2, 0.9],
        ["Q2", 1.8, 1.1],
        ["Q3", 2.6, 1.3],
        ["Q4", 3.8, 1.4],
        ["Q5", 5.2, 1.5],
      ],
    },
  },
  {
    id: "crypto-rally",
    name: "Crypto Market Rally",
    category: "Web3",
    chartType: "line-area",
    data: {
      headers: ["Month", "Price ($K)"],
      rows: [
        ["Jan", 42],
        ["Feb", 51],
        ["Mar", 68],
        ["Apr", 62],
        ["May", 69],
        ["Jun", 65],
        ["Jul", 66],
        ["Aug", 59],
        ["Sep", 64],
        ["Oct", 72],
      ],
    },
  },
  {
    id: "browser-share",
    name: "Global Browser Share",
    category: "Tech",
    chartType: "donut",
    data: {
      headers: ["Browser", "Market Share (%)"],
      rows: [
        ["Chrome", 65],
        ["Safari", 18],
        ["Edge", 5],
        ["Firefox", 3],
        ["Others", 9],
      ],
    },
  },
  {
    id: "ai-evals",
    name: "AI Model Benchmarks",
    category: "AI",
    chartType: "radar",
    data: {
      headers: ["Benchmark", "Score (0-100)"],
      rows: [
        ["Reasoning", 94],
        ["Coding", 91],
        ["Math", 88],
        ["Vision", 92],
        ["Speed", 96],
        ["Memory", 85],
      ],
    },
  },
];
