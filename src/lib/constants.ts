// Application Constants
// This file contains magic numbers and strings used in JavaScript/TypeScript logic

// ===== PANEL SETTINGS =====
export const PANEL_SETTINGS = {
  // Storage
  STORAGE_KEY: "twitch-panels",
  MAX_PANELS_COUNT: 50,

  // Dimensions
  PANEL_WIDTH: 320,
  PANEL_HEIGHT_DEFAULT: 100,
  PANEL_HEIGHT_MAX: 1000,

  // Default values
  DEFAULT_BACKGROUND_IMAGE: "/backgrounds/b1.jpg",
} as const;

// ===== TYPOGRAPHY =====
export const TYPOGRAPHY = {
  // Font families
  FONT_FAMILY_DEFAULT: "Arial",
  FONT_FAMILIES: [
    "Arial",
    "Verdana",
    "Georgia",
    "Times New Roman",
    "Courier New",
    "Impact",
    "Comic Sans MS",
    "Trebuchet MS",
  ],

  // Font sizes for range inputs
  FONT_SIZE_MIN: 10,
  FONT_SIZE_MAX: 72,
  FONT_SIZE_DEFAULT: 18,

  // Text alignment
  TEXT_ALIGN_LEFT: "left",
  TEXT_ALIGN_CENTER: "center",
  TEXT_ALIGN_RIGHT: "right",

  // Text limits
  MAX_TEXT_LENGTH: 100,

  // Padding for range inputs
  PADDING_X_DEFAULT: 10,
  PADDING_X_LARGE: 20,
  PADDING_X_MAX: 50,

  // Vertical offset for range inputs
  VERTICAL_OFFSET_MAX: 50,
  VERTICAL_OFFSET_MIN: -50,

  // Colors
  TEXT_COLOR_DEFAULT: "#ffffff",
  TEXT_COLOR_ERROR: "#c62828",
} as const;

// ===== IMAGE SETTINGS =====
export const IMAGE_SETTINGS = {
  // File sizes
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB

  // Supported formats
  SUPPORTED_FORMATS: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"] as const,
} as const;

// ===== UI SETTINGS =====
export const UI_SETTINGS = {
  // Steps
  STEPS: {
    UPLOAD: "upload",
    CROP: "crop",
    TEXT: "text",
  } as const,
} as const;

// ===== ERROR HANDLING =====
export const ERROR_HANDLING = {
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
} as const;
