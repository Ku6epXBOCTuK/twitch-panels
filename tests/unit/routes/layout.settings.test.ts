import { prerender, ssr } from "$routes/+layout";
import { describe, expect, it } from "vitest";

describe("+layout.ts", () => {
  it("should export ssr as false", () => {
    expect(ssr).toBe(false);
  });

  it("should export prerender as true", () => {
    expect(prerender).toBe(true);
  });
});
