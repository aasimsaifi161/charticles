import { ImageResponse } from "next/og";
import { renderOgImageElement, OG_IMAGE_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image-element";

export const runtime = "edge";
export const alt = "Charticles — Free 60 FPS Particle Chart Studio";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpenGraphImage() {
  return new ImageResponse(renderOgImageElement(), {
    ...size,
  });
}
