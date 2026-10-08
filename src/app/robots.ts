import type { MetadataRoute } from "next";

/** Keep crawlers on public pages; admin stays unlisted and noindexed. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
  };
}
