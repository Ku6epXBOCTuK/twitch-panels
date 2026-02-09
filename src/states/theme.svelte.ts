import { Theme, type ThemeType } from "$lib/constants";
import { STATE_DATA, withPersistence } from "./persisted.svelte";

function createState() {
  let current: ThemeType = $state(Theme.LIGHT);

  return {
    get current() {
      return current;
    },
    set current(value: ThemeType) {
      current = value;
    },
    toggle() {
      current = current === Theme.DARK ? Theme.LIGHT : Theme.DARK;
    },
    get [STATE_DATA]() {
      return {
        current,
      };
    },
    set [STATE_DATA](data: { current: ThemeType }) {
      current = data.current;
    },
  };
}

export const themeState = withPersistence("theme", createState());
