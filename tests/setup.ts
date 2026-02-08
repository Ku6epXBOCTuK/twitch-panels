import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import "web-animations-js";

declare global {
  var jest: typeof vi;
}

globalThis.jest = vi;

await import("jest-canvas-mock");
