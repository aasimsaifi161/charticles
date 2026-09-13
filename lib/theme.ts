import type { PaletteDefinition } from "@/types/chart";
import type { ParticleOptions } from "particle-charts";

/**
 * Official signature palette from particlecharts.com:
 * Primary: #2ff0d6 (Neon Teal)
 * Secondary: #7c4dff (Neon Violet)
 * Slices: ['#2ff0d6', '#7c4dff', '#ffb020', '#ff4d6d', '#9ae62f']
 * Base Ground: #000000 (Pure Black)
 */
export const OFFICIAL_PALETTE: PaletteDefinition = {
  primary: "#2ff0d6",
  secondary: "#7c4dff",
  slices: ["#2ff0d6", "#7c4dff", "#ffb020", "#ff4d6d", "#9ae62f"],
  background: "#000000",
};

/**
 * Standard baseline particle physics and rendering options.
 */
export const DEFAULT_PARTICLE_CONFIG: ParticleOptions = {
  color: OFFICIAL_PALETTE.primary,
  size: 0.8,
  density: 15,
  bloom: 0.8,
  bloomRadius: 14,
  opacity: 0.7,
  jitter: 1,
  jitterSpeed: 1,
  speed: 0.085,
  shape: "soft",
};
