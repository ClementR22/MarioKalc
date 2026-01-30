import React, { memo, useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import useGeneralStore from "@/stores/useGeneralStore";
import { IconProps, SortButtonProps, SortName } from "@/types";
import Popover from "../popover/Popover";
import ButtonIconWithBadge from "./ButtonIconWithBadge";
import {
  BUTTON_SIZE,
  GAP_SORT_MODE_SELECTOR,
  MARGIN_CONTAINER_LOWEST,
  PADDING_BOX_CONTAINER,
} from "@/utils/designTokens";
import { useScreen } from "@/contexts/ScreenContext";
import { getCurrentDirection, getSortNameFromSortNumber, sortNameMap } from "@/utils/getSortNameFromSortNumber";
import { vw } from "../styles/theme";
import showToast from "@/utils/showToast";
import { useGameData } from "@/hooks/useGameData";
import useGameStore from "@/stores/useGameStore";
import { sortsNamespaceByGame } from "@/translations/namespaces";
import useThemeStore from "@/stores/useThemeStore";

interface SortModeSelectorProps {
  sortNumber: number;
  setSortNumber: (number: number) => void;
  sortCase: "element" | "build";
  containerStyle?: ViewStyle;
}

const SortModeSelector: React.FC<SortModeSelectorProps> = ({ sortNumber, setSortNumber, sortCase, containerStyle }) => {
  const game = useGameStore((state) => state.game);
  const theme = useThemeStore((state) => state.theme);

  const { statNamesHandling, sortNamesElementDefault, sortNamesBuildCardDefault, statNamesSpeed, sortButtonsConfig } =
    useGameData();

  const screenName = useScreen();
  const isScrollEnable = useGeneralStore((state) => state.isScrollEnable);

  const sortNamesDefault = useMemo(
    () => (sortCase === "element" ? sortNamesElementDefault : sortNamesBuildCardDefault),
    [sortCase, sortNamesElementDefault, sortNamesBuildCardDefault],
  );

  const [currentDirection, setCurrentDirection] = useState<"asc" | "desc">(getCurrentDirection(sortNumber));
  const [activeSort, setActiveSort] = useState<SortName>(getSortNameFromSortNumber(sortNumber) || sortNamesDefault[0]);

  const handlePress = useCallback(
    (sortName: SortName) => {
      const isActive = activeSort === sortName;
      const newDirection = isActive ? (currentDirection === "asc" ? "desc" : "asc") : "asc";

      setActiveSort(sortName);
      setCurrentDirection(newDirection);

      const newOrderInfo = sortNameMap[sortName];
      if (newOrderInfo) {
        setSortNumber(newDirection === "asc" ? newOrderInfo.asc : newOrderInfo.desc);
      }

      showToast(`${sortsNamespaceByGame[game]}:${sortName}|${sortsNamespaceByGame[game]}:${newDirection}`);
    },
    [activeSort, currentDirection, setSortNumber],
  );

  // Fonction générique pour créer un menu tooltip
  const createTooltipMenu = useCallback(
    (key: string, statNames: readonly SortName[], tooltipText: string, iconProps: IconProps) => (
      <Popover
        key={key}
        trigger={(openPopover) => (
          <ButtonIconWithBadge
            tooltipText={tooltipText}
            onPress={openPopover}
            namespace={sortsNamespaceByGame[game]}
            iconProps={iconProps}
            direction={statNames.includes(activeSort) ? currentDirection : undefined}
            isBadge={statNames.includes(activeSort)}
          />
        )}
      >
        {statNames.map((statName) => {
          const iconConfig: SortButtonProps = sortButtonsConfig[statName];
          const isActive = statName === activeSort;
          return (
            <ButtonIconWithBadge
              key={statName}
              onPress={() => handlePress(statName)}
              tooltipText={statName}
              namespace={sortsNamespaceByGame[game]}
              iconProps={{ iconKey: iconConfig.iconKey, iconColor: theme.inverse_on_surface }}
              backgroundColor={theme[iconConfig.backgroundColor]}
              direction={isActive ? currentDirection : undefined}
              isBadge={isActive}
            />
          );
        })}
      </Popover>
    ),
    [sortButtonsConfig, activeSort, currentDirection, theme, handlePress],
  );

  const mainButtons = useMemo(() => {
    return sortNamesDefault.map((sortName) => {
      const iconProps: SortButtonProps = sortButtonsConfig[sortName];
      if (!iconProps) return null;

      // Menus spéciaux
      if (sortName === "speed") {
        return createTooltipMenu("speed", statNamesSpeed, "speed", iconProps);
      }
      if (sortName === "handling") {
        return createTooltipMenu("handling", statNamesHandling, "handling", iconProps);
      }

      // Boutons normaux
      const isActive = sortName === activeSort;
      return (
        <ButtonIconWithBadge
          key={sortName}
          onPress={() => handlePress(sortName)}
          tooltipText={sortName}
          namespace={sortsNamespaceByGame[game]}
          iconProps={iconProps}
          direction={isActive ? currentDirection : undefined}
          isBadge={isActive}
        />
      );
    });
  }, [sortNamesDefault, activeSort, currentDirection, handlePress, createTooltipMenu]);

  const needsScroll = useMemo(() => {
    const numberOfButtons = mainButtons.length;
    const contentWidth = BUTTON_SIZE * numberOfButtons + GAP_SORT_MODE_SELECTOR * (numberOfButtons - 1);
    return contentWidth > vw - 2 * MARGIN_CONTAINER_LOWEST - 2 * PADDING_BOX_CONTAINER;
  }, [mainButtons]);

  const Wrapper = needsScroll ? ScrollView : View;
  const wrapperProps = needsScroll
    ? {
        horizontal: true,
        scrollEnabled: isScrollEnable,
        contentContainerStyle: containerStyle,
      }
    : { style: containerStyle };

  return (
    <Wrapper {...wrapperProps}>
      <View
        style={[
          styles.container,
          { paddingHorizontal: screenName === "search" ? GAP_SORT_MODE_SELECTOR : PADDING_BOX_CONTAINER },
          !needsScroll && styles.spaceAround,
        ]}
      >
        {mainButtons}
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: GAP_SORT_MODE_SELECTOR,
  },
  spaceAround: {
    justifyContent: "space-around",
    flex: 1,
  },
});

export default memo(SortModeSelector);
