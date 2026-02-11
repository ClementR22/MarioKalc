import React, { useCallback, memo } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useThemeStore from "@/stores/useThemeStore";
import { BORDER_RADIUS_INF, buttonPressed, GAP_SORT_MODE_SELECTOR } from "@/utils/designTokens";

// Constants
const HEIGHT = 30;
const NAV_BUTTON_WIDTH = 46;

interface PagesNavigatorProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  numberOfPages: number;
}

const PagesNavigator: React.FC<PagesNavigatorProps> = ({ currentPage, setCurrentPage, numberOfPages }) => {
  const theme = useThemeStore((state) => state.theme);

  // Navigation handlers
  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, numberOfPages - 1));
  }, [numberOfPages, setCurrentPage]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  }, [setCurrentPage]);

  const isLeftButtonDisabled = currentPage === 0;
  const isRightButtonDisabled = currentPage === numberOfPages - 1;

  // Dots rendering
  const renderDots = () => {
    return Array.from({ length: numberOfPages }).map((_, index) => (
      <Pressable
        key={`dot-${index}`}
        onPress={() => setCurrentPage(index)}
        style={({ pressed }) => [styles.dotPressable, pressed && buttonPressed]}
      >
        <View style={[styles.dot, { backgroundColor: index === currentPage ? theme.primary : theme.inactive_dot }]} />
      </Pressable>
    ));
  };

  return (
    <View style={styles.paginationControls}>
      <NavButton
        icon="chevron-left"
        onPress={goToPrevPage}
        disabled={isLeftButtonDisabled}
        color={isLeftButtonDisabled ? theme.on_surface_variant : theme.primary}
      />

      <View style={styles.dotsContainer}>{renderDots()}</View>

      <NavButton
        icon="chevron-right"
        onPress={goToNextPage}
        disabled={isRightButtonDisabled}
        color={isRightButtonDisabled ? theme.on_surface_variant : theme.primary}
      />
    </View>
  );
};

const NavButton = memo(
  ({
    icon,
    onPress,
    disabled,
    color,
  }: {
    icon: "chevron-left" | "chevron-right";
    onPress: () => void;
    disabled: boolean;
    color: string;
  }) => (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.navButton, disabled && styles.navButtonDisabled, pressed && buttonPressed]}
    >
      <MaterialCommunityIcons name={icon} size={30} color={color} />
    </Pressable>
  ),
);

const styles = StyleSheet.create({
  paginationControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: HEIGHT,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    gap: GAP_SORT_MODE_SELECTOR,
  },
  navButton: {
    width: NAV_BUTTON_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  dotPressable: {
    height: "100%",
    justifyContent: "center",
  },
  dot: {
    width: 30,
    height: 10,
    borderRadius: BORDER_RADIUS_INF,
  },
});

export default memo(PagesNavigator);
