import { PanelStorage } from "$lib/utils/panelStorage";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let storage: any;

beforeEach(() => {
  storage = new PanelStorage();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("PanelStorage", () => {
  it("should create storage instance", () => {
    expect(storage).toBeInstanceOf(PanelStorage);
  });
});
