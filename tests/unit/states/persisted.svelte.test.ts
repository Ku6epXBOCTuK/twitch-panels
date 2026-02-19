import { withPersistence } from "$states/persisted.svelte";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

function createMock() {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
}

describe("persisted.svelte", () => {
  let localStorageMock: ReturnType<typeof createMock>;

  beforeAll(() => {
    localStorageMock = createMock();
    vi.stubGlobal("localStorage", localStorageMock);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("withPersistence", () => {
    it("should return state unchanged when not in browser", () => {
      const data = $state({ test: "value" });
      const mockState = {
        toSnapshot: () => data,
        fromSnapshot: () => {},
      };
      const result = withPersistence("test-key", mockState);
      expect(result).toBe(mockState);
    });

    it("should restore state from localStorage when valid JSON exists", () => {
      interface State {
        value: number;
        name: string;
      }
      const savedData: State = { value: 42, name: "test" };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedData));

      const data: State = $state({ value: 0, name: "" });
      const state = {
        toSnapshot: () => data,
        fromSnapshot: (newData: State) => {
          if (newData.value !== undefined) data.value = newData.value;
          if (newData.name !== undefined) data.name = newData.name;
        },
      };

      withPersistence("test-key", state);

      expect(state.toSnapshot()).toEqual(savedData);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("test-key");
    });

    it("should handle corrupted JSON in localStorage gracefully", () => {
      localStorageMock.getItem.mockReturnValue("{ invalid json");

      const data = $state({ value: 0 });
      const state = {
        toSnapshot: () => data,
        fromSnapshot: () => {},
      };

      expect(() => withPersistence("test-key", state)).not.toThrow();
      expect(state.toSnapshot()).toEqual({ value: 0 });
    });

    it("should handle empty localStorage (no saved data)", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const data = $state({ value: 0 });
      const state = {
        toSnapshot: () => data,
        fromSnapshot: () => {},
      };

      withPersistence("test-key", state);

      expect(state.toSnapshot()).toEqual({ value: 0 });
    });

    it("should save state to localStorage with debounce", async () => {
      vi.useFakeTimers();
      interface State {
        count: number;
      }
      const data: State = $state({ count: 1 });

      const state = {
        toSnapshot: () => data,
        fromSnapshot: (newData: State) => {
          if (newData.count !== undefined) data.count = newData.count;
        },
      };

      withPersistence("test-key", state, 500);

      state.fromSnapshot({ count: 2 });
      await Promise.resolve();

      vi.advanceTimersByTime(500);

      await Promise.resolve();

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "test-key",
        JSON.stringify({ count: 2 }),
      );

      vi.useRealTimers();
    });

    it("should save state immediately when debounce is 0", async () => {
      interface State {
        count: number;
      }
      const data: State = $state({ count: 1 });

      const state = {
        toSnapshot: () => data,
        fromSnapshot: (newData: State) => {
          if (newData.count !== undefined) data.count = newData.count;
        },
      };

      withPersistence("test-key", state, 0);

      state.fromSnapshot({ count: 2 });

      await Promise.resolve();

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "test-key",
        JSON.stringify({ count: 2 }),
      );
    });

    it("should cleanup timeout on state change during debounce", async () => {
      vi.useFakeTimers();
      interface State {
        count: number;
      }
      const data: State = $state({ count: 1 });

      const state = {
        toSnapshot: () => data,
        fromSnapshot: (newData: State) => {
          if (newData.count !== undefined) data.count = newData.count;
        },
      };

      withPersistence("test-key", state, 500);

      state.fromSnapshot({ count: 2 });
      await Promise.resolve();

      state.fromSnapshot({ count: 3 });
      await Promise.resolve();

      vi.runOnlyPendingTimers();
      await Promise.resolve();

      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "test-key",
        JSON.stringify({ count: 3 }),
      );

      vi.useRealTimers();
    });

    it("should use DEBOUNCE_DURATION constant as default", async () => {
      interface State {
        test: boolean;
      }
      const data: State = $state({ test: true });

      const state = {
        toSnapshot: () => data,
        fromSnapshot: (newData: State) => {
          if (newData.test !== undefined) data.test = newData.test;
        },
      };

      withPersistence("test-key", state);

      state.fromSnapshot({ test: false });

      await Promise.resolve();

      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });
});
