import { describe, expect, test } from "vitest";
import { logoThumbnailUrl } from "../references";

describe("logoThumbnailUrl", () => {
  test("kendi logo rotamıza genişlik parametresi ekler", () => {
    // Arrange
    const logo = "/api/logo?file=mubnt9io-c43h9f.jpg";

    // Act
    const url = logoThumbnailUrl(logo, 96);

    // Assert
    expect(url).toBe("/api/logo?file=mubnt9io-c43h9f.jpg&w=96");
  });

  test("uzak adrese dokunmaz", () => {
    // Arrange — admin panelinden yapıştırılan adres bizim rotamızdan geçmez.
    const logo = "https://cdn.example.com/marka.png";

    // Act & Act
    expect(logoThumbnailUrl(logo, 96)).toBe(logo);
  });

  test("public klasöründeki yola dokunmaz", () => {
    expect(logoThumbnailUrl("/brand/nokta.svg", 96)).toBe("/brand/nokta.svg");
  });

  test("data: adresine dokunmaz", () => {
    const logo = "data:image/png;base64,iVBORw0KGgo=";
    expect(logoThumbnailUrl(logo, 96)).toBe(logo);
  });

  test("boş logo değerini olduğu gibi döndürür", () => {
    expect(logoThumbnailUrl("", 96)).toBe("");
  });
});
