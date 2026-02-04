import "@testing-library/jest-dom";
import { vi } from "vitest";

// Extend global type
declare global {
  var testUtils: {
    createMockFile: (name?: string, size?: number, type?: string) => File;
    createMockPanel: (overrides?: any) => any;
    waitFor: (ms: number) => Promise<void>;
  };
}

// Mock localStorage for testing
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock crypto for testing
Object.defineProperty(window, "crypto", {
  value: {
    randomUUID: () => "test-uuid-12345",
  },
});

// Mock HTMLCanvasElement for Konva testing
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: vi.fn(() => ({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Array(4) })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({ data: new Array(4) })),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
  })),
});

// Mock FileReader for image upload testing
Object.defineProperty(window, "FileReader", {
  value: vi.fn(() => ({
    readAsDataURL: vi.fn(),
    onload: null,
    onerror: null,
    result: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
  })),
});

// Global test utilities
global.testUtils = {
  createMockFile: (name = "test.jpg", size = 1024, type = "image/jpeg") => {
    const blob = new Blob([new ArrayBuffer(size)], { type });
    return new File([blob], name, { type });
  },

  createMockPanel: (overrides = {}) => ({
    id: "test-panel-id",
    backgroundImage: "/backgrounds/b1.jpg",
    text: {
      id: "test-text-id",
      text: "Test Panel",
      fontSize: 18,
      fontFamily: "Arial",
      color: "#ffffff",
      textAlign: "center" as const,
      paddingX: 10,
      verticalOffset: 0,
    },
    height: 100,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    ...overrides,
  }),

  waitFor: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
};

// Export cleanup function for use in individual test files
export function cleanupMocks() {
  vi.clearAllMocks();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
}
