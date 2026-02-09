import { STATE_DATA, withPersistence } from "$states/persisted.svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock localStorage
const localStorageMock = (() => {
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
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

describe("persisted.svelte", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("withPersistence", () => {
    it("should return state unchanged when not in browser", () => {
      const mockState = {
        [STATE_DATA]: { test: "value" },
      };
      const result = withPersistence("test-key", mockState);
      expect(result).toBe(mockState);
    });

    it("should restore state from localStorage when valid JSON exists", () => {
      const savedData = { value: 42, name: "test" };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedData));

      const state = {
        [STATE_DATA]: { value: 0, name: "" },
      };

      withPersistence("test-key", state);

      expect(state[STATE_DATA]).toEqual(savedData);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("test-key");
    });

    it("should handle corrupted JSON in localStorage gracefully", () => {
      localStorageMock.getItem.mockReturnValue("{ invalid json");

      const state = {
        [STATE_DATA]: { value: 0 },
      };

      // Should not throw and state should remain unchanged
      expect(() => withPersistence("test-key", state)).not.toThrow();
      expect(state[STATE_DATA]).toEqual({ value: 0 });
    });

    it("should handle empty localStorage (no saved data)", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const state = {
        [STATE_DATA]: { value: 0 },
      };

      withPersistence("test-key", state);

      expect(state[STATE_DATA]).toEqual({ value: 0 });
    });

    it("should save state to localStorage with debounce", async () => {
      vi.useFakeTimers();
      const state = {
        [STATE_DATA]: { count: 1 },
      };

      withPersistence("test-key", state, 500);

      state[STATE_DATA] = { count: 2 };
      // Wait for effect to set the debounced timeout
      await Promise.resolve();

      // Fast-forward time to trigger debounced save
      vi.advanceTimersByTime(500);

      await Promise.resolve();

      expect(localStorageMock.setItem).toHaveBeenCalledWith("test-key", JSON.stringify({ count: 2 }));

      vi.useRealTimers();
    });

    it("should save state immediately when debounce is 0", async () => {
      const state = {
        [STATE_DATA]: { count: 1 },
      };

      withPersistence("test-key", state, 0);

      state[STATE_DATA] = { count: 2 };

      // Wait for effect to run
      await Promise.resolve();

      expect(localStorageMock.setItem).toHaveBeenCalledWith("test-key", JSON.stringify({ count: 2 }));
    });

    it("should cleanup timeout on state change during debounce", async () => {
      vi.useFakeTimers();
      // const state = {
      //   [STATE_DATA]: { count: 1 },
      // };

      const data = $state({ count: 1 });

      const state = {
        get [STATE_DATA]() {
          return data;
        },
        set [STATE_DATA](v) {
          data.count = v.count;
        },
      };

      withPersistence("test-key", state, 500);

      // First change - sets timeout for count:2
      state[STATE_DATA] = { count: 2 };
      // Let effect run and set the timeout
      await Promise.resolve();

      // Second change before first timeout fires - should clear previous and set new timeout for count:3
      state[STATE_DATA] = { count: 3 };
      // Let effect run and clear old timeout, set new one
      await Promise.resolve();

      // Run only the currently pending timer (the one for count:3)
      vi.runOnlyPendingTimers();
      await Promise.resolve();

      // Should only have saved the latest value (count:3)
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
      expect(localStorageMock.setItem).toHaveBeenCalledWith("test-key", JSON.stringify({ count: 3 }));

      vi.useRealTimers();
    });

    it("should use DEBOUNCE_DURATION constant as default", async () => {
      const state = {
        [STATE_DATA]: { test: true },
      };

      withPersistence("test-key", state);

      // The default debounce should be used (0 in test mode)
      state[STATE_DATA] = { test: false };

      // Wait for effect to run
      await Promise.resolve();

      // In test mode, DEBOUNCE_DURATION is 0, so immediate save
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });
});
