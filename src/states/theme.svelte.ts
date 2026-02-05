export type Theme = "dark" | "light";

function createThemeState() {
  let current: Theme = $state("dark");

  return {
    get theme() {
      return current;
    },
    toggle() {
      current = current === "dark" ? "light" : "dark";
    },
  };
}

export const themeState = createThemeState();
