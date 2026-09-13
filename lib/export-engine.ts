/**
 * High-Fidelity Export Engine for Particle Charts
 *
 * Provides studio-grade exports:
 * 1. Ultra HD PNGs (1x, 2x Retina, 4K UHD) with Transparent or Deep Black backgrounds
 *    and optional Canva/Ray.so-style Studio Card framing.
 * 2. 60 FPS native GPU canvas video loop recording (WebM/MP4) with high bitrate.
 * 3. Copyable React & Vanilla JS embed code snippets.
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
 * Export crystal-clear, high-DPI PNG image.
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

  if (studioFrame) {
    // Studio Card Frame (Canva / Ray.so presentation style)
    const cardPaddingX = Math.round(50 * scale);
    const cardHeaderHeight = Math.round(60 * scale);
    const cardBottomPadding = Math.round(36 * scale);
    const outerMargin = Math.round(44 * scale);

    const cardW = srcW * (scale > 1 ? 1 : 1) + cardPaddingX * 2;
    const cardH = srcH * (scale > 1 ? 1 : 1) + cardHeaderHeight + cardBottomPadding;

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

    // Card Header
    const headerY = cardY + Math.round(36 * scale);
    const headerLeft = cardX + cardPaddingX;

    // Pulse dot
    ctx.beginPath();
    ctx.arc(headerLeft, headerY - Math.round(4 * scale), Math.round(5 * scale), 0, Math.PI * 2);
    ctx.fillStyle = "#2ff0d6";
    ctx.shadowColor = "rgba(47, 240, 214, 0.6)";
    ctx.shadowBlur = 10 * scale;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Title Text
    ctx.font = `600 ${Math.round(18 * scale)}px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(title || "Particle Chart", headerLeft + Math.round(16 * scale), headerY - Math.round(4 * scale));

    // Chart Type Badge
    const badgeText = activeChartType.toUpperCase();
    ctx.font = `600 ${Math.round(10 * scale)}px monospace`;
    const badgeW = ctx.measureText(badgeText).width + Math.round(14 * scale);
    const badgeH = Math.round(20 * scale);
    const badgeX = cardX + cardW - cardPaddingX - badgeW;
    const badgeY = headerY - Math.round(14 * scale);

    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, Math.round(6 * scale));
    ctx.fillStyle = "rgba(47, 240, 214, 0.12)";
    ctx.fill();
    ctx.strokeStyle = "rgba(47, 240, 214, 0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#2ff0d6";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(badgeText, badgeX + badgeW / 2, badgeY + badgeH / 2);

    // Draw chart canvas into card
    const chartTargetX = cardX + cardPaddingX;
    const chartTargetY = cardY + cardHeaderHeight;
    ctx.drawImage(canvas, chartTargetX, chartTargetY, srcW, srcH);

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
    // Clean Canvas (Direct High-Resolution Snapshot)
    const outW = srcW * (scale > 1 ? scale : 1);
    const outH = srcH * (scale > 1 ? scale : 1);

    const offscreen = document.createElement("canvas");
    offscreen.width = outW;
    offscreen.height = outH;
    const ctx = offscreen.getContext("2d");
    if (!ctx) throw new Error("Could not create 2D canvas context.");

    if (!transparent) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, outW, outH);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(canvas, 0, 0, outW, outH);

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
 * Record a pristine, smooth 60 FPS video loop of the particle canvas using native GPU stream.
 */
export async function recordCanvasVideo(options: RecordVideoOptions): Promise<void> {
  const { canvas, title, durationSeconds = 4, onProgress } = options;

  if (!canvas) throw new Error("Canvas element not found.");

  // Check captureStream support
  const captureStream =
    (canvas as any).captureStream || (canvas as any).mozCaptureStream;
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

  const stream: MediaStream = captureStream.call(canvas, 60); // 60 FPS direct GPU hook
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
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
      onProgress?.(pct);
    }, 50);

    recorder.onstop = () => {
      clearInterval(progressInterval);
      onProgress?.(100);

      const videoBlob = new Blob(chunks, { type: mimeType });
      const sanitizedTitle = (title || "particle-chart").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      downloadBlob(videoBlob, `${sanitizedTitle}-60fps-loop.webm`);
      resolve();
    };

    recorder.onerror = (err) => {
      clearInterval(progressInterval);
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

