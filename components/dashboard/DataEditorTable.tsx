"use client";

import React from "react";
import { Plus, Trash2, Table, Type } from "lucide-react";
import type { TabularData } from "@/types/dashboard";

interface DataEditorTableProps {
  data: TabularData;
  onChange: (updated: TabularData) => void;
  onClear: () => void;
  isDualSeries?: boolean;
  datasetName?: string;
  onDatasetNameChange?: (name: string) => void;
}

export function DataEditorTable({
  data,
  onChange,
  onClear,
  isDualSeries = false,
  datasetName = "Custom Data",
  onDatasetNameChange,
}: DataEditorTableProps) {
  const { headers, rows } = data;
  const numColumns = isDualSeries ? 3 : 2;

  // Ensure headers match current mode
  const currentHeaders = [...headers];
  if (isDualSeries) {
    if (!currentHeaders[0]) currentHeaders[0] = "Category";
    if (!currentHeaders[1]) currentHeaders[1] = "Series 1";
    if (!currentHeaders[2]) currentHeaders[2] = "Series 2";
  } else {
    if (!currentHeaders[0]) currentHeaders[0] = "Category";
    if (!currentHeaders[1]) currentHeaders[1] = "Value";
  }

  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const updatedRows = rows.map((r, rIdx) => {
      if (rIdx !== rowIndex) return r;
      const updatedRow = [...r];
      if (colIndex === 0) {
        updatedRow[0] = value;
      } else {
        const num = Number(value);
        updatedRow[colIndex] = value === "" || Number.isNaN(num) ? "" : num;
      }
      return updatedRow;
    });

    onChange({
      headers: currentHeaders,
      rows: updatedRows,
    });
  };

  const handleHeaderChange = (colIndex: number, newHeader: string) => {
    const updatedHeaders = [...currentHeaders];
    updatedHeaders[colIndex] = newHeader;
    onChange({
      headers: updatedHeaders,
      rows,
    });
  };

  const handleAddRow = () => {
    const newRow: Array<string | number | ""> = isDualSeries
      ? ["", "", ""]
      : ["", ""];
    onChange({
      headers: currentHeaders,
      rows: [...rows, newRow],
    });
  };

  const handleDeleteRow = (rowIndex: number) => {
    onChange({
      headers: currentHeaders,
      rows: rows.filter((_, idx) => idx !== rowIndex),
    });
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      {/* Graph Title Input Bar */}
      <div className="px-3 py-2 border-b border-white/[0.06] bg-white/[0.015] flex items-center gap-2">
        <label
          htmlFor="graph-title-input"
          className="text-[10px] font-mono uppercase tracking-wider text-[#8E97A8] shrink-0 font-semibold flex items-center gap-1.5"
        >
          <Type className="h-3 w-3 text-[#2ff0d6]" />
          <span>Title</span>
        </label>
        <input
          id="graph-title-input"
          type="text"
          value={datasetName}
          onChange={(e) => onDatasetNameChange?.(e.target.value)}
          placeholder="e.g. Quarterly Revenue Growth..."
          className="flex-1 bg-black/40 border border-white/10 focus:border-[#2ff0d6]/50 rounded-md px-2.5 py-1 text-xs text-white placeholder-[#555E6D] font-medium outline-none transition-colors"
        />
      </div>

      {/* Table Toolbar */}
      <div className="p-3 shrink-0 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Table className="h-3.5 w-3.5 text-[#2ff0d6]" />
          <span className="text-[11px] font-mono text-[#8E97A8]">
            {rows.length} {rows.length === 1 ? "row" : "rows"}
          </span>
          {isDualSeries && (
            <span className="rounded bg-[#7c4dff]/15 px-1.5 py-0.5 text-[9px] font-mono text-[#7c4dff] border border-[#7c4dff]/30">
              Dual
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {rows.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 text-[11px] text-[#8E97A8] hover:text-red-400 px-2 py-1 rounded hover:bg-white/[0.04] transition-colors"
              title="Clear all rows"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleAddRow}
            className="inline-flex items-center gap-1 rounded-lg border border-[#2ff0d6]/30 bg-[#2ff0d6]/10 px-2.5 py-1 text-[11px] font-semibold text-[#2ff0d6] hover:bg-[#2ff0d6]/20 transition-all shadow-sm"
          >
            <Plus className="h-3 w-3" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Table Scrollable Body */}
      <div className="flex-1 overflow-auto bg-[#050505] min-h-0">
        <table className="w-full border-collapse text-left text-xs font-mono">
          <thead className="sticky top-0 z-10 border-b border-white/[0.08] bg-[#0A0A0A]/95 backdrop-blur-sm">
            <tr>
              <th className="w-6 px-1.5 py-2 text-center text-[#555E6D] text-[10px]">
                #
              </th>
              {/* Category Header */}
              <th className="px-2 py-1.5 text-[#8E97A8]">
                <input
                  type="text"
                  value={currentHeaders[0] ?? "Category"}
                  placeholder="Category"
                  onChange={(e) => handleHeaderChange(0, e.target.value)}
                  className="w-full bg-transparent text-[11px] font-semibold text-white focus:outline-none focus:ring-1 focus:ring-[#2ff0d6] rounded px-1"
                />
              </th>
              {/* Series 1 Header */}
              <th className="px-2 py-1.5 text-[#8E97A8]">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2ff0d6]" />
                  <input
                    type="text"
                    value={
                      currentHeaders[1] ?? (isDualSeries ? "Series 1" : "Value")
                    }
                    placeholder={isDualSeries ? "Series 1" : "Value"}
                    onChange={(e) => handleHeaderChange(1, e.target.value)}
                    className="w-full bg-transparent text-[11px] font-semibold text-white focus:outline-none focus:ring-1 focus:ring-[#2ff0d6] rounded px-1"
                  />
                </div>
              </th>
              {/* Series 2 Header */}
              {isDualSeries && (
                <th className="px-2 py-1.5 text-[#8E97A8]">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7c4dff]" />
                    <input
                      type="text"
                      value={currentHeaders[2] ?? "Series 2"}
                      placeholder="Series 2"
                      onChange={(e) => handleHeaderChange(2, e.target.value)}
                      className="w-full bg-transparent text-[11px] font-semibold text-white focus:outline-none focus:ring-1 focus:ring-[#7c4dff] rounded px-1"
                    />
                  </div>
                </th>
              )}
              <th className="w-6 px-1 py-1.5 text-center text-[#555E6D]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={numColumns + 2}
                  className="px-4 py-12 text-center text-xs text-[#8E97A8]"
                >
                  <p className="mb-2">No rows entered yet.</p>
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="inline-flex items-center gap-1 rounded bg-[#2ff0d6]/10 border border-[#2ff0d6]/30 px-2.5 py-1 text-[11px] text-[#2ff0d6] hover:bg-[#2ff0d6]/20 font-medium"
                  >
                    <Plus className="h-3 w-3" /> Add First Row
                  </button>
                </td>
              </tr>
            ) : (
              rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-1.5 py-1 text-center text-[#555E6D] text-[10px]">
                    {rowIdx + 1}
                  </td>
                  {/* Category Cell */}
                  <td className="px-1.5 py-1">
                    <input
                      type="text"
                      placeholder={`Cat ${rowIdx + 1}`}
                      value={row[0] ?? ""}
                      onChange={(e) =>
                        handleCellChange(rowIdx, 0, e.target.value)
                      }
                      className="w-full rounded bg-white/[0.03] px-2 py-0.5 text-xs text-white border border-transparent hover:border-white/10 focus:border-[#2ff0d6] focus:outline-none focus:ring-1 focus:ring-[#2ff0d6] transition-all placeholder:text-[#4A5364]"
                    />
                  </td>
                  {/* Series 1 / Value Cell */}
                  <td className="px-1.5 py-1">
                    <input
                      type="number"
                      placeholder="0"
                      value={row[1] ?? ""}
                      onChange={(e) =>
                        handleCellChange(rowIdx, 1, e.target.value)
                      }
                      className="w-full rounded bg-white/[0.03] px-2 py-0.5 text-xs text-white border border-transparent hover:border-white/10 focus:border-[#2ff0d6] focus:outline-none focus:ring-1 focus:ring-[#2ff0d6] transition-all placeholder:text-[#4A5364]"
                    />
                  </td>
                  {/* Series 2 Cell */}
                  {isDualSeries && (
                    <td className="px-1.5 py-1">
                      <input
                        type="number"
                        placeholder="0"
                        value={row[2] ?? ""}
                        onChange={(e) =>
                          handleCellChange(rowIdx, 2, e.target.value)
                        }
                        className="w-full rounded bg-white/[0.03] px-2 py-0.5 text-xs text-white border border-transparent hover:border-white/10 focus:border-[#7c4dff] focus:outline-none focus:ring-1 focus:ring-[#7c4dff] transition-all placeholder:text-[#4A5364]"
                      />
                    </td>
                  )}
                  {/* Delete Action */}
                  <td className="px-1 py-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(rowIdx)}
                      className="opacity-0 group-hover:opacity-100 text-[#555E6D] hover:text-[#FF4D4D] transition-opacity p-0.5"
                      title="Delete row"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
