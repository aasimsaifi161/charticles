/**
 * High-Fidelity Export Engine for Particle Charts
 *
 * Provides studio-grade exports:
 * 1. Ultra HD PNGs (1x, 2x Retina, 4K UHD) with Transparent or Deep Black backgrounds
 *    and optional Canva/Ray.so-style Studio Card framing.
 * 2. 60 FPS video loop recording with composited top-middle title and bottom series legend.
 */

export interface ExportImageOptions {
  canvas: HTMLCanvasElement;
  title: string;
  resolution: "1x" | "2x" | "4k";
  transparent: boolean;
  studioFrame: boolean;
  activeChartType: string;
}

export interface RecordVideoOptions {
  canvas: HTMLCanvasElement;
  title: string;
  durationSeconds: number;
  onProgress?: (progressPercent: number) => void;
}

interface LegendEntry {
  color: string;
  label: string;
}

/**
 * Extract active series legend items from the DOM preview.
 */
function getActiveLegendEntries(): LegendEntry[] {
  if (typeof document === "undefined") return [];
  const items = document.querySelectorAll<HTMLElement>(".pchart-legend-item");
  const entries: LegendEntry[] = [];
  items.forEach((item) => {
    const marker = item.querySelector<HTMLElement>(".pchart-legend-marker");
    const label = item.querySelector<HTMLElement>(".pchart-legend-label");
    const color = marker?.style.backgroundColor || marker?.style.background || "#2ff0d6";
    const text = label?.textContent || "";
    if (text.trim()) {
      entries.push({ color, label: text.trim() });
    }
  });
  return entries;
}

/**
 * Draw series legend items centered horizontally on canvas.
 */
function drawLegendOnCanvas(
  ctx: CanvasRenderingContext2D,
  entries: LegendEntry[],
  centerX: number,
  bottomY: number,
  scale: number
) {
  if (!entries || entries.length === 0) return;

  ctx.save();
  const fontSize = Math.max(10, Math.round(11 * scale));
  ctx.font = `500 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.textBaseline = "middle";

  const markerRadius = Math.max(3, Math.round(4 * scale));
  const markerTextGap = Math.round(6 * scale);
  const itemGap = Math.round(20 * scale);

  // Measure total width to center the entire legend
  let totalWidth = 0;
  const itemWidths = entries.map((e) => {
    const w = markerRadius * 2 + markerTextGap + ctx.measureText(e.label).width;
    totalWidth += w;
    return w;
  });
  totalWidth += (entries.length - 1) * itemGap;

  let startX = centerX - totalWidth / 2;

  entries.forEach((entry, i) => {
    // Draw colored marker dot
    ctx.beginPath();
    ctx.arc(startX + markerRadius, bottomY, markerRadius, 0, Math.PI * 2);
    ctx.fillStyle = entry.color;
    ctx.shadowColor = entry.color;
    ctx.shadowBlur = Math.round(5 * scale);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw label
    ctx.fillStyle = "rgba(238, 241, 246, 0.85)";
    ctx.textAlign = "left";
    ctx.fillText(entry.label, startX + markerRadius * 2 + markerTextGap, bottomY);

    startX += itemWidths[i] + itemGap;
  });

  ctx.restore();
}

/**
 * Trigger browser file download from a Blob.
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Export crystal-clear, high-DPI PNG image with top-middle small title and bottom series legend.
 */
export async function exportChartPng(options: ExportImageOptions): Promise<void> {
  const {
    canvas,
    title,
    resolution,
    transparent,
    studioFrame,
    activeChartType,
  } = options;

  if (!canvas) throw new Error("Canvas element not found.");

  // Determine scale multiplier
  let scale = 1;
  if (resolution === "2x") scale = 2;
  if (resolution === "4k") scale = 3;

  const srcW = canvas.width;
  const srcH = canvas.height;
  const legendEntries = getActiveLegendEntries();
  const hasLegend = legendEntries.length > 0;

  if (studioFrame) {
    // Studio Card Frame with top-middle small title and bottom legend
    const cardPaddingX = Math.round(50 * scale);
    const cardHeaderHeight = Math.round(54 * scale);
    const cardBottomPadding = Math.round((hasLegend ? 52 : 36) * scale);
    const outerMargin = Math.round(44 * scale);

    const cardW = srcW + cardPaddingX * 2;
    const cardH = srcH + cardHeaderHeight + cardBottomPadding;

    const outW = cardW + outerMargin * 2;
    const outH = cardH + outerMargin * 2;

    const offscreen = document.createElement("canvas");
    offscreen.width = outW;
    offscreen.height = outH;
    const ctx = offscreen.getContext("2d");
    if (!ctx) throw new Error("Could not create 2D canvas context.");

    // Outer Background
    if (!transparent) {
      ctx.fillStyle = "#050608";
      ctx.fillRect(0, 0, outW, outH);

      // Subtle ambient backdrop glow
      const grad = ctx.createRadialGradient(
        outW / 2,
        outH * 0.4,
        outW * 0.05,
        outW / 2,
        outH * 0.4,
        outW * 0.6
      );
      grad.addColorStop(0, "rgba(47, 240, 214, 0.09)");
      grad.addColorStop(0.5, "rgba(124, 77, 255, 0.04)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, outW, outH);
    }

    // Card Container
    const cardX = outerMargin;
    const cardY = outerMargin;
    const cornerRadius = Math.round(18 * scale);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, cornerRadius);
    ctx.fillStyle = "#0A0B0E";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = Math.max(1, Math.round(1.5 * scale));
    ctx.stroke();
    ctx.clip();

    // Card Header: Top Middle Small Title
    const titleText = title || "Particle Chart";
    const headerY = cardY + Math.round(28 * scale);
    const titleCenterX = cardX + cardW / 2;

    ctx.font = `600 ${Math.round(13 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Small glowing teal indicator dot before title
    const titleWidth = ctx.measureText(titleText).width;
    const dotRadius = Math.max(2, Math.round(2.5 * scale));
    const dotX = titleCenterX - titleWidth / 2 - Math.round(9 * scale);

    ctx.beginPath();
    ctx.arc(dotX, headerY, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#2ff0d6";
    ctx.shadowColor = "rgba(47, 240, 214, 0.6)";
    ctx.shadowBlur = 6 * scale;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillText(titleText, titleCenterX, headerY);

    // Chart Type Badge on the right
    const badgeText = activeChartType.toUpperCase();
    ctx.font = `600 ${Math.round(9 * scale)}px monospace`;
    const badgeW = ctx.measureText(badgeText).width + Math.round(12 * scale);
    const badgeH = Math.round(18 * scale);
    const badgeX = cardX + cardW - cardPaddingX - badgeW;
    const badgeY = headerY - badgeH / 2;

    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, Math.round(5 * scale));
    ctx.fillStyle = "rgba(47, 240, 214, 0.1)";
    ctx.fill();
    ctx.strokeStyle = "rgba(47, 240, 214, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#2ff0d6";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(badgeText, badgeX + badgeW / 2, headerY);

    // Draw chart canvas into card
    const chartTargetX = cardX + cardPaddingX;
    const chartTargetY = cardY + cardHeaderHeight;
    ctx.drawImage(canvas, chartTargetX, chartTargetY, srcW, srcH);

    // Draw Legend below chart
    if (hasLegend) {
      drawLegendOnCanvas(
        ctx,
        legendEntries,
        cardX + cardW / 2,
        chartTargetY + srcH + Math.round(24 * scale),
        scale
      );
    }

    ctx.restore();

    // Convert offscreen canvas to PNG blob
    const sanitizedTitle = (title || "particle-chart").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    offscreen.toBlob(
      (blob) => {
        if (blob) downloadBlob(blob, `${sanitizedTitle}-studio-${resolution}.png`);
      },
      "image/png",
      1.0
    );
  } else {
    // Clean Canvas Export (Without Card Frame)
    const topMargin = Math.round(44 * scale);
    const bottomMargin = Math.round((hasLegend ? 48 : 20) * scale);

    const outW = srcW;
    const outH = srcH + topMargin + bottomMargin;

    const offscreen = document.createElement("canvas");
    offscreen.width = outW;
    offscreen.height = outH;
    const ctx = offscreen.getContext("2d");
    if (!ctx) throw new Error("Could not create 2D canvas context.");

    if (!transparent) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, outW, outH);
    }

    // Top Middle Small Title
    const titleText = title || "Particle Chart";
    ctx.font = `600 ${Math.round(13 * scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(titleText, outW / 2, Math.round(22 * scale));

    // Draw chart canvas
    ctx.drawImage(canvas, 0, topMargin, srcW, srcH);

    // Draw Legend below chart
    if (hasLegend) {
      drawLegendOnCanvas(
        ctx,
        legendEntries,
        outW / 2,
        topMargin + srcH + Math.round(22 * scale),
        scale
      );
    }

    const sanitizedTitle = (title || "particle-chart").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    offscreen.toBlob(
      (blob) => {
        if (blob) downloadBlob(blob, `${sanitizedTitle}-${resolution}.png`);
      },
      "image/png",
      1.0
    );
  }
}

/**
 * Record a pristine, smooth 60 FPS video loop of the preview
 * including the small top-middle title, live GPU particles, and series legend below the chart.
 */
export async function recordCanvasVideo(options: RecordVideoOptions): Promise<void> {
  const { canvas, title, durationSeconds = 4, onProgress } = options;

  if (!canvas) throw new Error("Canvas element not found.");

  const legendEntries = getActiveLegendEntries();
  const hasLegend = legendEntries.length > 0;

  // Composite canvas with extra headroom for top-middle small title and footer for series legend
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const srcW = canvas.width;
  const srcH = canvas.height;

  // Reserve top margin for title and bottom margin for legend
  const topMargin = Math.round(40 * dpr);
  const bottomMargin = Math.round((hasLegend ? 44 : 16) * dpr);

  const compCanvas = document.createElement("canvas");
  compCanvas.width = srcW;
  compCanvas.height = srcH + topMargin + bottomMargin;
  const compCtx = compCanvas.getContext("2d");
  if (!compCtx) throw new Error("Could not create composite canvas context.");

  // Check captureStream support
  const captureStream =
    (compCanvas as any).captureStream || (compCanvas as any).mozCaptureStream;
  if (!captureStream) {
    throw new Error("Canvas video streaming is not supported in this browser.");
  }

  // Choose optimal video container & codec
  let mimeType = "video/webm;codecs=vp9";
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = "video/webm;codecs=vp8";
  }
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = "video/webm";
  }

  const stream: MediaStream = captureStream.call(compCanvas, 60); // 60 FPS direct GPU hook
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 14_000_000, // 14 Mbps high bitrate for lossless glow
  });

  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  const totalMs = durationSeconds * 1000;
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    let animId: number;

    // Continuous 60 FPS Compositing Loop: Paints live canvas + top-middle title + series legend
    const renderLoop = () => {
      // 1. Black background
      compCtx.fillStyle = "#000000";
      compCtx.fillRect(0, 0, compCanvas.width, compCanvas.height);

      // 2. Small Top-Middle Title
      const titleText = title || "Particle Chart";
      compCtx.font = `600 ${Math.round(13 * dpr)}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      compCtx.fillStyle = "rgba(255, 255, 255, 0.9)";
      compCtx.textAlign = "center";
      compCtx.textBaseline = "middle";
      compCtx.fillText(titleText, compCanvas.width / 2, Math.round(20 * dpr));

      // 3. Live Canvas Particles
      compCtx.drawImage(canvas, 0, topMargin, srcW, srcH);

      // 4. Series Legend Below Chart
      if (hasLegend) {
        drawLegendOnCanvas(
          compCtx,
          legendEntries,
          compCanvas.width / 2,
          topMargin + srcH + Math.round(20 * dpr),
          dpr
        );
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
      onProgress?.(pct);
    }, 50);

    recorder.onstop = () => {
      cancelAnimationFrame(animId);
      clearInterval(progressInterval);
      try {
        stream.getTracks().forEach((track) => track.stop());
      } catch {}
      onProgress?.(100);

      const videoBlob = new Blob(chunks, { type: mimeType });
      const sanitizedTitle = (title || "particle-chart").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      downloadBlob(videoBlob, `${sanitizedTitle}-60fps-loop.webm`);
      resolve();
    };

    recorder.onerror = (err) => {
      cancelAnimationFrame(animId);
      clearInterval(progressInterval);
      try {
        stream.getTracks().forEach((track) => track.stop());
      } catch {}
      reject(err);
    };

    recorder.start(100); // 100ms timeslices

    setTimeout(() => {
      if (recorder.state !== "inactive") {
        recorder.stop();
      }
    }, totalMs);
  });
}
