// hooks/useElementStyle.ts
import { useMemo } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import useThemeStore from "@/stores/useThemeStore"; // N'oublie pas d'importer useThemeStore
import { box_shadow_z1 } from "@/components/styles/shadow";

interface ElementStyleProps {
  size: number;
}

export const useElementStyle = ({ size }: ElementStyleProps) => {
  const theme = useThemeStore((state) => state.theme);
  // Calcule le style de la carte une seule fois
  const elementDynamicStyle = useMemo(() => {
    return StyleSheet.flatten([
      {
        // Styles de base communs à toutes les cartes
        borderRadius: size / 4,
        borderWidth: size / 20,
        borderColor: "transparent",
        overflow: "hidden",
        alignItems: "center",
        backgroundColor: theme.surface_container,
        width: size,
        height: size * 1.1,
        boxShadow: box_shadow_z1,
      },
    ]) as ViewStyle;
  }, [theme.surface_container]); // Dépendances

  // Calcule le style de la bordure active une seule fois
  const activeBorderStyle = useMemo(() => ({ borderColor: theme.primary }) as ViewStyle, [theme.primary]);

  return {
    elementDynamicStyle,
    activeBorderStyle,
  };
};
