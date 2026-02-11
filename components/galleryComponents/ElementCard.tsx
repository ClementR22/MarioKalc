import React, { memo, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Category, Stat } from "@/types";
import { BORDER_RADIUS_18, LIST_ITEM_SPACING, PADDING_HORIZONTAL_ELEMENT_CARD } from "@/utils/designTokens";
import useThemeStore from "@/stores/useThemeStore";
import StatGaugeRelativeBar from "../statGaugeElementCard/StatGaugeRelativeBar";
import Text from "@/primitiveComponents/Text";
import StatGaugeContainerElementCard from "../statGaugeElementCard/StatGaugeContainerElementCard";
import StatGaugeBarElementCard from "../statGaugeElementCard/StatGaugeBarElementCard";
import { useGameData } from "@/hooks/useGameData";
import { elementsNamespaceByGame } from "@/translations/namespaces";
import useGameStore from "@/stores/useGameStore";

interface ElementCardProps {
  name: string;
  stats: Stat[];
  category: Category;
}

const ElementCard: React.FC<ElementCardProps> = memo(({ name, stats, category }) => {
  const game = useGameStore((state) => state.game);

  const { maxValues } = useGameData();
  const theme = useThemeStore((state) => state.theme);

  const renderStat = useCallback(
    ({ name, value }: Stat) => (
      <StatGaugeContainerElementCard key={name} name={name}>
        {category !== "character" ? (
          <StatGaugeRelativeBar value={value} maxValue={maxValues[category]} />
        ) : (
          <StatGaugeBarElementCard value={value} maxValue={maxValues[category]} />
        )}
      </StatGaugeContainerElementCard>
    ),
    [maxValues, category],
  );

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.surface_container,
          backgroundColor: theme.surface,
        },
      ]}
    >
      <Text
        role="headline"
        size="small"
        weight="bold"
        style={styles.textWrapper}
        namespace={elementsNamespaceByGame[game]}
      >
        {name}
      </Text>

      <View style={styles.statGaugeGroup}>{stats.map((stat) => renderStat(stat))}</View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS_18,
    borderWidth: 5,
  },
  textWrapper: {
    padding: PADDING_HORIZONTAL_ELEMENT_CARD,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE", // Light separator line
  },
  statGaugeGroup: {
    paddingVertical: LIST_ITEM_SPACING * 2, // Padding for lists
    paddingHorizontal: LIST_ITEM_SPACING * 2, // Consistent padding
    gap: 1,
  },
});

ElementCard.displayName = "ElementCard";

export default ElementCard;
