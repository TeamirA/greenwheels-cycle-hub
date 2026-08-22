import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

// API_BASE_URL is computed at module-evaluation time from import.meta.env,
// so each scenario needs a fresh module import with a different env value.
describe("API_BASE_URL", () => {
  const originalEnv = { ...import.meta.env };

  afterEach(() => {
    vi.unstubAllEnvs();
    Object.assign(import.meta.env, originalEnv);
    vi.resetModules();
  });

  it("falls back to the local dev server when VITE_API_BASE_URL is unset", async () => {
    // vi.stubEnv can't represent "unset" (empty string is still truthy for ??
    // in the sense that it isn't null/undefined) so mutate the env object
    // directly to simulate a genuinely missing var.
    // @ts-expect-error - deliberately deleting for the test
    delete import.meta.env.VITE_API_BASE_URL;
    const { API_BASE_URL } = await import("./config");
    expect(API_BASE_URL).toBe("http://127.0.0.1:8000");
  });

  it("uses VITE_API_BASE_URL when set, so the console can reach production", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://www.green-wheels.pro.et");
    const { API_BASE_URL } = await import("./config");
    expect(API_BASE_URL).toBe("https://www.green-wheels.pro.et");
  });
});
