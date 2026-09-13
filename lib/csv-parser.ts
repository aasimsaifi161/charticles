import type { TabularData, CsvParseResult } from "@/types/dashboard";

/**
 * Robust, zero-dependency client-side CSV parser adhering to RFC 4180.
 * Supports both single-series (2 columns) and dual-series/multi-series (3+ columns).
 */
export function parseCsv(text: string): CsvParseResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      data: null,
      error: "CSV content is empty. Please provide valid comma-separated values.",
      rowCount: 0,
      columnCount: 0,
    };
  }

  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    const nextChar = trimmed[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i++; // skip \r\n
      }
      currentRow.push(currentCell.trim());
      currentCell = "";
      if (currentRow.some((c) => c.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c.length > 0)) {
      lines.push(currentRow);
    }
  }

  if (lines.length < 2) {
    return {
      data: null,
      error: "CSV must contain at least a header row and one data row (e.g. Category, Value).",
      rowCount: lines.length,
      columnCount: lines[0]?.length || 0,
    };
  }

  // Parse headers
  const rawHeaders = lines[0];
  const numColumns = Math.max(2, rawHeaders.length);
  const headers: string[] = [];
  for (let c = 0; c < numColumns; c++) {
    const h = rawHeaders[c] ? rawHeaders[c].trim() : "";
    if (h) {
      headers.push(h);
    } else if (c === 0) {
      headers.push("Category");
    } else if (c === 1 && numColumns === 2) {
      headers.push("Value");
    } else {
      headers.push(`Series ${c}`);
    }
  }

  const parsedRows: Array<Array<string | number | "">> = [];
  for (let r = 1; r < lines.length; r++) {
    const row = lines[r];
    const category = row[0] !== undefined ? String(row[0]).trim() : "";
    const rowValues: Array<string | number | ""> = [category];

    for (let c = 1; c < headers.length; c++) {
      const rawVal = row[c] !== undefined ? String(row[c]).trim() : "";
      const num = Number(rawVal);
      const value: number | "" =
        rawVal !== "" && !Number.isNaN(num) && Number.isFinite(num) ? num : "";
      rowValues.push(value);
    }

    if (category !== "" || rowValues.slice(1).some((v) => v !== "")) {
      parsedRows.push(rowValues);
    }
  }

  return {
    data: {
      headers,
      rows: parsedRows,
    },
    error: null,
    rowCount: parsedRows.length,
    columnCount: headers.length,
  };
}

/**
 * Serializes TabularData back into standard RFC 4180 CSV string.
 */
export function serializeToCsv(data: TabularData): string {
  const formatCell = (val: string | number | "") => {
    const str = String(val ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = data.headers.map(formatCell).join(",");
  const rowLines = data.rows.map((row) => row.map(formatCell).join(","));
  return [headerLine, ...rowLines].join("\n");
}

/**
 * Triggers a browser file download of CSV data.
 */
export function downloadCsvFile(
  data: TabularData,
  filename = "chart-data.csv"
) {
  const csvContent = serializeToCsv(data);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
