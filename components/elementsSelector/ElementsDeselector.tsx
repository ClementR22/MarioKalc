// components/elementPickerCompact/ElementsDeselector.tsx
import React, { memo, useEffect, useMemo, useRef } from "react";
import usePressableElementsStore from "@/stores/usePressableElementsStore";
import useThemeStore from "@/stores/useThemeStore";
import { Platform, ScrollView, View } from "react-native";
import { useElementStyle } from "@/hooks/useElementStyle";
import { StyleSheet } from "react-native";
import ElementShort from "./ElementShort";
import useGeneralStore from "@/stores/useGeneralStore";
import { BORDER_RADIUS_MODAL_CHILDREN_CONTAINER } from "@/utils/designTokens";
import Text from "@/primitiveComponents/Text";
import { useGameData } from "@/hooks/useGameData";

const ITEM_ELEMENT_WIDTH = 40;
const ELEMENTS_CONTAINER_PADDING = 6;

const ElementsDeselector: React.FC = () => {
  const { elementsDataByClassId } = useGameData();
  const theme = useThemeStore((state) => state.theme);

  const isScrollEnable = useGeneralStore((state) => state.isScrollEnable);

  const scrollViewRef = useRef<ScrollView>(null);

  const multiSelectedClassIdsStore = usePressableElementsStore((state) => state.multiSelectedClassIdsByCategory);
  const toggleMultiSelectElementsByClassId = usePressableElementsStore(
    (state) => state.toggleMultiSelectElementsByClassId,
  );

  const elementsToDisplay = useMemo(() => {
    let elementsToDisplayList = [];
    for (const key in multiSelectedClassIdsStore) {
      if (Object.prototype.hasOwnProperty.call(multiSelectedClassIdsStore, key)) {
        const classIdSet = multiSelectedClassIdsStore[key];
        classIdSet.forEach((classId: number) => {
          const elementsInThisClass = elementsDataByClassId.get(classId);
          if (Array.isArray(elementsInThisClass)) {
            elementsToDisplayList = elementsToDisplayList.concat(elementsInThisClass);
          } else {
            console.warn(`No array found for classId: ${classId} in elementsDataByClassId.`);
          }
        });
      }
    }
    return elementsToDisplayList;
  }, [multiSelectedClassIdsStore, elementsDataByClassId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // besoin d'un delai pour prendre en compte la nouvelle taille de BuildCardsContainer
      scrollViewRef.current?.scrollToEnd();
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [elementsToDisplay]);

  const { elementDynamicStyle, activeBorderStyle } = useElementStyle({
    size: ITEM_ELEMENT_WIDTH,
  }); // Passe la taille commune ici

  const isEmpty = elementsToDisplay.length === 0;

  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        {
          backgroundColor: theme.surface,
        },
      ])}
    >
      <Text role="title" size="small" weight="bold" style={styles.deselectorTitle} namespace="text">
        selected
      </Text>

      {isEmpty ? (
        <Text
          role="body"
          size="large"
          color={theme.on_surface_variant}
          textAlign="center"
          fontStyle="italic"
          style={styles.noItemsText}
          namespace="text"
        >
          none
        </Text>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          horizontal
          persistentScrollbar
          scrollEnabled={isScrollEnable}
          contentContainerStyle={styles.elementsContainer}
          showsHorizontalScrollIndicator={Platform.OS !== "web"}
        >
          {elementsToDisplay.map((item) => (
            <ElementShort
              key={item.name}
              imageUrl={item.imageUrl}
              name={item.name}
              isSelected={true}
              onPress={() => toggleMultiSelectElementsByClassId(item.category, item.classId)}
              elementDynamicStyle={elementDynamicStyle}
              activeBorderStyle={activeBorderStyle}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    gap: 2,
    paddingBottom: ELEMENTS_CONTAINER_PADDING,
    borderRadius: BORDER_RADIUS_MODAL_CHILDREN_CONTAINER,
  },
  deselectorTitle: {
    marginLeft: ELEMENTS_CONTAINER_PADDING,
    marginTop: 2,
  },
  noItemsText: {
    height: ITEM_ELEMENT_WIDTH * 1.1,
  },
  elementsContainer: {
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: ELEMENTS_CONTAINER_PADDING,
  },
});

export default memo(ElementsDeselector);
