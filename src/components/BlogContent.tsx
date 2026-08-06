import type { BlogBlock } from "@/lib/blog-types";

/**
 * Blog gövdesini blok modelinden render eder.
 *
 * H2/H3'lere `id` verilir: içindekiler bağlantıları ve Google'ın "bu bölüme
 * git" bağlantıları anchor'a ihtiyaç duyuyor.
 */

export function slugifyHeading(text: string): string {
  return text
    .toLocaleLowerCase("tr-TR")
    .replace(/[ıİ]/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={slugifyHeading(block.text)}
          className="mt-12 scroll-mt-24 font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl"
        >
          {block.text}
        </h2>
      );

    case "h3":
      return (
        <h3
          id={slugifyHeading(block.text)}
          className="mt-8 scroll-mt-24 font-display text-lg font-bold text-ink-900 sm:text-xl"
        >
          {block.text}
        </h3>
      );

    case "p":
      return <p className="mt-5 leading-relaxed text-ink-700">{block.text}</p>;

    case "ul":
      return (
        <ul className="mt-5 space-y-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed text-ink-700">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol className="mt-5 space-y-3">
          {block.items.map((item, index) => (
            <li key={item} className="flex gap-3 leading-relaxed text-ink-700">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );

    case "callout":
      return (
        <aside className="mt-8 rounded-2xl border-l-4 border-brand-600 bg-brand-50/60 px-5 py-4">
          <p className="font-display text-sm font-bold uppercase tracking-wide text-brand-800">
            {block.title}
          </p>
          <p className="mt-2 leading-relaxed text-ink-700">{block.text}</p>
        </aside>
      );

    case "table":
      return (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-ink-200">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <thead className="bg-ink-50">
              <tr>
                {block.head.map((cell) => (
                  <th
                    key={cell}
                    scope="col"
                    className="px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-ink-600"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")} className="border-t border-ink-100 align-top">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cell + cellIndex}
                      className={
                        cellIndex === 0
                          ? "px-4 py-3 font-semibold text-ink-900"
                          : "px-4 py-3 text-ink-700"
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default function BlogContent({ content }: { content: BlogBlock[] }) {
  return (
    <div>
      {content.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </div>
  );
}
