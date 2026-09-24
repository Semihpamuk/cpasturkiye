import { afterEach, describe, expect, test, vi } from "vitest";
import {
  CONNECTION_ERROR,
  initializeCardPayment,
  submitTransferOrder,
  validateDiscountCode,
  validateTransferInput,
} from "@/app/satin-al/checkout-api";

/**
 * Checkout'un sunucuyla konuştuğu yer. Buradaki sessiz bir hata müşteriyi
 * ödeme ekranında bekletir ya da indirimsiz fiyatla ilerletir; bu yüzden
 * hem mutlu yol hem de her hata dalı testleniyor.
 */

function mockFetch(impl: () => unknown) {
  vi.stubGlobal("fetch", vi.fn(impl));
}

/** `res.ok` ve JSON gövdesi olan asgari bir Response taklidi. */
function jsonResponse(body: unknown, ok = true) {
  return { ok, json: async () => body };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("validateDiscountCode", () => {
  test("geçerli kodu indirime çevirir", async () => {
    // Arrange
    mockFetch(() => jsonResponse({ valid: true, code: "INDIRIM10", type: "percent", value: 10 }));

    // Act
    const result = await validateDiscountCode("indirim10");

    // Assert
    expect(result).toEqual({
      ok: true,
      discount: { code: "INDIRIM10", type: "percent", value: 10 },
    });
  });

  test("geçersiz kodu reddeder", async () => {
    mockFetch(() => jsonResponse({ valid: false }));
    expect(await validateDiscountCode("yok")).toEqual({ ok: false });
  });

  test("ağ hatasında da geçersiz sayar — istisna dışarı sızmaz", async () => {
    // Arrange — sızan istisna, kullanıcıyı "kontrol ediliyor" durumunda asardı.
    mockFetch(() => {
      throw new Error("network down");
    });

    // Act & Assert
    await expect(validateDiscountCode("INDIRIM10")).resolves.toEqual({ ok: false });
  });

  test("bozuk JSON yanıtında çökmez", async () => {
    mockFetch(() => ({
      ok: true,
      json: async () => {
        throw new Error("invalid json");
      },
    }));
    expect(await validateDiscountCode("INDIRIM10")).toEqual({ ok: false });
  });

  test("kodu doğru uca doğru gövdeyle gönderir", async () => {
    // Arrange
    const fetchMock = vi.fn(() => jsonResponse({ valid: false }));
    vi.stubGlobal("fetch", fetchMock);

    // Act
    await validateDiscountCode("KOD1");

    // Assert
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/discount/validate");
    expect(JSON.parse(String(init.body))).toEqual({ code: "KOD1" });
  });
});

describe("initializeCardPayment", () => {
  test("başarılı yanıtta iyzico form içeriğini döndürür", async () => {
    mockFetch(() => jsonResponse({ checkoutFormContent: "<script>iyz</script>" }));
    expect(await initializeCardPayment({})).toEqual({
      ok: true,
      checkoutFormContent: "<script>iyz</script>",
    });
  });

  test("sunucunun hata mesajını olduğu gibi taşır", async () => {
    // Arrange — iyzico 503'ünde havale önerisi bu mesajla geliyor.
    mockFetch(() =>
      jsonResponse({ error: "Kart ödemesi şu an yanıt vermiyor, havale ile deneyin." }, false)
    );

    // Act & Assert
    expect(await initializeCardPayment({})).toEqual({
      ok: false,
      error: "Kart ödemesi şu an yanıt vermiyor, havale ile deneyin.",
    });
  });

  test("sunucu mesaj vermezse genel bir hata gösterir", async () => {
    mockFetch(() => jsonResponse({}, false));
    const result = await initializeCardPayment({});
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.error).toMatch(/Ödeme başlatılamadı/);
  });

  test("ağ hatasında bağlantı mesajı döner", async () => {
    mockFetch(() => {
      throw new Error("offline");
    });
    expect(await initializeCardPayment({})).toEqual({ ok: false, error: CONNECTION_ERROR });
  });
});

describe("submitTransferOrder", () => {
  test("başarılı yanıtta sipariş numarasını döndürür", async () => {
    mockFetch(() => jsonResponse({ orderId: "ORD-1" }));
    expect(await submitTransferOrder({}, null)).toEqual({ ok: true, orderId: "ORD-1" });
  });

  test("dekont varsa aynı isteğe eklenir", async () => {
    // Arrange
    const fetchMock = vi.fn(() => jsonResponse({ orderId: "ORD-2" }));
    vi.stubGlobal("fetch", fetchMock);
    const file = new File(["dekont"], "dekont.pdf", { type: "application/pdf" });

    // Act
    await submitTransferOrder({ name: "Ad" }, file);

    // Assert
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const body = init.body as FormData;
    expect(url).toBe("/api/payment/transfer");
    expect(body.get("receipt")).toBe(file);
    expect(JSON.parse(String(body.get("payload")))).toEqual({ name: "Ad" });
  });

  test("dekont yoksa yalnızca payload gönderilir", async () => {
    const fetchMock = vi.fn(() => jsonResponse({ orderId: "ORD-3" }));
    vi.stubGlobal("fetch", fetchMock);

    await submitTransferOrder({}, null);

    const body = (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as FormData;
    expect(body.get("receipt")).toBeNull();
  });

  test("sunucu hatasını taşır", async () => {
    mockFetch(() => jsonResponse({ error: "Dekont okunamadı." }, false));
    expect(await submitTransferOrder({}, null)).toEqual({ ok: false, error: "Dekont okunamadı." });
  });

  test("ağ hatasında bağlantı mesajı döner", async () => {
    mockFetch(() => {
      throw new Error("offline");
    });
    expect(await submitTransferOrder({}, null)).toEqual({ ok: false, error: CONNECTION_ERROR });
  });
});

describe("validateTransferInput", () => {
  const file = (bytes: number) =>
    new File([new Uint8Array(bytes)], "dekont.pdf", { type: "application/pdf" });

  test("dekont da hesap ismi de yoksa uyarır", () => {
    expect(validateTransferInput(null, "   ", 10)).toMatch(/Dekont yükleyin/);
  });

  test("yalnızca hesap ismi verilmesi yeterli", () => {
    expect(validateTransferInput(null, "Brother Hustle Ltd", 10)).toBeNull();
  });

  test("yalnızca dekont verilmesi yeterli", () => {
    expect(validateTransferInput(file(1024), "", 10)).toBeNull();
  });

  test("sınırı aşan dekontu reddeder", () => {
    // Arrange — 10 MB sınırı; 1 bayt fazlası bile geçmemeli.
    const tooBig = file(10 * 1024 * 1024 + 1);

    // Act & Assert
    expect(validateTransferInput(tooBig, "", 10)).toMatch(/10 MB/);
  });

  test("sınıra eşit dekontu kabul eder", () => {
    expect(validateTransferInput(file(10 * 1024 * 1024), "", 10)).toBeNull();
  });
});
