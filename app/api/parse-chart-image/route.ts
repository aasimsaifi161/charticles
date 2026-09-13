import { NextRequest, NextResponse } from "next/server";
import type { ChartTabKey } from "@/types/chart";
import type { TabularData, ExtractedChartData } from "@/types/dashboard";

const VALID_CHART_TYPES: ChartTabKey[] = [
  "bar",
  "bar-dual",
  "line-area",
  "pie",
  "donut",
  "bubble",
  "radar",
];

const EXTRACTION_SYSTEM_PROMPT = `
You are an expert data visualization and computer vision system.
Analyze this chart or graph image and extract its underlying data with high precision.

Instructions:
1. Determine the chart type:
   - "bar": Single series bar or column chart
   - "bar-dual": Two series grouped or comparison bar chart
   - "line-area": Line chart, time series, or filled area chart
   - "pie": Standard pie chart
   - "donut": Donut chart (circular chart with center hole)
   - "bubble": Bubble plot or scatter chart with circles
   - "radar": Spider or radar chart with spoke axes
2. Extract all category / X-axis labels in sequential order.
3. Extract corresponding numerical values for each category.
   - For single series: column 0 is Category label, column 1 is numerical value.
   - For dual series (bar-dual): column 0 is Category label, column 1 is Series 1 value, column 2 is Series 2 value.
4. If exact numbers are not printed on bars/slices, carefully estimate them using the axis scale, gridlines, or slice angles.
5. Create a concise descriptive dataset title (e.g. "Quarterly Revenue 2024").
6. You MUST return ONLY a valid JSON object matching this schema:
{
  "chartType": "bar" | "bar-dual" | "line-area" | "pie" | "donut" | "bubble" | "radar",
  "datasetName": "Descriptive Title",
  "headers": ["Category", "Value"],
  "rows": [
    ["Item 1", 45],
    ["Item 2", 80]
  ]
}
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType = "image/png", apiKey: customKey } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, error: "MISSING_IMAGE", message: "No image provided." },
        { status: 400 }
      );
    }

    // Server-side OpenAI API key from .env.local
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "SERVER_CONFIG_ERROR",
          message:
            "Server error: OPENAI_API_KEY is not configured in .env.local on the server.",
        },
        { status: 500 }
      );
    }

    // Format clean base64 data URI
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, "");
    const dataUri = `data:${mimeType};base64,${cleanBase64}`;

    // Call OpenAI Vision API (gpt-4o-mini with fallback to gpt-4o)
    const models = ["gpt-4o-mini", "gpt-4o"];
    let lastError = "";
    let rawJsonText = "";

    for (const model of models) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey.trim()}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content: EXTRACTION_SYSTEM_PROMPT,
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Analyze this graph image and return the structured JSON data according to the instructions.",
                  },
                  {
                    type: "image_url",
                    image_url: {
                      url: dataUri,
                      detail: "high",
                    },
                  },
                ],
              },
            ],
            response_format: { type: "json_object" },
            temperature: 0.1,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          lastError =
            errData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
          continue;
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) {
          rawJsonText = content;
          break;
        }
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
      }
    }

    if (!rawJsonText) {
      return NextResponse.json(
        {
          success: false,
          error: "VISION_API_FAILED",
          message: lastError || "Failed to analyze image with OpenAI Vision API.",
        },
        { status: 502 }
      );
    }

    // Parse extracted JSON
    let parsed: {
      chartType?: string;
      datasetName?: string;
      headers?: string[];
      rows?: Array<Array<string | number>>;
    };

    try {
      parsed = JSON.parse(rawJsonText);
    } catch {
      const stripped = rawJsonText.replace(/```json/gi, "").replace(/```/g, "").trim();
      parsed = JSON.parse(stripped);
    }

    // Validate and sanitize chartType
    const normalizedType = String(parsed.chartType || "bar").toLowerCase() as ChartTabKey;
    const finalChartType: ChartTabKey = VALID_CHART_TYPES.includes(normalizedType)
      ? normalizedType
      : "bar";

    const isDual = finalChartType === "bar-dual";

    // Validate and sanitize headers
    let finalHeaders: string[] = Array.isArray(parsed.headers) && parsed.headers.length >= 2
      ? parsed.headers.map(String)
      : isDual
      ? ["Category", "Series 1", "Series 2"]
      : ["Category", "Value"];

    if (isDual && finalHeaders.length < 3) {
      finalHeaders = ["Category", "Series 1", "Series 2"];
    }

    // Validate and sanitize rows
    const rawRows = Array.isArray(parsed.rows) ? parsed.rows : [];
    const sanitizedRows: Array<Array<string | number | "">> = rawRows.map((r, idx) => {
      const cat = r && r[0] !== undefined && r[0] !== null && String(r[0]).trim() !== ""
        ? String(r[0])
        : `Item ${idx + 1}`;

      const val1 = r && typeof r[1] === "number" && Number.isFinite(r[1])
        ? r[1]
        : r && !Number.isNaN(Number(r[1])) && r[1] !== ""
        ? Number(r[1])
        : 0;

      if (isDual) {
        const val2 = r && typeof r[2] === "number" && Number.isFinite(r[2])
          ? r[2]
          : r && !Number.isNaN(Number(r[2])) && r[2] !== ""
          ? Number(r[2])
          : 0;
        return [cat, val1, val2];
      }

      return [cat, val1];
    });

    if (sanitizedRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "NO_DATA_FOUND",
          message: "Could not detect numeric data rows in this graph image.",
        },
        { status: 422 }
      );
    }

    const tabularData: TabularData = {
      headers: finalHeaders,
      rows: sanitizedRows,
    };

    const extractedResult: ExtractedChartData = {
      chartType: finalChartType,
      datasetName: parsed.datasetName || "Extracted Graph",
      data: tabularData,
    };

    return NextResponse.json({
      success: true,
      result: extractedResult,
    });
  } catch (err) {
    console.error("OpenAI chart vision extraction error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message:
          err instanceof Error
            ? err.message
            : "An unknown error occurred while parsing the chart with OpenAI.",
      },
      { status: 500 }
    );
  }
}
