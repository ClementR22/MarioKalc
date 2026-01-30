import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import ButtonAndModal from "../modal/ButtonAndModal";
import Button from "../../primitiveComponents/Button";
import usePressableElementsStore from "@/stores/usePressableElementsStore";
import PannelElementsBottom from "../elementsSelector/PannelElementsBottom";
import "react-native-get-random-values";
import { Bodytype, Build } from "@/types";
import { MARGIN_CONTAINER_LOWEST, PADDING_SEARCH_CONTAINER } from "@/utils/designTokens";
import StatSelector from "../statSelector/StatSelector";
import useGeneralStore from "@/stores/useGeneralStore";
import ButtonIconWithBadge from "../sortModeSelector/ButtonIconWithBadge";
import useStatsStore from "@/stores/useStatsStore";
import useBuildsListStore from "@/stores/useBuildsListStore";
import { useGameData } from "@/hooks/useGameData";
import ElementsDeselector from "../elementsSelector/ElementsDeselector";

interface SearchBuildScreenPressablesContainerProps {
  scrollviewBuildsCardsRef: React.RefObject<any>;
  scrollviewMainRef: React.RefObject<any>;
}

const SearchBuildScreenPressablesContainer: React.FC<SearchBuildScreenPressablesContainerProps> = ({
  scrollviewBuildsCardsRef,
  scrollviewMainRef,
}) => {
  const { categories, buildsDataArray } = useGameData();

  const chosenStats = useStatsStore((state) => state.chosenStats);
  const setBuildsListFound = useBuildsListStore((state) => state.setBuildsListFound);
  const resultsNumber = useGeneralStore((state) => state.resultsNumber);
  const selectedClassIdsByCategory = usePressableElementsStore((state) => state.multiSelectedClassIdsByCategory);
  const setIsLoading = useGeneralStore((state) => state.setIsLoading);

  const [chosenBodytype, setChosenBodytype] = useState<Set<Bodytype>>(new Set());
  const [disableSearch, setDisableSearch] = useState(false);

  const numberOfSelectedClassIds = useMemo(
    () =>
      selectedClassIdsByCategory
        ? Object.values(selectedClassIdsByCategory).reduce((count, category) => count + category.size, 0)
        : 0,
    [selectedClassIdsByCategory],
  );

  useEffect(() => {
    if (disableSearch) {
      setDisableSearch(false);
    }
  }, [chosenStats, chosenBodytype, selectedClassIdsByCategory, resultsNumber]);

  const search = () => {
    const chosenStatsChecked = chosenStats.map((stat) => stat.checked);
    const chosenStatsValue = chosenStats.map((stat) => stat.value);
    const chosenStatsFilterNumber = chosenStats.map((stat) => stat.statFilterNumber);
    const chosenClassIds = selectedClassIdsByCategory;

    const gaps: { buildDataId: string; gap: number }[] = [];

    for (const build of buildsDataArray) {
      const { buildDataId, classIds, stats, bodytypes } = build;

      const isOneElementNonAccepted = categories.some((categoryKey, index) => {
        if (chosenClassIds[categoryKey].size === 0) {
          return false;
        } else {
          return !chosenClassIds[categoryKey].has(classIds[index]);
        }
      });

      if (isOneElementNonAccepted) {
        continue;
      }

      if (chosenBodytype.size && !bodytypes.some((b) => chosenBodytype.has(b))) continue;

      let gap = 0;
      let isValid = true;

      for (let statIndex = 0; statIndex < chosenStatsChecked.length; statIndex++) {
        if (!chosenStatsChecked[statIndex]) continue;

        const setValue = stats[statIndex];
        const chosenValue = Number(chosenStatsValue[statIndex]);
        const statFilterNumber = chosenStatsFilterNumber[statIndex];

        if (statFilterNumber === 2 && setValue !== chosenValue) {
          isValid = false;
          break;
        } else if (statFilterNumber === 1 && setValue < chosenValue) {
          isValid = false;
          break;
        } else {
          gap += ((chosenValue - setValue) / 6) ** 2;
        }
      }

      if (isValid) {
        gaps.push({ buildDataId, gap });
      }
    }

    gaps.sort((a, b) => a.gap - b.gap);

    if (gaps.length === 0) {
      setBuildsListFound([]);
    } else {
      const realResultsNumber = Math.min(resultsNumber, gaps.length);
      const buildsFoundIdGap = gaps.slice(0, realResultsNumber);

      const worstGap = chosenStatsChecked.filter((checked) => checked).length;

      const buildsFound: Build[] = buildsFoundIdGap.map(({ buildDataId, gap }, index) => {
        const percentage = 100 * (1 - Math.sqrt(gap / worstGap));
        const percentageRounded = Number(percentage.toPrecision(3));
        return {
          buildDataId: buildDataId,
          percentage: percentageRounded,
        };
      });

      setBuildsListFound(buildsFound);
    }
  };

  const handleSearch = useCallback(() => {
    setIsLoading(true);
    setDisableSearch(true);
    scrollviewBuildsCardsRef?.current?.scrollToStart();

    setTimeout(() => {
      search();
      setIsLoading(false);
    }, 0);
    scrollviewMainRef?.current?.scrollToEnd();
  }, [search]);

  return (
    <View style={styles.screenPressablesContainer}>
      <StatSelector />

      <Button
        key="button-search"
        onPress={handleSearch}
        tooltipText="search"
        iconKey="magnify"
        disabled={disableSearch}
        flex={1}
      >
        search
      </Button>

      <ButtonAndModal
        modalTitle="filters"
        triggerComponent={
          <ButtonIconWithBadge
            tooltipText="chooseFilters"
            iconProps={{ iconKey: "filter" }}
            badgeText={numberOfSelectedClassIds}
          />
        }
        horizontalScroll={true}
      >
        <PannelElementsBottom
          selectionMode="multiple"
          selectedBodytypes={chosenBodytype}
          setSelectedBodytypes={setChosenBodytype}
        >
          <ElementsDeselector />
        </PannelElementsBottom>
      </ButtonAndModal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenPressablesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: MARGIN_CONTAINER_LOWEST,
    paddingHorizontal: PADDING_SEARCH_CONTAINER,
    gap: MARGIN_CONTAINER_LOWEST,
  },
});

// 24

SearchBuildScreenPressablesContainer.displayName = "SearchBuildScreenPressablesContainer";

export default React.memo(SearchBuildScreenPressablesContainer);
