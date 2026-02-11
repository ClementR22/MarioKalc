import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import CategorySelector from "@/components/rowSelector/CategorySelector";
import { Category, ElementData } from "@/types";
import { sortElements } from "@/utils/sortElements";
import ElementCard from "@/components/galleryComponents/ElementCard";
import ElementsList from "@/components/galleryComponents/ElementsList";
import { getSelectedElementData } from "@/utils/getSelectedElementData";
import ScreenPressablesContainer from "@/components/screenPressablesContainer/ScreenPressablesContainer";
import { ScreenProvider } from "@/contexts/ScreenContext";
import { getContainerLowestStyle } from "@/utils/getScreenStyle";
import { LEFT_PANNEL_WIDTH_COLLAPSED, MARGIN_CONTAINER_LOWEST } from "@/utils/designTokens";
import PannelElementsSide from "@/components/galleryComponents/PannelElementsSide";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useGameData } from "@/hooks/useGameData";
import { elementsNamespaceByGame } from "@/translations/namespaces";
import useGameStore from "@/stores/useGameStore";

const GalleryScreen = () => {
  const game = useGameStore((state) => state.game);

  const { elementsDataByCategory, classesStats } = useGameData();
  const { t } = useTranslation(elementsNamespaceByGame[game]);
  const [selectedElementId, setSelectedElementId] = useState(0);
  const [isLeftPannelExpanded, setIsLeftPannelExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>("character");
  const [sortNumber, setSortNumber] = useState(0);

  const categoryElementsSorted = useMemo(() => {
    const elements = elementsDataByCategory?.[selectedCategory];

    // pendant le chargement des données dû à un changement de game
    if (!elements || elements.length === 0) {
      return [];
    }
    const categoryElementsSorted = sortElements<ElementData>(elements, sortNumber, t);
    return categoryElementsSorted;
  }, [elementsDataByCategory, selectedCategory, sortNumber, t]);

  const overlayOpacity = useSharedValue(isLeftPannelExpanded ? 0.5 : 0);

  const elementCard = useMemo(() => {
    if (categoryElementsSorted.length === 0) return null;

    const { selectedElementName, selectedElementStats } = getSelectedElementData(
      categoryElementsSorted,
      selectedElementId,
      classesStats,
    );

    // pendant le chargement dû au changement de game
    if (selectedElementName === "N/A") return null;

    return <ElementCard name={selectedElementName} stats={selectedElementStats} category={selectedCategory} />;
  }, [selectedElementId, game]);
  // dépendances :
  // selectedElementId car ElementCard doit correspondre à selectedElementId
  // game pour réagir au changement de jeu

  const handleElementPress = useCallback(
    (id: number) => {
      if (id === selectedElementId) {
        setIsLeftPannelExpanded(!isLeftPannelExpanded);
      } else {
        setSelectedElementId(id);
        setIsLeftPannelExpanded(false);
      }
    },
    [selectedElementId, isLeftPannelExpanded],
  );

  const handleBackgroundPress = useCallback(() => {
    setIsLeftPannelExpanded(false);
  }, []);

  useEffect(() => {
    setSelectedElementId(categoryElementsSorted[0].id);
  }, [selectedCategory]);

  useEffect(() => {
    setSelectedCategory("character");
    setSelectedElementId(0);
    setIsLeftPannelExpanded(false);
  }, [game]);

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const containerLowestStyle = getContainerLowestStyle("view");

  return (
    <ScreenProvider screenName="gallery" key={game}>
      {/* key pour forcer le re-render quand game change */}
      <View style={containerLowestStyle}>
        <ScrollView
          style={{
            position: "absolute",
            right: MARGIN_CONTAINER_LOWEST,
            bottom: 0,
            left: LEFT_PANNEL_WIDTH_COLLAPSED + MARGIN_CONTAINER_LOWEST,
            top: 156 - 24,
          }}
          contentContainerStyle={{ paddingTop: MARGIN_CONTAINER_LOWEST + 24, paddingBottom: MARGIN_CONTAINER_LOWEST }} // MARGIN_CONTAINER_LOWEST
          showsVerticalScrollIndicator={false}
        >
          {elementCard}
        </ScrollView>

        <Animated.View
          style={[styles.overlay, animatedOverlayStyle]}
          pointerEvents={isLeftPannelExpanded ? "auto" : "none"}
        >
          <Pressable style={styles.flex} onPress={handleBackgroundPress} />
        </Animated.View>

        <ScreenPressablesContainer sortNumber={sortNumber} setSortNumber={setSortNumber}>
          <CategorySelector
            selectedCategory={selectedCategory}
            onCategoryPress={setSelectedCategory}
            isInGalleryScreen={true}
          />
        </ScreenPressablesContainer>

        <PannelElementsSide
          isLeftPannelExpanded={isLeftPannelExpanded}
          setIsLeftPannelExpanded={setIsLeftPannelExpanded}
          overlayOpacity={overlayOpacity}
        >
          <ElementsList
            categoryElementsSorted={categoryElementsSorted}
            selectedElementId={selectedElementId}
            isLeftPannelExpanded={isLeftPannelExpanded}
            onElementPress={handleElementPress}
          />
        </PannelElementsSide>
      </View>
    </ScreenProvider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  flex: {
    flex: 1,
  },
});

GalleryScreen.displayName = "GalleryScreen";

export default memo(GalleryScreen);
