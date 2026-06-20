import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { BLOG_POSTS } from "@/lib/blog";

type SitemapEntry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: Array<{
  path: string;
  lastModified: string;
  changeFrequency: SitemapEntry["changeFrequency"];
  priority: number;
}> = [
  { path: "",                         lastModified: "2026-06-21", changeFrequency: "weekly",  priority: 1.0 },
  { path: "/ozellikler",              lastModified: "2026-06-01", changeFrequency: "monthly", priority: 0.9 },
  { path: "/fiyatlandirma",           lastModified: "2026-06-20", changeFrequency: "weekly",  priority: 0.9 },
  { path: "/satin-al",                lastModified: "2026-06-21", changeFrequency: "weekly",  priority: 0.9 },
  { path: "/kurulum",                 lastModified: "2026-06-20", changeFrequency: "monthly", priority: 0.8 },
  { path: "/sss",                     lastModified: "2026-06-21", changeFrequency: "monthly", priority: 0.8 },
  { path: "/iletisim",                lastModified: "2026-06-01", changeFrequency: "yearly",  priority: 0.7 },
  { path: "/hakkimizda",              lastModified: "2026-06-01", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog",                    lastModified: "2026-06-20", changeFrequency: "weekly",  priority: 0.7 },
  { path: "/gizlilik-politikasi",     lastModified: "2026-06-01", changeFrequency: "yearly",  priority: 0.3 },
  { path: "/kvkk",                    lastModified: "2026-06-01", changeFrequency: "yearly",  priority: 0.3 },
  { path: "/mesafeli-satis-sozlesmesi", lastModified: "2026-06-01", changeFrequency: "yearly", priority: 0.3 },
  { path: "/hizmet-sozlesmesi",       lastModified: "2026-06-01", changeFrequency: "yearly",  priority: 0.3 },
  { path: "/iptal-iade-politikasi",   lastModified: "2026-06-01", changeFrequency: "yearly",  priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE.url}${route.path}`,
    lastModified: new Date(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
