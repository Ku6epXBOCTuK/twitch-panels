import { Theme, type ThemeType } from "$lib/constants";
import { withPersistence, type Persistable } from "./persisted.svelte";

export interface Theme {
  current: ThemeType;
}

export class ThemeState implements Persistable<Theme> {
  current: ThemeType = $state(Theme.LIGHT);

  toggle() {
    this.current = this.current === Theme.DARK ? Theme.LIGHT : Theme.DARK;
  }

  toSnapshot(): Theme {
    return {
      current: this.current,
    };
  }

  fromSnapshot(data: Partial<Theme>): void {
    if (data.current !== undefined) {
      this.current = data.current;
    }
  }
}

export const themeState = withPersistence("theme", new ThemeState());
