import React, { useState, memo, useMemo, useCallback, useRef } from "react";
import { FlatList, Platform, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { Category } from "@/types";
import usePressableElementsStore from "@/stores/usePressableElementsStore";
import SortModeSelector from "../sortModeSelector/SortModeSelector";
import { sortElements } from "@/utils/sortElements";
import ButtonIcon from "@/primitiveComponents/ButtonIcon";
import { Bodytype } from "@/types";
import BodytypesSelector from "../rowSelector/BodytypesSelector";
import useThemeStore from "@/stores/useThemeStore";
import CategorySelector from "../rowSelector/CategorySelector";
import ElementsSelector, { ELEMENTS_GRID_HEIGHT, ELEMENTS_PER_PAGE } from "./ElementsSelector";
import PagesNavigator from "./PagesNavigator";
import {
  BORDER_RADIUS_STANDARD,
  BUTTON_SIZE,
  GAP_SORT_MODE_SELECTOR,
  PADDING_PANNEL_PAGINATED,
} from "@/utils/designTokens";
import Separator from "../Separator";
import { useTranslation } from "react-i18next";
import { ElementData } from "@/types";
import { useGameData } from "@/hooks/useGameData";
import useGameStore from "@/stores/useGameStore";
import { elementsNamespaceByGame } from "@/translations/namespaces";
import { IconKey } from "@/constants/Icons";

interface ElementShortSelectorPannelProps {
  selectionMode?: "single" | "multiple";
  selectedBodytypes?: Set<Bodytype>;
  setSelectedBodytypes?: React.Dispatch<React.SetStateAction<Set<Bodytype>>>;
  children?: React.ReactNode;
}

const PannelElementsBottom: React.FC<ElementShortSelectorPannelProps> = ({
  selectionMode = "single",
  selectedBodytypes,
  setSelectedBodytypes,
  children,
}) => {
  const game = useGameStore((state) => state.game);

  const { t } = useTranslation(elementsNamespaceByGame[game]);
  const { elementsDataByCategory } = useGameData();

  const theme = useThemeStore((state) => state.theme);
  const pagerRef = useRef<PagerView>(null);
  const flatlistRef = useRef<FlatList>(null);

  const [selectedCategory, setSelectedCategory] = useState<Category>("character");
  const [sortNumber, setSortNumber] = useState(0);
  const [isOpenSortView, setIsOpenSortView] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const categoryElementsSorted = useMemo<ElementData[]>(
    () => sortElements<ElementData>(elementsDataByCategory[selectedCategory], sortNumber, t),
    [selectedCategory, sortNumber, t],
  );

  const numberOfPages = useMemo(() => {
    return Math.ceil(categoryElementsSorted.length / ELEMENTS_PER_PAGE);
  }, [categoryElementsSorted.length]);

  const pages = useMemo(() => {
    return Array.from({ length: numberOfPages }, (_, i) => {
      const start = i * ELEMENTS_PER_PAGE;
      return categoryElementsSorted.slice(start, start + ELEMENTS_PER_PAGE);
    });
  }, [categoryElementsSorted, numberOfPages]);

  const isFilterMode = selectionMode === "multiple";

  const selectedClassId = usePressableElementsStore((state) =>
    isFilterMode
      ? state.multiSelectedClassIdsByCategory[selectedCategory]
      : state.selectedClassIdsByCategory[selectedCategory],
  );

  const selectedClassIds = usePressableElementsStore((state) => state.selectedClassIdsByCategory);

  const selectElementsByClassId = usePressableElementsStore((state) => state.selectElementsByClassId);

  const toggleMultiSelectElementsByClassId = usePressableElementsStore(
    (state) => state.toggleMultiSelectElementsByClassId,
  );

  const handleSelectElement = useMemo(
    () => (isFilterMode ? toggleMultiSelectElementsByClassId : selectElementsByClassId),
    [selectElementsByClassId, toggleMultiSelectElementsByClassId, isFilterMode],
  );

  const toggleOpenSortView = useCallback(() => setIsOpenSortView((prev) => !prev), []);

  // Track si on est en navigation programmatique
  const isProgrammaticScroll = useRef(false);

  // Gestion du changement de page
  const handleSetPage = useCallback((page: number | ((prev: number) => number)) => {
    setCurrentPage((prev) => {
      const newPage = typeof page === "function" ? page(prev) : page;
      isProgrammaticScroll.current = true;
      pagerRef.current?.setPage(newPage);
      flatlistRef.current?.scrollToIndex({ index: newPage });
      return newPage;
    });
  }, []);

  // Synchronisation quand on swipe manuellement
  const handlePageSelected = useCallback((e: any) => {
    const selectedPage = e.nativeEvent.position;

    // Si c'est un scroll programmatique, on ignore
    if (isProgrammaticScroll.current) {
      isProgrammaticScroll.current = false;
      return;
    }

    // Sinon c'est un swipe manuel, on met à jour
    setCurrentPage(selectedPage);
  }, []);

  // Reset de la page quand on change de catégorie
  const handleCategoryChange = useCallback((category: Category) => {
    setSelectedCategory(category);
    setCurrentPage(0);
    isProgrammaticScroll.current = true;
    pagerRef.current?.setPageWithoutAnimation(0);
  }, []);

  const { iconKey, tooltipText }: { iconKey: IconKey; tooltipText: string } = isOpenSortView
    ? { iconKey: "car-sports", tooltipText: "filterBodytypes" }
    : { iconKey: "sort", tooltipText: "sortElements" };

  return (
    <>
      {children}

      <View style={styles.middleContainer}>
        {isFilterMode && (
          <>
            <View style={styles.buttonToggleWrapper}>
              <ButtonIcon onPress={toggleOpenSortView} iconProps={{ iconKey }} tooltipText={tooltipText} />
            </View>
            <Separator direction="vertical" length={BUTTON_SIZE} />
          </>
        )}
        <View style={styles.controlsContainer}>
          {isOpenSortView || !isFilterMode ? (
            <SortModeSelector sortNumber={sortNumber} setSortNumber={setSortNumber} sortCase="element" />
          ) : (
            <View style={styles.bodytypeSelectorWrapper}>
              <BodytypesSelector selectedBodytypes={selectedBodytypes} setSelectedBodytypes={setSelectedBodytypes} />
            </View>
          )}
        </View>
      </View>

      <View style={[styles.paginatedWrapperContainer, { backgroundColor: theme.surface }]}>
        <View style={styles.categorySelectorWrapper}>
          <CategorySelector
            selectedCategory={selectedCategory}
            onCategoryPress={handleCategoryChange}
            selectedClassIds={!isFilterMode && selectedClassIds}
          />
        </View>

        {Platform.OS === "web" ? (
          <FlatList
            ref={flatlistRef}
            data={pages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <ElementsSelector
                  elements={item}
                  selectedClassId={selectedClassId}
                  onSelectElement={handleSelectElement}
                />
              );
            }}
            horizontal
            pagingEnabled
            getItemLayout={(_, index) => ({
              length: 300,
              offset: 300 * index,
              index,
            })}
          />
        ) : (
          <PagerView ref={pagerRef} style={styles.pagerView} initialPage={0} onPageSelected={handlePageSelected}>
            {pages.map((pageElements, index) => (
              <ElementsSelector
                key={`page-${index}`}
                elements={pageElements}
                selectedClassId={selectedClassId}
                onSelectElement={handleSelectElement}
              />
            ))}
          </PagerView>
        )}

        <View style={styles.navigatorWrapper}>
          <PagesNavigator currentPage={currentPage} setCurrentPage={handleSetPage} numberOfPages={numberOfPages} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  middleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
    height: 54,
  },
  buttonToggleWrapper: { marginHorizontal: GAP_SORT_MODE_SELECTOR },
  controlsContainer: { flex: 1 },
  bodytypeSelectorWrapper: { marginHorizontal: GAP_SORT_MODE_SELECTOR },
  paginatedWrapperContainer: {
    borderRadius: BORDER_RADIUS_STANDARD,
    overflow: "hidden",
    paddingVertical: PADDING_PANNEL_PAGINATED,
    gap: PADDING_PANNEL_PAGINATED,
  },
  categorySelectorWrapper: {
    paddingHorizontal: PADDING_PANNEL_PAGINATED,
  },
  pagerView: {
    height: ELEMENTS_GRID_HEIGHT,
  },
  navigatorWrapper: {
    paddingHorizontal: PADDING_PANNEL_PAGINATED,
  },
});

export default memo(PannelElementsBottom);
