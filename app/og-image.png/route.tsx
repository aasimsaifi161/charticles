import { ImageResponse } from "next/og";
import { renderOgImageElement, OG_IMAGE_SIZE } from "@/lib/og-image-element";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(renderOgImageElement(), {
    ...OG_IMAGE_SIZE,
    headers: {
      "cache-control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
