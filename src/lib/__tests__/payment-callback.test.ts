import { describe, expect, test } from "vitest";
import {
  buildPaidOrder,
  decideCallbackOutcome,
  resolveConversationId,
  resolveInstallmentKey,
} from "../payment-callback";
import type { PendingOrder } from "@/lib/db";
import type { IyzicoRetrieveResult } from "@/lib/iyzico";

function successResult(overrides: Partial<IyzicoRetrieveResult> = {}): IyzicoRetrieveResult {
  return {
    status: "success",
    paymentStatus: "SUCCESS",
    paymentId: "pay_1",
    conversationId: "conv_1",
    price: "30000",
    paidPrice: "30000",
    installment: 1,
    buyer: {
      name: "iyzico Ad",
      gsmNumber: "+905000000000",
      email: "iyzico@example.com",
      identityNumber: "11111111111",
    },
    billingAddress: { address: "iyzico Adres", city: "Ankara" },
    ...overrides,
  };
}

function pendingOrder(overrides: Partial<PendingOrder> = {}): PendingOrder {
  return {
    conversationId: "conv_1",
    createdAt: "2026-09-24T10:00:00.000Z",
    name: "Pending Ad",
    phone: "+905111111111",
    email: "pending@example.com",
    storeUrl: "https://trendyol.com/magaza",
    marketplaces: ["trendyol"],
    addManagement: true,
    discountCode: "INDIRIM10",
    setupNet: 30000,
    managementMonthly: 17000,
    managementAddon: 15300,
    discountAmount: 3000,
    vatAmount: 8460,
    total: 50760,
    invoiceType: "company",
    identityNo: "2222222222",
    companyName: "Pending Ltd",
    taxOffice: "Beşiktaş",
    taxNumber: "3333333333",
    address: "Pending Adres",
    city: "İstanbul",
    termsAcceptedAt: "2026-09-24T10:01:00.000Z",
    gaClientId: "GA1.1.1",
    fbp: "fb.1.1",
    clientIp: "1.2.3.4",
    userAgent: "Mozilla/5.0",
    ...overrides,
  };
}

const BUILD_META = { conversationId: "conv_1", id: "order_1", createdAt: "2026-09-24T11:00:00.000Z" };

describe("resolveInstallmentKey", () => {
  test("tek çekimi 'single' olarak eşler", () => {
    expect(resolveInstallmentKey(1)).toBe("single");
  });

  test("iyzico'ya açtığımız tüm taksit seçeneklerini tanır", () => {
    // Arrange — initialize rotası enabledInstallments [1, 2, 3, 6, 9] gönderiyor.
    // Act & Assert
    expect(resolveInstallmentKey(2)).toBe("2");
    expect(resolveInstallmentKey(3)).toBe("3");
    expect(resolveInstallmentKey(6)).toBe("6");
    expect(resolveInstallmentKey(9)).toBe("9");
  });

  test("metin olarak gelen taksit sayısını da çözer", () => {
    expect(resolveInstallmentKey("6")).toBe("6");
  });

  test("taksit bilgisi yoksa tek çekim sayar", () => {
    expect(resolveInstallmentKey(undefined)).toBe("single");
    expect(resolveInstallmentKey(null)).toBe("single");
  });

  test("tanımadığımız taksit sayısında tek çekime düşer", () => {
    // Arrange — 12 taksit açmıyoruz; gelirse kayıt uydurma bir değer taşımasın.
    expect(resolveInstallmentKey(12)).toBe("single");
    expect(resolveInstallmentKey(0)).toBe("single");
    expect(resolveInstallmentKey(-3)).toBe("single");
  });

  test("sayı olmayan değerde tek çekime düşer", () => {
    expect(resolveInstallmentKey("abc")).toBe("single");
    expect(resolveInstallmentKey({})).toBe("single");
  });
});

describe("resolveConversationId", () => {
  test("iyzico'nun değerini önceler", () => {
    expect(resolveConversationId("iyz", "cb", "tok")).toBe("iyz");
  });

  test("iyzico vermezse callback formundakine düşer", () => {
    expect(resolveConversationId(undefined, "cb", "tok")).toBe("cb");
  });

  test("ikisi de yoksa token kullanılır — pending kaydı bu anahtarla silinecek", () => {
    expect(resolveConversationId(undefined, undefined, "tok")).toBe("tok");
  });
});

describe("buildPaidOrder", () => {
  test("pending kayıt varsa tutar ve fatura bilgileri ondan gelir", () => {
    // Arrange — iyzico 30.000 diyor ama müşterinin gördüğü tutar 50.760.
    const pending = pendingOrder();

    // Act
    const order = buildPaidOrder({ result: successResult(), pending, ...BUILD_META });

    // Assert
    expect(order.total).toBe(50760);
    expect(order.name).toBe("Pending Ad");
    expect(order.email).toBe("pending@example.com");
    expect(order.invoiceType).toBe("company");
    expect(order.companyName).toBe("Pending Ltd");
    expect(order.discountCode).toBe("INDIRIM10");
    expect(order.vatAmount).toBe(8460);
  });

  test("pending kayıt yoksa sipariş iyzico verisinden kurulur — kayıp sipariş olmaz", () => {
    // Act
    const order = buildPaidOrder({ result: successResult(), pending: null, ...BUILD_META });

    // Assert
    expect(order.total).toBe(30000);
    expect(order.name).toBe("iyzico Ad");
    expect(order.email).toBe("iyzico@example.com");
    expect(order.identityNo).toBe("11111111111");
    expect(order.city).toBe("Ankara");
    expect(order.status).toBe("paid");
  });

  test("pending'de sıfır tutar korunur, iyzico değerine kaymaz", () => {
    // Arrange — indirimle sıfırlanmış kalem. `||` kullanılsaydı 30000'e kayardı.
    const pending = pendingOrder({ discountAmount: 0, managementAddon: 0 });

    // Act
    const order = buildPaidOrder({ result: successResult(), pending, ...BUILD_META });

    // Assert
    expect(order.discountAmount).toBe(0);
    expect(order.managementAddon).toBe(0);
  });

  test("pending yokken paidPrice yoksa price'a düşer", () => {
    // Arrange
    const result = successResult({ paidPrice: undefined, price: "12345" });

    // Act & Assert
    expect(buildPaidOrder({ result, pending: null, ...BUILD_META }).total).toBe(12345);
  });

  test("pending yokken hiç tutar gelmezse sıfır yazar, NaN değil", () => {
    // Arrange
    const result = successResult({ paidPrice: undefined, price: undefined });

    // Act
    const order = buildPaidOrder({ result, pending: null, ...BUILD_META });

    // Assert — NaN diske yazılırsa JSON'da null olur ve rapor toplamlarını bozar.
    expect(order.total).toBe(0);
    expect(Number.isNaN(order.total)).toBe(false);
  });

  test("iyzico alanları eksikse boş metin yazar, 'undefined' değil", () => {
    // Arrange
    const result = successResult({ buyer: undefined, billingAddress: undefined });

    // Act
    const order = buildPaidOrder({ result, pending: null, ...BUILD_META });

    // Assert
    expect(order.name).toBe("");
    expect(order.address).toBe("");
    expect(order.identityNo).toBe("");
  });

  test("taksitli ödemeyi kayda doğru geçirir", () => {
    // Arrange
    const result = successResult({ installment: 2 });

    // Act & Assert
    expect(buildPaidOrder({ result, pending: pendingOrder(), ...BUILD_META }).installment).toBe("2");
  });

  test("izleme kimliklerini pending'den taşır", () => {
    // Act
    const order = buildPaidOrder({
      result: successResult(),
      pending: pendingOrder(),
      ...BUILD_META,
    });

    // Assert — havale akışında bu kimlikler günler sonra kullanılıyor.
    expect(order.gaClientId).toBe("GA1.1.1");
    expect(order.fbp).toBe("fb.1.1");
    expect(order.clientIp).toBe("1.2.3.4");
    expect(order.userAgent).toBe("Mozilla/5.0");
  });

  test("ödeme yöntemi ve durumu her zaman sabittir", () => {
    const order = buildPaidOrder({ result: successResult(), pending: null, ...BUILD_META });
    expect(order.paymentMethod).toBe("card");
    expect(order.status).toBe("paid");
    expect(order.conversationId).toBe("conv_1");
    expect(order.paymentId).toBe("pay_1");
  });
});

describe("decideCallbackOutcome", () => {
  test("token yoksa hata döner", () => {
    expect(decideCallbackOutcome(null, null, null)).toEqual({ kind: "error", reason: "no_token" });
  });

  test("iyzico status=failure gönderdiyse doğrulamaya bile gitmez", () => {
    expect(decideCallbackOutcome("tok", "failure", null)).toEqual({ kind: "failure" });
  });

  test("doğrulama başarısızsa hata kodunu taşır", () => {
    // Arrange
    const result = { status: "failure" as const, paymentStatus: "FAILURE", errorCode: "10051" };

    // Act & Assert
    expect(decideCallbackOutcome("tok", null, result)).toEqual({
      kind: "failure",
      reason: "10051",
    });
  });

  test("status success ama paymentStatus değilse ödeme sayılmaz", () => {
    // Arrange — bu ayrım atlanırsa tahsil edilmemiş sipariş 'paid' kaydedilirdi.
    const result = { status: "success" as const, paymentStatus: "INIT_THREEDS" };

    // Act & Assert
    expect(decideCallbackOutcome("tok", null, result).kind).toBe("failure");
  });

  test("hata kodu yoksa 'unknown' der", () => {
    const result = { status: "failure" as const };
    expect(decideCallbackOutcome("tok", null, result)).toEqual({
      kind: "failure",
      reason: "unknown",
    });
  });

  test("doğrulama başarılıysa ödeme alınmış sayılır", () => {
    const result = { status: "success" as const, paymentStatus: "SUCCESS" };
    expect(decideCallbackOutcome("tok", null, result)).toEqual({ kind: "paid" });
  });
});
