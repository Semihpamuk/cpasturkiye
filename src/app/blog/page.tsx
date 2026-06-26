import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS, formatDate } from "@/lib/blog";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog — CPAS ve Trendyol Meta Reklam Rehberleri",
  description:
    "CPAS nedir, Trendyol reklam yetkisi nasıl alınır, ROAS nasıl yükseltilir? Trendyol–Meta reklamcılığı üzerine sahadan gelen rehberler ve optimizasyon taktikleri.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana Sayfa", path: "" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50/60 to-white px-4 pb-14 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            Trendyol &amp; Meta reklamcılığı rehberleri
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
            Blog
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-600">
            CPAS, Meta reklamcılığı ve Trendyol&apos;da büyüme üzerine sahadan gelen bilgiler.
          </p>
        </div>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="border-b border-ink-100 bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <p className="mb-6 text-xs font-bold uppercase tracking-widest text-brand-600">
              Öne çıkan yazı
            </p>
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid items-center gap-8 lg:grid-cols-[1fr_auto]"
            >
              <div>
                <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
                  {featured.category}
                </span>
                <h2 className="mt-4 font-display text-3xl font-bold leading-snug tracking-tight text-ink-900 transition-colors group-hover:text-brand-700 sm:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-600">
                  {featured.excerpt}
                </p>
                <div className="mt-6 flex items-center gap-4 text-sm text-ink-400">
                  <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                  <span>·</span>
                  <span>{featured.readingMinutes} dk okuma</span>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors group-hover:text-brand-800">
                  Yazıyı oku
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
              {/* Dekoratif kart */}
              <div className="hidden h-48 w-64 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-xl lg:flex">
                <svg className="h-20 w-20 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Rest of posts grid */}
      {rest.length > 0 && (
        <section className="bg-ink-50/60 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <p className="mb-8 text-xs font-bold uppercase tracking-widest text-ink-400">
              Tüm yazılar
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-ink-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-brand-700">
                      {post.category}
                    </span>
                    <span className="text-xs text-ink-400">{post.readingMinutes} dk</span>
                  </div>
                  <h2 className="mt-4 font-display text-base font-bold leading-snug text-ink-900 transition-colors group-hover:text-brand-700">
                    {post.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                    {post.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-4">
                    <time className="text-xs text-ink-400" dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    <svg
                      className="h-4 w-4 text-brand-500 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
