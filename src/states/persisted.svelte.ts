import { browser } from "$app/environment";

export const STATE_DATA = Symbol("state-data");
export const DEBOUNCE_DURATION = import.meta.env.MODE === "test" ? 0 : 500;

type OnlyData<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

export interface Persistable<D> {
  [STATE_DATA]: D;
}

export function withPersistence<D extends object, T extends Persistable<D>>(
  key: string,
  state: T,
  debounceMs = DEBOUNCE_DURATION,
): T {
  if (!browser) return state;

  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);

      if (parsed) {
        state[STATE_DATA] = parsed;
      }
    } catch (e) {
      console.error(`Error repairing state for ${key}`, e);
    }
  }

  $effect.root(() => {
    $effect(() => {
      const data = JSON.stringify($state.snapshot(state[STATE_DATA]));

      if (debounceMs > 0) {
        const timeout = setTimeout(() => localStorage.setItem(key, data), debounceMs);
        return () => clearTimeout(timeout);
      } else {
        localStorage.setItem(key, data);
      }
    });
  });

  return state;
}
