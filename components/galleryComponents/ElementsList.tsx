import useThemeStore from "@/stores/useThemeStore";
import React, { memo, useEffect, useMemo, useRef } from "react";
import { FlatList, Platform } from "react-native";
import ElementLong from "./ElementLong";
import { ElementData } from "@/types";
import { LIST_ITEM_SPACING } from "@/utils/designTokens";

interface ElementsListProps {
  categoryElementsSorted: ElementData[];
  selectedElementId: number;
  isLeftPannelExpanded: boolean;
  onElementPress: (elementId: number) => void;
}

const ElementsList: React.FC<ElementsListProps> = memo(
  ({ categoryElementsSorted, selectedElementId, isLeftPannelExpanded, onElementPress }) => {
    const theme = useThemeStore((state) => state.theme);

    const { activeStyle, inactiveStyle } = useMemo(
      () => ({
        activeStyle: {
          containerDynamic: { backgroundColor: theme.primary },
          textColorDynamic: theme.on_primary,
        },
        inactiveStyle: {
          containerDynamic: { backgroundColor: theme.surface },
        },
      }),
      [theme],
    );

    const flatListRef = useRef<FlatList<ElementData>>(null);

    // Auto scroll vers le haut quand la liste change
    useEffect(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: false });
      }
    }, [categoryElementsSorted]);

    return (
      <FlatList
        ref={flatListRef}
        data={categoryElementsSorted}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedElementId;
          const elementStyle = isSelected ? activeStyle : inactiveStyle;
          return (
            <ElementLong
              name={item.name}
              imageUrl={item.imageUrl}
              onPress={() => onElementPress(item.id)}
              isSelected={isSelected}
              isCollapsed={!isLeftPannelExpanded}
              style={elementStyle}
            />
          );
        }}
        contentContainerStyle={{ paddingHorizontal: LIST_ITEM_SPACING, paddingVertical: LIST_ITEM_SPACING / 2 }}
        showsVerticalScrollIndicator={Platform.OS !== "web"}
      />
    );
  },
);

ElementsList.displayName = "ElementsList";

export default ElementsList;
