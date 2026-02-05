export type Theme = "dark" | "light";

function createState() {
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

export const themeState = createState();
