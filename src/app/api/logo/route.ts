import { NextResponse } from "next/server";
import { readLogo } from "@/lib/db";
import { LOGO_EXT_MIME } from "@/lib/references";

// Public: yüklenen referans logolarını sunar (anasayfadaki kayan şerit kullanır).
// Dosya adları yükleme sırasında üretildiği için içerik değişmez → uzun cache.

/**
 * `?w=` ile istenebilecek genişlikler.
 *
 * Serbest bırakılsaydı tek bir public uç, her istekte farklı boyut sorularak
 * sınırsız yeniden kodlamaya zorlanabilirdi. Şerit 44 CSS pikselinde çiziyor;
 * 96 retina karşılığı, 192 ise olası daha büyük kullanımlar için.
 */
const ALLOWED_WIDTHS = new Set([48, 96, 192]);

/** WebP kalitesi: 96 pikselde 80 ile 90 arasında gözle fark görünmüyor. */
const WEBP_QUALITY = 80;

/**
 * Dönüştürülmüş logoların bellek içi önbelleği.
 *
 * Dosya adları içerik değiştiğinde yeniden üretiliyor, yani ad → bayt
 * eşlemesi kalıcı. Önbellek olmadan her istek yeniden kodlama yapardı.
 * 50 referans × 3 boyut × ~1,5 KB ≈ 225 KB; sınır yine de konuldu.
 */
const MAX_CACHE_ENTRIES = 200;
const cache = new Map<string, Uint8Array<ArrayBuffer>>();

/**
 * Buffer'ı gövdeye verilebilir bir Uint8Array'e kopyalar.
 *
 * Node Buffer'ının tipi `ArrayBufferLike` olduğu için doğrudan `BodyInit`
 * yerine geçmiyor; kopya birkaç KB'lik logolarda ölçülebilir maliyet değil.
 */
function toBody(data: Buffer): Uint8Array<ArrayBuffer> {
  const body = new Uint8Array(data.byteLength);
  body.set(data);
  return body;
}

function cacheGet(key: string): Uint8Array<ArrayBuffer> | undefined {
  return cache.get(key);
}

function cacheSet(key: string, value: Uint8Array<ArrayBuffer>): void {
  if (cache.size >= MAX_CACHE_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, value);
}

function imageResponse(body: Uint8Array<ArrayBuffer>, contentType: string): NextResponse {
  return new NextResponse(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      // SVG aynı origin'den servis edildiği için script çalıştırmasını engelle.
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file");
  if (!file || !/^[a-z0-9._-]+$/i.test(file)) {
    return NextResponse.json({ error: "Geçersiz dosya" }, { status: 400 });
  }

  const ext = file.split(".").pop()?.toLowerCase() ?? "";
  const contentType = LOGO_EXT_MIME[ext];
  if (!contentType) {
    return NextResponse.json({ error: "Geçersiz dosya" }, { status: 400 });
  }

  const data = await readLogo(file);
  if (!data) {
    return NextResponse.json({ error: "Logo bulunamadı" }, { status: 404 });
  }

  const requestedWidth = Number(searchParams.get("w"));

  // `w` verilmediğinde davranış eskisi gibi: dosya olduğu gibi döner.
  // Admin paneli ve eski bağlantılar bu yoldan geçmeye devam eder.
  //
  // SVG dönüştürülmez: vektör zaten küçük ve rasterleştirmek kaliteyi düşürür.
  if (!ALLOWED_WIDTHS.has(requestedWidth) || ext === "svg") {
    return imageResponse(toBody(data), contentType);
  }

  const cacheKey = `${file}@${requestedWidth}`;
  const cached = cacheGet(cacheKey);
  if (cached) {
    return imageResponse(cached, "image/webp");
  }

  try {
    // Dinamik import bilinçli: Alpine/musl ortamında sharp'ın yerel ikilisi
    // yüklenemezse statik import modülü komple düşürür ve aşağıdaki catch'e
    // hiç girilmeden rota 500 dönerdi. Böyle bir durumda logolar orijinal
    // boyutlarıyla da olsa görünmeye devam etsin.
    const { default: sharp } = await import("sharp");

    const resized = await sharp(data)
      .resize(requestedWidth, requestedWidth, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    const body = toBody(resized);
    cacheSet(cacheKey, body);
    return imageResponse(body, "image/webp");
  } catch (error: unknown) {
    // Dönüştürme başarısızsa (bozuk dosya, sharp ikilisi yüklenemedi) şerit
    // kırık görsel göstermek yerine orijinali servis eder: en kötü durumda
    // eski davranışa döneriz, logolar yine görünür.
    const message = error instanceof Error ? error.message : "bilinmeyen hata";
    console.error(`[logo] ${file} dönüştürülemedi, orijinal servis ediliyor:`, message);
    return imageResponse(toBody(data), contentType);
  }
}
