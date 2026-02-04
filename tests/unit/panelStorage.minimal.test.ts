// Use global test functions with globals enabled in config

import { PanelStorage } from "$lib/utils/panelStorage";

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
