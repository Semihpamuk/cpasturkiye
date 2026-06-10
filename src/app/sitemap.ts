import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { BLOG_POSTS } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/ozellikler",
    "/fiyatlandirma",
    "/satin-al",
    "/kurulum",
    "/sss",
    "/iletisim",
    "/hakkimizda",
    "/blog",
    "/gizlilik-politikasi",
    "/kvkk",
    "/mesafeli-satis-sozlesmesi",
    "/hizmet-sozlesmesi",
    "/iptal-iade-politikasi",
  ].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
  }));

  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...blogRoutes];
}
