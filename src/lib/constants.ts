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

  HUE_DEFAULT: 0,
  HUE_MIN: 0,
  HUE_MAX: 360,

  SATURATION_DEFAULT: 0,
  SATURATION_MIN: -20,
  SATURATION_MAX: 50,
  SATURATION_DIVIDER: 10,

  LUMINANCE_DEFAULT: 0,
  LUMINANCE_MIN: -100,
  LUMINANCE_MAX: 100,
  LUMINANCE_DIVIDER: 100,

  BRIGHTNESS_DEFAULT: 100,
  BRIGHTNESS_MIN: 0,
  BRIGHTNESS_MAX: 200,
  BRIGHTNESS_DIVIDER: 100,

  CONTRAST_DEFAULT: 0,
  CONTRAST_MIN: -100,
  CONTRAST_MAX: 100,
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
