export interface ThemeColor {
  isLight: boolean;
  isDark: boolean;

  theme_surface: "dark" | "light";

  primary: string;
  on_primary: string;
  primary_container: string;
  on_primary_container: string;

  secondary: string;
  on_secondary: string;
  secondary_container: string;
  on_secondary_container: string;

  tertiary: string;
  on_tertiary: string;
  tertiary_container: string;
  on_tertiary_container: string;

  error: string;
  on_error: string;
  error_container: string;
  on_error_container: string;

  disabled: string;
  on_disabled: string;

  surface: string;
  on_surface: string;
  surface_variant: string;
  on_surface_variant: string;
  surface_container_highest: string;
  surface_container_high: string;
  surface_container: string;
  surface_container_low: string;
  surface_container_lowest: string;
  inverse_surface: string;
  inverse_on_surface: string;
  surface_tint: string;

  ground: string;
  antiGravity: string;
  water: string;
  air: string;
  smooth: string;
  rough: string;

  outline: string;
  outline_variant: string;

  scrim: string;
  boxShadow: string;

  primary_hover: string;

  inactive_dot: string;

  toast_background_color: string;
}
