import { describe, expect, test, vi } from "vitest";
import { IyzicoTimeoutError, withIyzicoTimeout } from "../iyzico";

describe("withIyzicoTimeout", () => {
  test("SDK zamanında yanıt verirse sonucu döndürür", async () => {
    const result = await withIyzicoTimeout<string>("op", (done) => done(null, "tamam"), 1000);
    expect(result).toBe("tamam");
  });

  test("SDK hata verirse reddeder", async () => {
    await expect(
      withIyzicoTimeout<string>("op", (done) => done(new Error("auth"), undefined as unknown as string), 1000)
    ).rejects.toThrow("auth");
  });

  test("yanıt gelmezse süre dolunca IyzicoTimeoutError ile reddeder", async () => {
    vi.useFakeTimers();
    const pending = withIyzicoTimeout<string>("checkoutFormInitialize", () => {}, 15_000);
    const assertion = expect(pending).rejects.toBeInstanceOf(IyzicoTimeoutError);
    await vi.advanceTimersByTimeAsync(15_000);
    await assertion;
    vi.useRealTimers();
  });

  test("zaman aşımından sonra gelen geç yanıt yok sayılır", async () => {
    vi.useFakeTimers();
    let late: ((err: Error | null, r: string) => void) | undefined;
    const pending = withIyzicoTimeout<string>("op", (done) => { late = done; }, 100);
    const assertion = expect(pending).rejects.toThrow(/100 ms/);
    await vi.advanceTimersByTimeAsync(100);
    await assertion;
    expect(() => late?.(null, "geç")).not.toThrow();
    vi.useRealTimers();
  });

  test("SDK senkron fırlatırsa reddeder ve zamanlayıcıyı bırakır", async () => {
    await expect(
      withIyzicoTimeout<string>("op", () => { throw new Error("TypeError gibi"); }, 1000)
    ).rejects.toThrow("TypeError gibi");
  });
});
