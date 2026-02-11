// useElementsGridLayout.ts

import { useMemo } from "react";
import { useLayout } from "@/contexts/LayoutContext";
import {
  GAP_ELEMENTS_GRID,
  MARGIN_HORIZONTAL_MODAL_CHILDREN_CONTAINER,
  PADDING_PANNEL_PAGINATED,
} from "@/utils/designTokens";

const NUM_COLUMNS = 4;
const ELEMENTS_PER_PAGE = 12;
const NUM_LINES = ELEMENTS_PER_PAGE / NUM_COLUMNS;

export const useElementsGridLayout = () => {
  const { appWidth } = useLayout();

  return useMemo(() => {
    const gridWidth = appWidth - MARGIN_HORIZONTAL_MODAL_CHILDREN_CONTAINER * 2;

    const itemWidth = (gridWidth - PADDING_PANNEL_PAGINATED * 2 - GAP_ELEMENTS_GRID * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

    const itemHeight = itemWidth * 1.1;

    const gridHeight = itemHeight * NUM_LINES + GAP_ELEMENTS_GRID * (NUM_LINES - 1);

    return {
      gridWidth,
      itemWidth,
      itemHeight,
      gridHeight,
    };
  }, [appWidth]);
};
