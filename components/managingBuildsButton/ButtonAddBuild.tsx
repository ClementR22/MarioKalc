import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { ScrollView } from "react-native";
import ButtonIcon from "../../primitiveComponents/ButtonIcon";
import showToast from "@/utils/showToast";
import useBuildsListStore, { MAX_NUMBER_BUILDS_DISPLAY } from "@/stores/useBuildsListStore";
import { useBuildController } from "@/hooks/useBuildController";

interface ButtonAddBuildProps {
  scrollRef: React.RefObject<ScrollView>;
}

const ButtonAddBuild: React.FC<ButtonAddBuildProps> = ({ scrollRef }) => {
  const buildController = useBuildController(); // Nouveau hook propre
  const buildsListDisplayed = useBuildsListStore((state) => state.buildsListDisplayed);

  const timeoutRef = useRef(null);

  const disabled = useMemo(() => buildsListDisplayed.length >= MAX_NUMBER_BUILDS_DISPLAY, [buildsListDisplayed.length]);

  const handleAdd = useCallback(() => {
    try {
      buildController.addRandomBuildInDisplay();
    } catch (e) {
      showToast(`error:${e.message}`, "error");
      return; // Ne pas scroller en cas d'erreur
    }

    timeoutRef.current = setTimeout(() => {
      scrollRef?.current?.scrollToEnd({ animated: true });
    }, 50);
  }, [scrollRef, buildController]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return <ButtonIcon onPress={handleAdd} tooltipText="addABuild" iconProps={{ iconKey: "plus" }} disabled={disabled} />;
};

export default React.memo(ButtonAddBuild);
