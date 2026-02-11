import { Category } from "@/types";
import { ElementData } from "@/types";
import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { useElementStyle } from "@/hooks/useElementStyle";
import ElementShort from "./ElementShort";
import { GAP_ELEMENTS_GRID, PADDING_PANNEL_PAGINATED } from "@/utils/designTokens";
import { useElementsGridLayout } from "@/hooks/useElementsGridLayout";

interface ElementsSelectorProps {
  elements: ElementData[];
  selectedClassId: Set<number> | number | null;
  onSelectElement: (category: Category, classId: number) => void;
}

export const ELEMENTS_PER_PAGE = 12;

const PADDING_ELEMENTS_GRID = PADDING_PANNEL_PAGINATED;

const ElementsSelector: React.FC<ElementsSelectorProps> = ({ elements, selectedClassId, onSelectElement }) => {
  const { gridWidth, itemWidth, itemHeight } = useElementsGridLayout();

  const fillingElements = Array.from({ length: ELEMENTS_PER_PAGE - elements.length });

  const { elementDynamicStyle, activeBorderStyle } = useElementStyle({ size: itemWidth });

  return (
    <View style={[styles.container, { width: gridWidth }]}>
      {/* pour capturer le scroll */}
      {elements.map((element) => {
        const isSelected =
          selectedClassId instanceof Set ? selectedClassId.has(element.classId) : selectedClassId === element.classId;

        return (
          <ElementShort
            key={element.id}
            imageUrl={element.imageUrl}
            name={element.name}
            isSelected={isSelected}
            onPress={() => onSelectElement(element.category, element.classId)}
            elementDynamicStyle={elementDynamicStyle}
            activeBorderStyle={activeBorderStyle}
          />
        );
      })}
      {fillingElements.map((_, i) => (
        <View key={`empty${i}`} style={{ width: itemWidth, height: itemHeight }} />
      ))}
    </View>
  );
};

// --- StyleSheet definitions ---
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP_ELEMENTS_GRID,
    paddingHorizontal: PADDING_ELEMENTS_GRID,
  },
});

export default memo(ElementsSelector);
