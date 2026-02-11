// components/rowSelector/CategorySelector.tsx
import React, { useMemo } from "react";
import { Category, SelectedClassIdsByCategory } from "@/types";
import RowSelector from "./RowSelector";
import useThemeStore from "@/stores/useThemeStore";
import { StyleSheet } from "react-native";
import { BORDER_RADIUS_CATEGORY_SELECTOR } from "@/utils/designTokens";
import { box_shadow_z1 } from "@/components/styles/shadow";
import { useGameData } from "@/hooks/useGameData";
import { useBuildImages } from "@/hooks/useBuildImages";

interface CategorySelectorProps {
  selectedCategory: Category;
  onCategoryPress: (category: Category) => void;
  selectedClassIds?: SelectedClassIdsByCategory;
  isInGalleryScreen?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryPress,
  selectedClassIds,
  isInGalleryScreen = false,
}) => {
  const { categoriesItems } = useGameData();
  const theme = useThemeStore((state) => state.theme);

  const activeStyle = useMemo(() => ({ backgroundColor: theme.primary }), [theme.primary]);

  const buildImages = useBuildImages(selectedClassIds ? Object.values(selectedClassIds) : [], true);

  const options = selectedClassIds ? buildImages : categoriesItems;

  return (
    <RowSelector<Category>
      options={options}
      namespace="categories"
      selectedValues={selectedCategory}
      onSelect={onCategoryPress}
      buttonStyle={styles.button}
      activeStyle={activeStyle}
      containerStyle={
        isInGalleryScreen
          ? styles.containerGallery
          : [styles.containerPannel, { backgroundColor: theme.surface_container }]
      }
    />
  );
};

const styles = StyleSheet.create({
  containerGallery: { flex: 1 },
  containerPannel: {
    borderRadius: BORDER_RADIUS_CATEGORY_SELECTOR,
    borderWidth: 4,
    borderColor: "transparent",
    boxShadow: box_shadow_z1,
  },
  button: {
    flex: 1,
  },
});

export default React.memo(CategorySelector);
