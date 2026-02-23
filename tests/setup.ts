import "@testing-library/jest-dom/vitest";
import "vitest-canvas-mock";
import { vi } from "vitest";

if (typeof Element !== "undefined") {
  Element.prototype.animate = vi.fn().mockImplementation(() => {
    return {
      finished: Promise.resolve(),
      cancel: vi.fn(),
      pause: vi.fn(),
      play: vi.fn(),
      reverse: vi.fn(),
      finish: vi.fn(),
      persist: vi.fn(),
      currentTime: 0,
      startTime: 0,
    } as unknown as Animation;
  });
}
