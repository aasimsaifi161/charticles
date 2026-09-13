/**
 * Apple-Style Tilted Category Axis Labels Engine
 *
 * Replaces horizontal text and bypassing particle-charts' thinTicks downsampler
 * so that EVERY single category name is displayed crisply below the X-axis.
 * Angled at -45° with right-alignment and baseline tick notches, matching the
 * iconic Apple Health / Activity / Xcode Charts design language.
 */

export interface AppleAxisState {
  isCompensated: boolean;
  tiltOption: boolean;
}

/**
 * Determine whether category labels should be tilted based on density.
 */
export function shouldTiltCategoryLabels(
  labels: string[],
  plotWidth?: number
): boolean {
  if (!labels || labels.length <= 1) return false;

  // 4 or more categories usually crowd standard horizontal width
  if (labels.length >= 4) return true;

  // If any label is long (> 6 chars) and there are 3+ categories
  if (labels.length >= 3 && labels.some((l) => (l ? l.length > 6 : false))) {
    return true;
  }

  // If measured or estimated width exceeds available space
  if (plotWidth && plotWidth > 0) {
    const totalEstimatedWidth = labels.reduce(
      (acc, l) => acc + (l ? l.length * 7.5 + 16 : 30),
      0
    );
    if (totalEstimatedWidth > plotWidth * 0.65) return true;
  }

  return false;
}

/**
 * Compute the required bottom padding for the chart canvas to ensure
 * tilted labels have ample breathing room and never clip at the bottom,
 * while scaling linearly with the user's base padding slider.
 */
export function computeCategoryBottomPadding(
  labels: string[],
  isCompensated: boolean = false,
  basePadding: number = 44,
  tilt: boolean = true
): number {
  if (!labels || labels.length === 0) return basePadding;

  if (!tilt) {
    return basePadding + (isCompensated ? 10 : 6);
  }

  const maxLen = Math.max(...labels.map((l) => (l ? l.length : 0)), 3);
  // Character width in 11px / 13px system font
  const charWidth = isCompensated ? 7.6 : 6.8;
  // Visual width clamped to 100px for safety (labels truncate at 18 chars)
  const maxVisualWidth = Math.min(maxLen * charWidth, 100);
  // At -45° angle, vertical projection drop = maxVisualWidth * sin(45°) ≈ maxVisualWidth * 0.707
  const verticalDrop = Math.ceil(maxVisualWidth * 0.707);
  // Tick notch (4px) + baseline clearance (4-8px)
  const extraTilt = verticalDrop + (isCompensated ? 12 : 8);

  return basePadding + extraTilt;
}

/**
 * Render Apple-style category labels directly to the canvas context.
 */
export function renderAppleCategoryLabels(
  chart: any,
  ctx: CanvasRenderingContext2D,
  isCompensated: boolean,
  tiltOption: boolean
) {
  if (!chart || !ctx || !chart.plot || !chart.catScale || chart.horizontal) {
    return;
  }

  if (chart.options?.showAxis === false) {
    return;
  }

  const labels: string[] = chart.data?.labels || [];
  if (!labels.length) return;

  const baselineY = Math.round(chart.plot.y + chart.plot.h) + 0.5;
  const hoveredIndex: number | undefined = chart.hover?.index;

  // Decide whether to tilt
  const shouldTilt =
    tiltOption && shouldTiltCategoryLabels(labels, chart.plot.w);

  // Responsive font size tailored to density
  let fontSize = isCompensated ? 13 : 11;
  if (labels.length > 16) {
    fontSize = isCompensated ? 11 : 9.5;
  } else if (labels.length > 10) {
    fontSize = isCompensated ? 12 : 10;
  }

  const fontFamily =
    '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, sans-serif';
  const regularFont = `500 ${fontSize}px ${fontFamily}`;
  const activeFont = `600 ${fontSize}px ${fontFamily}`;

  const regularColor =
    chart.options?.axis?.textColor || "rgba(255, 255, 255, 0.65)";
  const activeColor = "#ffffff";
  const activeGlow = "#2ff0d6";

  const tickAngle = -Math.PI / 4; // -45 degrees

  for (let i = 0; i < labels.length; i++) {
    const rawLabel = labels[i] ?? "";
    const x = chart.catScale.at(i);
    if (typeof x !== "number" || !Number.isFinite(x)) continue;

    const isHovered = i === hoveredIndex;

    // 1. Draw Apple-style 1px vertical tick notch under the baseline
    ctx.save();
    ctx.strokeStyle = isHovered ? activeGlow : "rgba(255, 255, 255, 0.18)";
    ctx.lineWidth = isHovered ? 1.5 : 1;
    ctx.beginPath();
    const snapX = Math.round(x) + 0.5;
    ctx.moveTo(snapX, baselineY);
    ctx.lineTo(snapX, baselineY + (isHovered ? 5.5 : 4));
    ctx.stroke();
    ctx.restore();

    // Truncate overly long names with ellipsis
    const displayLabel =
      rawLabel.length > 18 ? rawLabel.slice(0, 17) + "…" : rawLabel;

    // 2. Draw category label
    ctx.save();
    const anchorY = baselineY + (isCompensated ? 9 : 7);

    if (shouldTilt) {
      // Apple Health tilted style: -45° with right-alignment pointing to the tick
      ctx.translate(x, anchorY);
      ctx.rotate(tickAngle);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.font = isHovered ? activeFont : regularFont;
      ctx.fillStyle = isHovered ? activeColor : regularColor;

      if (isHovered) {
        ctx.shadowColor = "rgba(47, 240, 214, 0.4)";
        ctx.shadowBlur = 6;
      }

      ctx.fillText(displayLabel, -3, 0);
    } else {
      // Horizontal style when very few categories
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.font = isHovered ? activeFont : regularFont;
      ctx.fillStyle = isHovered ? activeColor : regularColor;

      if (isHovered) {
        ctx.shadowColor = "rgba(47, 240, 214, 0.4)";
        ctx.shadowBlur = 6;
      }

      ctx.fillText(displayLabel, x, anchorY);
    }

    ctx.restore();
  }
}

/**
 * Attach Apple-style axis enhancements to a ParticleChart instance:
 * 1. Overrides categoryTicks to preserve all categories (bypass downsampling/thinTicks).
 * 2. Wraps drawForeground to render crisp tilted labels on every frame.
 * 3. Extends hover area so hovering directly over labels activates bar + tooltip.
 */
export function attachAppleAxisEnhancements(
  chart: any,
  isCompensated: boolean,
  tiltOption: boolean
) {
  if (!chart) return;

  chart.__appleAxisState = { isCompensated, tiltOption };

  if (chart.__appleAxisAttached) return;
  chart.__appleAxisAttached = true;

  // 1. Ensure all category ticks are returned without dropping/downsampling
  const originalCategoryTicks = chart.categoryTicks?.bind(chart);
  chart.categoryTicks = function () {
    const labels = this.data?.labels || [];
    if (!labels.length || !this.catScale) {
      return originalCategoryTicks ? originalCategoryTicks() : [];
    }
    return labels.map((label: string, i: number) => ({
      label,
      pos: this.catScale.at(i),
    }));
  };

  // 2. Extend pointer hover hit-testing to the bottom category labels strip
  const originalHandleHover = chart.handleHover?.bind(chart);
  if (originalHandleHover) {
    chart.handleHover = function (x: number, y: number) {
      const plot = this.plot;
      if (plot) {
        const bottomSlack = this.padding?.bottom || 60;
        if (
          x >= plot.x - 12 &&
          x <= plot.x + plot.w + 12 &&
          y >= plot.y + plot.h &&
          y <= plot.y + plot.h + bottomSlack
        ) {
          // Pointer is over bottom label area: map y to bottom edge of plot
          originalHandleHover(x, plot.y + plot.h - 4);
          return;
        }
      }
      originalHandleHover(x, y);
    };
  }

  // 3. Render Apple-style category labels in drawForeground on every frame
  const originalDrawForeground = chart.drawForeground?.bind(chart);
  chart.drawForeground = function (ctx: CanvasRenderingContext2D) {
    if (originalDrawForeground) {
      originalDrawForeground(ctx);
    }
    const state: AppleAxisState = this.__appleAxisState || {
      isCompensated: false,
      tiltOption: true,
    };
    renderAppleCategoryLabels(this, ctx, state.isCompensated, state.tiltOption);
  };
}

/**
 * Update the state (isCompensated, tiltOption) without re-wrapping functions.
 */
export function updateAppleAxisState(
  chart: any,
  isCompensated: boolean,
  tiltOption: boolean
) {
  if (chart) {
    chart.__appleAxisState = { isCompensated, tiltOption };
  }
}
