import { Category } from "@/types";
import { ElementData } from "@/types";
import React, { memo } from "react";
import { View, StyleSheet, Dimensions } from "react-native"; // Removed Dimensions
import { useElementStyle } from "@/hooks/useElementStyle";
import ElementShort from "./ElementShort";
import {
  GAP_ELEMENTS_GRID,
  MARGIN_HORIZONTAL_MODAL_CHILDREN_CONTAINER,
  PADDING_PANNEL_PAGINATED,
} from "@/utils/designTokens";
import { vw } from "../styles/theme";

interface ElementsSelectorProps {
  elements: ElementData[];
  selectedClassId: Set<number> | number | null;
  onSelectElement: (category: Category, classId: number) => void;
}

const NUM_COLUMNS = 4;
export const ELEMENTS_PER_PAGE = 12;
const NUM_LINES = ELEMENTS_PER_PAGE / NUM_COLUMNS;

const PADDING_ELEMENTS_GRID = PADDING_PANNEL_PAGINATED;
const ELEMENTS_GRID_WIDTH = vw - MARGIN_HORIZONTAL_MODAL_CHILDREN_CONTAINER * 2;

const ITEM_WIDTH =
  (ELEMENTS_GRID_WIDTH - PADDING_ELEMENTS_GRID * 2 - GAP_ELEMENTS_GRID * (NUM_COLUMNS - 1)) / NUM_COLUMNS;
const ITEM_HEIGHT = ITEM_WIDTH * 1.1;
const FILLING_ELEMENT_STYLE = { width: ITEM_WIDTH, height: ITEM_HEIGHT };

export const ELEMENTS_GRID_HEIGHT = ITEM_HEIGHT * NUM_LINES + GAP_ELEMENTS_GRID * (NUM_LINES - 1);

const ElementsSelector: React.FC<ElementsSelectorProps> = ({ elements, selectedClassId, onSelectElement }) => {
  const fillingElements = Array.from({ length: ELEMENTS_PER_PAGE - elements.length });

  const { elementDynamicStyle, activeBorderStyle } = useElementStyle({ size: ITEM_WIDTH }); // Passe la taille commune ici

  return (
    <View style={styles.container}>
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
        <View key={`empty${i}`} style={FILLING_ELEMENT_STYLE} />
      ))}
    </View>
  );
};

// --- StyleSheet definitions ---
const styles = StyleSheet.create({
  container: {
    width: ELEMENTS_GRID_WIDTH,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP_ELEMENTS_GRID,
    paddingHorizontal: PADDING_ELEMENTS_GRID,
  },
});

export default memo(ElementsSelector);
