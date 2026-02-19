import { browser } from "$app/environment";

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const DEBOUNCE_DURATION = import.meta.env.MODE === "test" ? 0 : 500;

export interface Persistable<D> {
  toSnapshot(): D;
  fromSnapshot(data: Partial<D>): void;
}

export function withPersistence<D, T extends Persistable<D>>(
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
        state.fromSnapshot(parsed);
      }
    } catch (e) {
      console.error(`Error repairing state for ${key}`, e);
    }
  }

  $effect.root(() => {
    $effect(() => {
      const data = JSON.stringify($state.snapshot(state.toSnapshot()));

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
