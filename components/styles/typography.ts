// theme/typography.js

export const display = {
  // large: { fontSize: 57, fontWeight: "400", lineHeight: 64, letterSpacing: -0.25 },
  medium: { fontSize: 45, fontWeight: "400", lineHeight: 52, letterSpacing: 0 },
  //  small: { fontSize: 36, fontWeight: "400", lineHeight: 44, letterSpacing: 0 },
};

export const headline = {
  large: { fontSize: 25, fontWeight: "700", lineHeight: 40, letterSpacing: 0 },
  medium: { fontSize: 24, fontWeight: "600", lineHeight: 36, letterSpacing: 0 },
  small: { fontSize: 24, fontWeight: "400", lineHeight: 32, letterSpacing: 0 },
};

export const title = {
  large: { fontSize: 22, fontWeight: "700", lineHeight: 28, letterSpacing: 0 },
  medium: { fontSize: 20, fontWeight: "600", lineHeight: 26, letterSpacing: 0.15 },
  small: { fontSize: 16, fontWeight: "400", lineHeight: 20, letterSpacing: 0.1 },
};

export const label = {
  large: { fontSize: 18, fontWeight: "600", lineHeight: 20, letterSpacing: 0.1 },
  // medium: { fontSize: 16, fontWeight: "400", lineHeight: 16, letterSpacing: 0.5 },
  //  small: { fontSize: 16, fontWeight: "500", lineHeight: 16, letterSpacing: 0.5 },
};

export const body = {
  large: { fontSize: 16, fontWeight: "400", lineHeight: 20, letterSpacing: 0.5 },
  medium: { fontSize: 14, fontWeight: "400", lineHeight: 20, letterSpacing: 0.25 },
  small: { fontSize: 12, fontWeight: "400", lineHeight: 16, letterSpacing: 0.4 },
};

// Poids de fonts disponibles
export const fontWeights = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

export const typography = {
  display,
  headline,
  title,
  label,
  body,
};

export type TextRole = keyof typeof typography;
export type TextSize = "large" | "medium" | "small";
export type TextWeight = keyof typeof fontWeights;
