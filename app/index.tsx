import React, { useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";

// Components import
import StatSlider from "@/components/statSlider/StatSlider";
import BuildCardsContainer, { BuildCardsContainerHandles } from "@/components/buildCard/BuildCardsContainer";
import SearchBuildScreenPressablesContainer from "@/components/screenPressablesContainer/SearchBuildScreenPressablesContainer";
import ButtonLoadBuild from "@/components/managingBuildsButton/ButtonLoadBuild";
import { ScreenProvider } from "@/contexts/ScreenContext";
import { ResultStatsProvider } from "@/contexts/ResultStatsContext";
import BoxContainer from "@/primitiveComponents/BoxContainer";
import useGeneralStore from "@/stores/useGeneralStore";
import ButtonIcon from "@/primitiveComponents/ButtonIcon";
import { BORDER_RADIUS_CONTAINER_LOWEST, PADDING_SEARCH_CONTAINER, GAP_STAT_GAUGE_GROUP } from "@/utils/designTokens";
import ScrollViewScreen, { ScrollViewScreenHandles } from "@/components/ScrollViewScreen";
import { box_shadow_z1 } from "@/components/styles/shadow";
import Text from "@/primitiveComponents/Text";
import useStatsStore from "@/stores/useStatsStore";
import useBuildsListStore from "@/stores/useBuildsListStore";
import StatGaugeContainer from "@/components/statGauge/StatGaugeContainer";
import StatGaugeBar from "@/components/statGauge/StatGaugeBar";
import { useGameData } from "@/hooks/useGameData";
import { useSlidersCompact } from "@/hooks/useSlidersCompact";

const SearchBuildScreen: React.FC = () => {
  const { statNames } = useGameData();

  const scrollviewBuildsCardsRef = useRef<BuildCardsContainerHandles>(null);
  const scrollviewMainRef = useRef<ScrollViewScreenHandles>(null);

  const isScrollEnable = useGeneralStore((state) => state.isScrollEnable);
  const chosenStats = useStatsStore((state) => state.chosenStats);
  const buildsListFound = useBuildsListStore((state) => state.buildsListFound);

  // Liste des stats visibles (checked)
  const visibleStats = chosenStats.filter((s) => s.checked).map((s) => s.name);

  const { compactByStat, isAllCompact, toggleAll, toggleOne } = useSlidersCompact(statNames, visibleStats);

  const renderedSliders = useMemo(() => {
    return chosenStats.map((stat) => {
      if (!stat.checked) return null;

      const compact = compactByStat[stat.name];

      return compact ? (
        <StatGaugeContainer key={stat.name} name={stat.name} value={stat.value} onPress={() => toggleOne(stat.name)}>
          <StatGaugeBar value={stat.value} statFilterNumber={stat.statFilterNumber} />
        </StatGaugeContainer>
      ) : (
        <StatSlider
          key={stat.name}
          name={stat.name}
          value={stat.value}
          statFilterNumber={stat.statFilterNumber}
          onPress={() => toggleOne(stat.name)}
        />
      );
    });
  }, [chosenStats, compactByStat]);

  return (
    <ScreenProvider screenName="search">
      <ScrollViewScreen scrollEnabled={isScrollEnable} ref={scrollviewMainRef}>
        <BoxContainer
          borderRadius={BORDER_RADIUS_CONTAINER_LOWEST}
          padding={PADDING_SEARCH_CONTAINER}
          boxShadow={box_shadow_z1}
          gap={GAP_STAT_GAUGE_GROUP}
        >
          <View style={styles.searchContainerPressablesContainer}>
            <ButtonIcon
              onPress={toggleAll}
              iconProps={{ iconKey: isAllCompact ? "chevron-down" : "chevron-up" }}
              tooltipText={isAllCompact ? "developSliders" : "reduceSliders"}
            />

            <View style={styles.headerTextContainer}>
              <Text role="headline" size="medium" namespace="text">
                desiredStats
              </Text>
            </View>

            <ButtonLoadBuild tooltipText="loadStatsOfABuild" />
          </View>

          {/* Afficher les sliders memoisés */}
          {renderedSliders}
        </BoxContainer>

        <ResultStatsProvider>
          <SearchBuildScreenPressablesContainer
            scrollviewBuildsCardsRef={scrollviewBuildsCardsRef}
            scrollviewMainRef={scrollviewMainRef}
          />

          <BuildCardsContainer ref={scrollviewBuildsCardsRef} builds={buildsListFound} />
        </ResultStatsProvider>
      </ScrollViewScreen>
    </ScreenProvider>
  );
};

SearchBuildScreen.displayName = "SearchBuildScreen";

export default React.memo(SearchBuildScreen);

const styles = StyleSheet.create({
  searchContainerPressablesContainer: { flexDirection: "row", width: "100%", alignItems: "center", padding: 3 },
  headerTextContainer: { flex: 1, alignItems: "center" },
});
