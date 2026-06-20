import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — CPAS ve Trendyol Meta Reklam Rehberleri",
  description:
    "CPAS nedir, Trendyol reklam yetkisi nasıl alınır, ROAS nasıl yükseltilir? Trendyol–Meta reklamcılığı üzerine sahadan gelen rehberler ve optimizasyon taktikleri.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Blog
          </h1>
          <p className="mt-4 text-lg text-ink-600">
            CPAS, Meta reklamcılığı ve Trendyol&apos;da büyüme üzerine sahadan gelen
            bilgiler.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-ink-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
            >
              <span className="inline-block w-fit rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
                {post.category}
              </span>
              <h2 className="mt-4 font-display text-lg font-bold leading-snug text-ink-900 group-hover:text-brand-700">
                {post.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">
                {post.excerpt}
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-ink-100 pt-4 text-xs text-ink-400">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>·</span>
                <span>{post.readingMinutes} dk okuma</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
