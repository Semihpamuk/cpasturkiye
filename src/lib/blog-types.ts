/**
 * Blog içerik modeli.
 *
 * Yazılar düz paragraf dizisi değil, blok listesi olarak tutulur: Google'ın
 * konu haritasını çıkarabilmesi için H2/H3 hiyerarşisi, liste ve tablo
 * gerekiyor. Tek `string[]` modelinde bunların hiçbiri üretilemiyordu.
 */

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; title: string; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

export interface BlogFaq {
  question: string;
  answer: string;
}

/** Yazarın içerik dosyasında yazdığı ham kayıt. */
export interface BlogPostSource {
  slug: string;
  title: string;
  excerpt: string;
  /** İlk yayın tarihi (ISO). */
  date: string;
  /** Son güncelleme (ISO). Yoksa `date` kullanılır. */
  updated?: string;
  category: string;
  /** Sayfa metadata'sındaki `keywords` alanına geçer. */
  keywords: string[];
  content: BlogBlock[];
  /** Doluysa yazının altına SSS bölümü + FAQPage yapısal verisi basılır. */
  faq?: BlogFaq[];
}

/** Türetilmiş alanlarla zenginleştirilmiş, uygulamanın kullandığı kayıt. */
export interface BlogPost extends BlogPostSource {
  readingMinutes: number;
  wordCount: number;
}

/** Türkçe ortalama sessiz okuma hızı (kelime/dakika). */
const WORDS_PER_MINUTE = 200;

function blockWords(block: BlogBlock): number {
  const count = (text: string) => text.split(/\s+/).filter(Boolean).length;

  switch (block.type) {
    case "p":
    case "h2":
    case "h3":
      return count(block.text);
    case "ul":
    case "ol":
      return block.items.reduce((total, item) => total + count(item), 0);
    case "callout":
      return count(block.title) + count(block.text);
    case "table":
      return (
        block.head.reduce((total, cell) => total + count(cell), 0) +
        block.rows.reduce(
          (total, row) => total + row.reduce((sum, cell) => sum + count(cell), 0),
          0
        )
      );
  }
}

export function countWords(content: BlogBlock[]): number {
  return content.reduce((total, block) => total + blockWords(block), 0);
}

/**
 * Okuma süresini içerikten hesaplar.
 *
 * Elle girilen `readingMinutes` alanı içerikten kopunca "7 dk okuma" yazan
 * 200 kelimelik yazılar ortaya çıkıyordu; artık türetiliyor.
 */
export function readingMinutes(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
