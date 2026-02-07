// Application Constants

// ===== PANEL SETTINGS =====
export const PANEL_SETTINGS = {
  PANEL_WIDTH: 320,
  PANEL_HEIGHT_DEFAULT: 100,
  PANEL_HEIGHT_MAX: 200,

  DEFAULT_BACKGROUND_IMAGE: "./backgrounds/b1.jpg",
} as const;

// ===== TYPOGRAPHY =====
export const TYPOGRAPHY = {
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
  FONT_SIZE_DEFAULT: 32,

  // Text limits
  MAX_TEXT_LENGTH: 100,

  // Padding for range inputs
  PADDING_X_DEFAULT: 10,
  PADDING_X_MAX: 100,

  // Vertical offset for range inputs
  VERTICAL_OFFSET_MAX: 100,
  VERTICAL_OFFSET_MIN: -100,

  // Colors
  TEXT_COLOR_DEFAULT: "#ffffff",
} as const;

// ===== IMAGE SETTINGS =====
export const IMAGE_SETTINGS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB

  SUPPORTED_FORMATS: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"] as const,
} as const;

export const SlideDirection = {
  NEXT: "next",
  PREV: "prev",
} as const;

export type SlideDirectionType = (typeof SlideDirection)[keyof typeof SlideDirection];

export const TextAlign = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
} as const;

export type TextAlignType = (typeof TextAlign)[keyof typeof TextAlign];
export const DEFAULT_TEXT_ALIGN: TextAlignType = TextAlign.CENTER;
