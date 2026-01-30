import React, { useEffect, useRef, useMemo, useState } from "react";
import BuildCardsContainer from "@/components/buildCard/BuildCardsContainer";
import { ScreenProvider } from "@/contexts/ScreenContext";
import useBuildsListStore from "@/stores/useBuildsListStore";
import useGeneralStore from "@/stores/useGeneralStore";
import { BUILD_CARD_COLOR_PALETTE } from "@/constants/Colors";
import useThemeStore from "@/stores/useThemeStore";
import ScreenPressablesContainer from "@/components/screenPressablesContainer/ScreenPressablesContainer";
import ButtonLoadBuild from "@/components/managingBuildsButton/ButtonLoadBuild";
import { ResultStatsProvider } from "@/contexts/ResultStatsContext";
import StatGaugeGroupCompare from "@/components/statGaugeCompare/StatGaugeGroupCompare";
import ScrollViewScreen from "@/components/ScrollViewScreen";
import StatSelector from "@/components/statSelector/StatSelector";
import ButtonIcon from "@/primitiveComponents/ButtonIcon";
import { StyleSheet, View } from "react-native";
import { MARGIN_CONTAINER_LOWEST } from "@/utils/designTokens";

const DisplayBuildScreen = () => {
  const theme = useThemeStore((state) => state.theme);

  const scrollRef = useRef(null); // Ref pour BuildCardsContainer
  const buildsListDisplayed = useBuildsListStore((state) => state.buildsListDisplayed);
  const isScrollEnable = useGeneralStore((state) => state.isScrollEnable);

  const [sortNumber, setSortNumber] = useState(2);

  const isBuildCardsCollapsed = useGeneralStore((state) => state.isBuildCardsCollapsed);
  const toggleIsBuildCardsCollapsed = useGeneralStore((state) => state.toggleIsBuildCardsCollapsed);

  // État local pour stocker l'association nom du build -> Couleur
  const [buildsColorsMap, setBuildsColorsMap] = useState<Map<string, string>>(() => new Map());
  // Ref pour suivre les couleurs disponibles dans la palette (ne déclenche pas de re-render)
  const availableColorsRef = useRef<string[]>([...BUILD_CARD_COLOR_PALETTE]);

  // --- Logique d'attribution des couleurs déplacée ici ---
  useEffect(() => {
    const newColorsMap = new Map<string, string>();
    const colorsCurrentlyInUse = new Set<string>(); // Garde une trace des couleurs utilisées dans le cycle actuel

    // 1. Réutiliser les couleurs pour les builds qui sont toujours présents
    buildsListDisplayed.forEach(({ buildDataId }) => {
      const existingColor = buildsColorsMap.get(buildDataId);
      if (existingColor && BUILD_CARD_COLOR_PALETTE.includes(existingColor)) {
        newColorsMap.set(buildDataId, existingColor);
        colorsCurrentlyInUse.add(existingColor);
      }
    });

    // 2. Mettre à jour le pool de couleurs disponibles
    availableColorsRef.current = BUILD_CARD_COLOR_PALETTE.filter((color) => !colorsCurrentlyInUse.has(color));

    // 3. Attribuer de nouvelles couleurs aux builds qui n'en ont pas (nouveaux builds)
    buildsListDisplayed.forEach((build) => {
      if (!newColorsMap.has(build.buildDataId)) {
        if (availableColorsRef.current.length > 0) {
          const assignedColor = availableColorsRef.current.shift(); // Prend la première couleur disponible
          if (assignedColor) {
            newColorsMap.set(build.buildDataId, assignedColor);
            colorsCurrentlyInUse.add(assignedColor); // Marque comme utilisée
          }
        } else {
          console.warn(`Plus de couleurs uniques disponibles pour le build ${build.buildDataId}`);
        }
      }
    });

    // Mettre à jour l'état du composant avec la nouvelle map de couleurs
    // Cette mise à jour déclenchera un re-render, et les enfants auront la map à jour.
    setBuildsColorsMap(newColorsMap);
  }, [buildsListDisplayed]);

  // --- Fin Logique d'attribution des couleurs ---

  const buildsWithColor = useMemo(
    () =>
      buildsListDisplayed.map((build) => ({
        ...build,
        color: buildsColorsMap?.get(build.buildDataId) || theme.surface_variant,
      })),
    [buildsListDisplayed, buildsColorsMap, theme.surface_variant],
  );

  return (
    <ScreenProvider screenName="display">
      <ScrollViewScreen scrollEnabled={isScrollEnable}>
        <ScreenPressablesContainer sortNumber={sortNumber} setSortNumber={setSortNumber}>
          <ButtonIcon
            onPress={toggleIsBuildCardsCollapsed}
            iconProps={{ iconKey: isBuildCardsCollapsed ? "chevron-down" : "chevron-up" }}
            tooltipText={isBuildCardsCollapsed ? "developBuilds" : "reduceBuilds"}
          />
          <ButtonLoadBuild tooltipText="loadABuild" />
        </ScreenPressablesContainer>

        <ResultStatsProvider>
          <BuildCardsContainer ref={scrollRef} builds={buildsWithColor} />

          <View style={styles.mainButtonWrapper}>
            <StatSelector />
          </View>

          <StatGaugeGroupCompare buildsColorsMap={buildsColorsMap} />
        </ResultStatsProvider>
      </ScrollViewScreen>
    </ScreenProvider>
  );
};

const styles = StyleSheet.create({
  mainButtonWrapper: {
    marginHorizontal: MARGIN_CONTAINER_LOWEST * 2,
  },
});

export default React.memo(DisplayBuildScreen);
