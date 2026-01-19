import { IconType } from "react-native-dynamic-vector-icons";
import { useCallback, useMemo } from "react";
import { ScreenName } from "@/contexts/ScreenContext";
import useBuildsActionsStore from "@/stores/useBuildsActionsStore";
import { ActionName, ActionNamesList } from "./useBuildCardConfig";
import showToast from "@/utils/showToast";
import useBuildsListStore from "@/stores/useBuildsListStore";
import usePressableElementsStore from "@/stores/usePressableElementsStore";
import { BuildAlreadyExistsError } from "@/errors/errors";
import { useGameData } from "./useGameData";
import { Platform } from "react-native";
import { useModal } from "@/contexts/ModalContext";
import useEditBuildModalStore from "@/stores/useEditBuildModalStore";

export interface ActionIconProps {
  title: string;
  name: string;
  type: IconType;
  onPress: () => void;
}

export function useActionIconPropsList(
  actionNamesToGenerate: ActionNamesList,
  screenName: ScreenName,
  isInLoadBuildModal: boolean,
  buildDataId: string,
  isSaved?: boolean,
): ActionIconProps[] {
  const { buildsDataMap, categories } = useGameData();

  const source = isInLoadBuildModal ? "save" : screenName;

  const updateSelectionFromBuild = usePressableElementsStore((state) => state.updateSelectionFromBuild);
  const setBuildEditedDataId = useBuildsListStore((state) => state.setBuildEditedDataId);
  const loadToSearch = useBuildsActionsStore((state) => state.loadToSearch);
  const loadToDisplay = useBuildsActionsStore((state) => state.loadToDisplay);
  const saveBuild = useBuildsActionsStore((state) => state.saveBuild);
  const unSaveBuild = useBuildsActionsStore((state) => state.unSaveBuild);
  const removeBuild = useBuildsListStore((state) => state.removeBuild);
  const exportBuild = useBuildsActionsStore((state) => state.exportBuild);
  const setScrollRequest = useBuildsListStore((state) => state.setScrollRequest);
  const modalContext = useModal();
  const openEditBuildModal = useEditBuildModalStore((state) => state.openEditBuildModal);

  const handleEditPress = useCallback(() => {
    setBuildEditedDataId(buildDataId);
    updateSelectionFromBuild(buildsDataMap.get(buildDataId).classIds, categories);
    openEditBuildModal();
  }, [buildDataId, setBuildEditedDataId, updateSelectionFromBuild, openEditBuildModal]);

  const handleLoadToSearchPress = useCallback(() => {
    loadToSearch({ source, buildDataId }, buildsDataMap);
    showToast("toast:buildStatsHaveBeenLoadedInTheFinder", "success", 3000);
    modalContext && modalContext.close();
  }, [source, buildDataId, loadToSearch]);

  const handleLoadToDisplayPress = useCallback(() => {
    try {
      loadToDisplay({ source, buildDataId });
      showToast("toast:buildHasBeenLoadedInTheComparator", "success", 3000);
      modalContext && modalContext.close();
    } catch (e) {
      if (e instanceof BuildAlreadyExistsError) {
        // e.buildName peut etre undefined
        // en effet, parfois il est inutile de le donner
        // par exemple quand le build en conflit est égal au build à charger

        // Construction du message avec sécurité
        const targetMessage = e.target ? `|toast:in|toast:${e.target}` : "";
        const buildNameMessage = e.buildName ? `|toast:withTheName|${e.buildName}` : "";

        const fullMessage = `error:${e.message}${targetMessage}${buildNameMessage}`;

        showToast(fullMessage, "error");
      } else if (e instanceof Error) {
        // Erreur générique : on affiche son message si c’est un vrai Error
        showToast(`error:${e.message}`, "error");
      } else {
        // Cas où c’est un type inconnu (throw d’un string ou d’un objet brut)
        console.error("Unexpected error:", e);
        showToast("error:unknownError", "error");
      }
    }
  }, [source, buildDataId, loadToDisplay]);

  const handleSavePress = useCallback(async () => {
    try {
      if (!isSaved) {
        await saveBuild(source, buildDataId);
        showToast("toast:buildHasBeenSaved", "success", 4000);
      } else {
        await unSaveBuild(buildDataId);
        showToast("toast:buildHasBeenUnsaved", "success");
      }
    } catch (e) {
      showToast(`error:${e.message}`, "error");
    }
  }, [source, buildDataId, isSaved, saveBuild, unSaveBuild]);

  const handleRemovePress = useCallback(() => {
    removeBuild(buildDataId, source);
    showToast("toast:buildHasBeenDeleted", "success");
  }, [source, buildDataId, removeBuild, setScrollRequest]);

  const handleExportPress = useCallback(() => {
    try {
      exportBuild(source, buildDataId);
      showToast("toast:buildCopiedInClipboard", "success", 4000);
    } catch (e) {
      showToast(`error:${e.message}`, "error");
    }
  }, [source, buildDataId, exportBuild]);

  if (isInLoadBuildModal) {
    const actionIconPropsList: ActionIconProps[] = [
      {
        title: screenName === "search" ? "loadTheStats" : "loadTheBuild",
        name: "check",
        type: IconType.FontAwesome5,
        onPress: screenName === "search" ? handleLoadToSearchPress : handleLoadToDisplayPress,
      },
    ];
    return actionIconPropsList;
  }

  const actionIconPropsList: ActionIconProps[] = useMemo(() => {
    const allActionsDefs: Record<ActionName, ActionIconProps> = {
      edit: {
        title: "editTheBuild",
        name: "edit",
        type: IconType.MaterialIcons,
        onPress: handleEditPress,
      },
      loadToSearch: {
        title: isInLoadBuildModal ? "loadTheStats" : "loadTheStatsToSearchScreen",
        name: isInLoadBuildModal ? "check" : "magnify",
        type: isInLoadBuildModal ? IconType.FontAwesome5 : IconType.MaterialCommunityIcons,
        onPress: handleLoadToSearchPress,
      },
      loadToDisplay: {
        title: isInLoadBuildModal ? "loadTheBuild" : "loadTheBuildToDisplayScreen",
        name: isInLoadBuildModal ? "check" : "compare",
        type: isInLoadBuildModal ? IconType.FontAwesome5 : IconType.MaterialCommunityIcons,
        onPress: handleLoadToDisplayPress,
      },
      save: {
        title: "save",
        name: isSaved ? "content-save-check" : "content-save-outline",
        type: IconType.MaterialCommunityIcons,
        onPress: handleSavePress,
      },
      remove: {
        title: "remove",
        name: source === "save" ? "trash-can" : "close",
        type: source === "save" ? IconType.MaterialCommunityIcons : IconType.AntDesign,
        onPress: handleRemovePress,
      },
      share: {
        title: "share",
        name: Platform.OS === "ios" ? "share-outline" : "share",
        type: Platform.OS === "ios" ? IconType.Ionicons : IconType.MaterialIcons,
        onPress: handleExportPress,
      },
    };

    return actionNamesToGenerate.map((actionName) => allActionsDefs[actionName]);
  }, [
    actionNamesToGenerate,
    buildDataId,
    source,
    isInLoadBuildModal,
    isSaved,
    modalContext,
    setBuildEditedDataId,
    updateSelectionFromBuild,
    loadToSearch,
    loadToDisplay,
    saveBuild,
    unSaveBuild,
    removeBuild,
    exportBuild,
    openEditBuildModal,
  ]);

  return actionIconPropsList;
}
