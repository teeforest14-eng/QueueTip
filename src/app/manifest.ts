import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "QueueTip",
    short_name: "QueueTip",
    description:
      "Structured immigration guidance, case tracking, and official USCIS tools.",
    start_url: "/app/dashboard",
    display: "standalone",
    background_color: "#eaf1f7",
    theme_color: "#6f8faf",
    icons: [
      {
        src: "/brand/queue-tip-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
