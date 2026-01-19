// hooks/useImportBuild.ts
import { useCallback } from "react";
import * as Clipboard from "expo-clipboard";
import showToast from "@/utils/showToast";
import { BuildAlreadyExistsError, NameAlreadyExistsError, WrongGameBuildImportedError } from "@/errors/errors";
import { useGameData } from "./useGameData";
import useBuildsActionsStore from "@/stores/useBuildsActionsStore";
import { ScreenName } from "@/contexts/ScreenContext";
import { useModal } from "@/contexts/ModalContext";

export const useImportBuild = (screenName: ScreenName) => {
  const { buildsDataMap } = useGameData();
  const importBuild = useBuildsActionsStore((state) => state.importBuild);
  const modalContext = useModal();

  return useCallback(async () => {
    try {
      const clipboardContent = await Clipboard.getStringAsync();
      importBuild(clipboardContent, screenName, buildsDataMap);
      showToast(screenName === "search" ? "toast:statsImported" : "toast:buildImported", "success");
      modalContext && modalContext.close();
    } catch (e) {
      if (e instanceof BuildAlreadyExistsError) {
        const targetMessage = e.target ? `|toast:in|toast:${e.target}` : "";
        const buildNameMessage = e.buildName ? `|toast:withTheName|${e.buildName}` : "";
        showToast(`error:${e.message}${targetMessage}${buildNameMessage}`, "importError");
      } else if (e instanceof NameAlreadyExistsError) {
        showToast(`error:${e.message}|${e.buildName}`, "importError");
      } else if (e instanceof WrongGameBuildImportedError) {
        showToast(`error:${e.message}|${e.gameTarget}|error:pleaseSwitchGame`, "importError");
      } else {
        showToast(`error:${e.message}`, "importError");
      }
    }
  }, [screenName, buildsDataMap, modalContext, importBuild]);
};
