// Application Constants

// ===== PANEL SETTINGS =====
export const PANEL_SETTINGS = {
  PANEL_WIDTH: 320,
  PANEL_HEIGHT_DEFAULT: 100,
  PANEL_HEIGHT_MAX: 200,
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
  PADDING_X_MIN: 0,
  PADDING_X_MAX: 100,

  // Vertical offset for range inputs
  OFFSET_Y_MAX: 100,
  OFFSET_Y_MIN: -100,
  OFFSET_Y_DEFAULT: 0,

  // Colors
  TEXT_COLOR_DEFAULT: "#ffffff",
} as const;

// ===== IMAGE SETTINGS =====
export const IMAGE_SETTINGS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB

  SUPPORTED_FORMATS: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"] as const,

  DEFAULT_BACKGROUND_IMAGE: "./backgrounds/b1.jpg",

  DEFAULT_HUE: 0,
  HUE_MIN: 0,
  HUE_MAX: 360,

  DEFAULT_CHROMA: 100,
  CHROMA_MIN: 0,
  CHROMA_MAX: 300,

  DEFAULT_BRIGHTNESS: 100,
  BRIGHTNESS_MIN: 0,
  BRIGHTNESS_MAX: 100,

  DEFAULT_CONTRAST: 100,
  CONTRAST_MIN: 50,
  CONTRAST_MAX: 150,
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

export const TEXT_ALIGN_DEFAULT: TextAlignType = TextAlign.CENTER;

export const Theme = {
  DARK: "dark",
  LIGHT: "light",
} as const;

export type ThemeType = (typeof Theme)[keyof typeof Theme];

export const TRANSITION_DURATION = import.meta.env.MODE === "test" ? 0 : 300;
