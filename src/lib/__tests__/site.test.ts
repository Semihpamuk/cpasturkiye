import { describe, expect, test } from "vitest";
import { hasRealPhone, phoneDigits, telHref, whatsappHref } from "../site";

describe("telefon yardımcıları", () => {
  test("biçimli numarayı ülke kodlu rakamlara indirger", () => {
    expect(phoneDigits("+90 530 388 03 77")).toBe("905303880377");
    expect(phoneDigits("0530 388 03 77")).toBe("905303880377");
    expect(phoneDigits("+90 (212) 000 00 00")).toBe("902120000000");
  });
  test("tel: ve wa.me bağlantıları", () => {
    expect(telHref("+90 530 388 03 77")).toBe("tel:+905303880377");
    expect(whatsappHref("+90 530 388 03 77")).toBe("https://wa.me/905303880377");
    expect(whatsappHref("0530 388 03 77", "Merhaba")).toBe("https://wa.me/905303880377?text=Merhaba");
  });
  test("placeholder numara gerçek sayılmaz", () => {
    expect(hasRealPhone("+90 (212) 000 00 00")).toBe(false);
    expect(hasRealPhone("+90 530 388 03 77")).toBe(true);
    expect(hasRealPhone("")).toBe(false);
  });
});
