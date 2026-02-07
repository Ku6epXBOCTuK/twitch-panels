export type Theme = "dark" | "light";

function createState() {
  let current: Theme = $state("dark");

  return {
    get theme() {
      return current;
    },
    set theme(value: Theme) {
      current = value;
    },
    toggle() {
      current = current === "dark" ? "light" : "dark";
    },
  };
}

export const themeState = createState();
