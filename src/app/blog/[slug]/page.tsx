import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogContent, { slugifyHeading } from "@/components/BlogContent";
import CtaSection from "@/components/CtaSection";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import {
  BLOG_POSTS,
  formatDate,
  getPostBySlug,
  getRelatedPosts,
  lastModified,
} from "@/lib/blog";
import { SITE } from "@/lib/site";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${SITE.url}/blog/${slug}`,
      publishedTime: post.date,
      modifiedTime: lastModified(post),
      section: post.category,
      tags: post.keywords,
      authors: [SITE.name],
      images: [{ url: `${SITE.url}/og-image.png`, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = getRelatedPosts(slug);
  const headings = post.content.filter((block) => block.type === "h2");

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: lastModified(post),
    inLanguage: "tr-TR",
    articleSection: post.category,
    keywords: post.keywords.join(", "),
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingMinutes}M`,
    image: `${SITE.url}/og-image.png`,
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: { "@type": "ImageObject", url: `${SITE.url}/og-image.png` },
    },
    url: `${SITE.url}/blog/${post.slug}`,
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE.url}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE.url}/blog/${post.slug}`,
      },
    ],
  };

  const faqJsonLd = post.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}

      <article className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/blog"
            className="text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            ← Tüm yazılar
          </Link>

          <span className="mt-6 inline-block w-fit rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
            {post.category}
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-600">{post.excerpt}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-500">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.updated ? (
              <>
                <span aria-hidden>·</span>
                <span>
                  Güncellendi:{" "}
                  <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                </span>
              </>
            ) : null}
            <span aria-hidden>·</span>
            <span>{post.readingMinutes} dk okuma</span>
          </div>

          {headings.length > 2 ? (
            <nav
              aria-label="İçindekiler"
              className="mt-10 rounded-2xl border border-ink-200 bg-ink-50/60 px-5 py-4"
            >
              <p className="font-display text-xs font-bold uppercase tracking-widest text-ink-600">
                İçindekiler
              </p>
              <ol className="mt-3 space-y-2">
                {headings.map((heading) => (
                  <li key={heading.text}>
                    <a
                      href={`#${slugifyHeading(heading.text)}`}
                      className="text-sm text-ink-700 underline-offset-2 hover:text-brand-700 hover:underline"
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <div className="mt-6">
            <BlogContent content={post.content} />
          </div>

          {post.faq?.length ? (
            <section className="mt-16" aria-labelledby="yazi-sss">
              <h2
                id="yazi-sss"
                className="font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl"
              >
                Sık sorulan sorular
              </h2>
              <div className="mt-6">
                <FaqAccordion items={post.faq} />
              </div>
            </section>
          ) : null}

          {related.length ? (
            <section className="mt-16 border-t border-ink-200 pt-10" aria-labelledby="ilgili-yazilar">
              <h2
                id="ilgili-yazilar"
                className="font-display text-lg font-bold text-ink-900"
              >
                İlgili yazılar
              </h2>
              <ul className="mt-4 space-y-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/blog/${item.slug}`}
                      className="group flex items-baseline justify-between gap-4"
                    >
                      <span className="font-semibold text-ink-800 group-hover:text-brand-700">
                        {item.title}
                      </span>
                      <span className="shrink-0 text-xs text-ink-500">
                        {item.readingMinutes} dk
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </article>

      <CtaSection />
    </>
  );
}
