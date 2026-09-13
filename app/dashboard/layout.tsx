import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio — Charticles",
  description:
    "Interactive 60 FPS GPU particle charting workspace. Edit data, customize particle physics, and export 4K Ultra HD PNGs and video loops.",
  alternates: {
    canonical: "/dashboard",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
