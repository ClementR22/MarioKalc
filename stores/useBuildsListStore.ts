// Third-party libraries
import { create } from "zustand";
import "react-native-get-random-values";

// Data and Types
import { ScreenName } from "@/contexts/ScreenContext";
import { Build, Game, StatName } from "@/types";

// Utilities
import { sortElements } from "@/utils/sortElements";
import useBuildsPersistenceStore from "./useBuildsPersistenceStore";
import useDeckStore from "./useDeckStore";
import { deleteAllSavedBuildsInMemory } from "@/utils/asyncStorageOperations";
import { BuildAlreadyExistsError, NameAlreadyExistsError, NameInvalidError } from "@/errors/errors";
import { t } from "i18next";
import { useGenerateUniqueName } from "@/hooks/useGenerateUniqueName";
import { BuildData } from "@/types";

export const MAX_NUMBER_BUILDS_DISPLAY = 10;
export const MAX_NUMBER_BUILDS_SAVE = 30;

interface BuildsListStoreState {
  buildsListFound: Build[];
  buildsListDisplayed: Build[];
  buildsListSaved: Build[];
  buildEditedDataId: string;
  buildIndexInComparator: number;

  scrollRequest: {
    source: ScreenName;
    buildDataId: string;
  } | null; // id vers lequel scroller
  setScrollRequest: (source: ScreenName, buildDataId: string) => void;

  clearScrollRequest: () => void;

  getBuildsList: (screenName: ScreenName) => {
    buildsList: Build[] | Build[];
    buildsListName: string;
  };
  getSetBuildsList: (screenName: ScreenName) => (newBuildsList: Build[]) => void;

  getBuild: (screenName: ScreenName, buildDataId: string) => Build;

  setBuildsListFound: (newBuildsList: Build[]) => void;
  setBuildsListDisplayed: (newBuildsList: Build[]) => void;
  setBuildsListSaved: (newBuildsList: Build[]) => void;
  deleteAllSavedBuilds: () => Promise<void>;
  setBuildEditedDataId: (buildDataId: string) => void;
  addBuildInDisplay: (buildDataId: string) => void;
  removeBuild: (buildDataId: string, screenName: ScreenName) => Promise<void>;
  renameBuild: (newName: string, screenName: ScreenName, buildDataId: string, isSaved: boolean) => void;
  updateBuildsList: (pressedClassIds: Record<string, number>, screenName: ScreenName) => void;
  sortBuildsList: (
    screenName: ScreenName,
    sortNumber: number,
    buildsDataMap: Map<string, BuildData>,
    statNames: StatName[],
  ) => void;
  findSameBuildInScreen: (params: {
    buildDataId: string;
    buildsList?: Build[];
    screenName?: ScreenName;
  }) => Build | undefined;
}

const useBuildsListStore = create<BuildsListStoreState>((set, get) => ({
  buildsListFound: [],
  buildsListDisplayed: [],
  buildsListSaved: [],

  buildEditedDataId: null,
  buildIndexInComparator: null, // = get().buildsListDisplayed.length

  scrollRequest: null,

  setScrollRequest: (source, buildDataId) => set({ scrollRequest: { source, buildDataId } }),

  clearScrollRequest: () => set({ scrollRequest: null }),

  getBuildsList: (screenName) => {
    let buildsListName: string;

    switch (screenName) {
      case "search":
        buildsListName = "buildsListFound";
        break;
      case "display":
        buildsListName = "buildsListDisplayed";
        break;
      case "save":
        buildsListName = "buildsListSaved";
        break;
    }

    const buildsList = get()[buildsListName];
    return { buildsList, buildsListName };
  },

  getSetBuildsList: (screenName: ScreenName) => {
    let setBuildsListName: string;

    switch (screenName) {
      case "search":
        setBuildsListName = "setBuildsListFound";
        break;
      case "display":
        setBuildsListName = "setBuildsListDisplayed";
        break;
      case "save":
        setBuildsListName = "setBuildsListSaved";
        break;
    }

    const setBuildsList = get()[setBuildsListName];
    return setBuildsList;
  },

  getBuild: (screenName: ScreenName, buildDataId: string) => {
    const buildsList = get().getBuildsList(screenName).buildsList;

    const build = buildsList.find((build) => build.buildDataId === buildDataId);
    return build;
  },

  setBuildsListFound: (newBuildsList) => set({ buildsListFound: newBuildsList }),

  setBuildsListDisplayed: (newBuildsList) => {
    return set({ buildsListDisplayed: newBuildsList });
  },

  setBuildsListSaved: (newBuildsList) => set({ buildsListSaved: newBuildsList }),

  deleteAllSavedBuilds: async () => {
    const unSaveBuild = useDeckStore.getState().unSaveBuild;
    const buildsListSaved = useBuildsListStore.getState().buildsListSaved;
    buildsListSaved.forEach((build) => unSaveBuild(build.buildDataId));

    useBuildsListStore.getState().setBuildsListSaved([]);

    await deleteAllSavedBuildsInMemory();
  },

  setBuildEditedDataId: (buildDataId) => {
    set({ buildEditedDataId: buildDataId });
  },

  addBuildInDisplay: (buildDataId: string) => {
    if (get().buildsListDisplayed.length >= MAX_NUMBER_BUILDS_DISPLAY) {
      throw new Error("buildLimitReached");
    }

    const newIndex = get().buildIndexInComparator;

    set((state) => {
      return {
        buildIndexInComparator: newIndex,
        buildsListDisplayed: [...state.buildsListDisplayed, { buildDataId: buildDataId }], // okk
      };
    });
  },

  removeBuild: async (buildDataId, screenName) => {
    const { buildsList, buildsListName } = get().getBuildsList(screenName);

    const newList = buildsList.filter((build) => build.buildDataId !== buildDataId);
    set({ [buildsListName]: newList });
    if (screenName === "save") {
      await useBuildsPersistenceStore.getState().removeBuildInMemory(buildDataId);

      // mise à jour de la props isSaved dans useDeckStore
      useDeckStore.getState().unSaveBuild(buildDataId);
    }
  },

  renameBuild: (newName, screenName, buildDataId, isSaved) => {
    const build = get().getBuild(screenName, buildDataId);

    // si le nouveau nom est vide
    if (!newName.trim()) {
      newName = "";
    }

    if (newName != "") {
      // interdit les noms du type 5-2, 4-1-6, etc.
      const forbiddenBuildNameRegex = /^\d+(?:-\d+)+$/;

      if (forbiddenBuildNameRegex.test(newName)) {
        throw new NameInvalidError(newName);
      }

      const isNameFree = useDeckStore.getState().checkNameFree(newName);
      if (!isNameFree) {
        throw new NameAlreadyExistsError(newName);
      }
    }

    if (isSaved) {
      useBuildsPersistenceStore.getState().saveBuildInMemory(buildDataId, newName);
    }

    useDeckStore.getState().setBuildName(build.buildDataId, newName);
  },

  updateBuildsList: (selectedClassIdsByCategory, screenName) => {
    const { buildsList, buildsListName } = get().getBuildsList(screenName);
    const deck = useDeckStore.getState().deck;

    const formerBuildDataId = get().buildEditedDataId;

    const newBuildDataId = Object.values(selectedClassIdsByCategory).join("-");

    const sameBuild = get().findSameBuildInScreen({ buildDataId: newBuildDataId, buildsList: buildsList });
    // si le build existe deja dans l'ecran, alors on annule la MAJ du build actuel
    if (sameBuild) {
      const buildName = deck.get(sameBuild.buildDataId)?.name;
      throw new BuildAlreadyExistsError(screenName, buildName);
    }

    const newBuild: Build = { buildDataId: newBuildDataId };

    const buildsListUpdated = buildsList.map((build) => {
      if (build.buildDataId === formerBuildDataId) {
        return newBuild;
      }
      return build;
    });

    set({ [buildsListName]: buildsListUpdated });
    const name = deck.get(formerBuildDataId)?.name;

    // si on est dans dans la collection
    if (screenName === "save") {
      // 1. le build est enregistré donc on met à jour la mémoire
      useBuildsPersistenceStore.getState().removeBuildInMemory(formerBuildDataId);
      useBuildsPersistenceStore.getState().saveBuildInMemory(newBuildDataId, name);
      // 2. on met à jour le deck
      useDeckStore.getState().updateBuildDataId(formerBuildDataId, newBuildDataId);
      return;
    }

    // si on n'est pas dans la collection mais que le build est enregistré
    // (on est dans le comparateur)
    if (deck.get(formerBuildDataId)?.isSaved) {
      // l'instance du build devient indépendante donc on donne un nom à ce nouveau build
      let nameM = `${name} ${t("text:modified")}`;
      const isNameFree = useDeckStore.getState().checkNameFree(nameM);
      const newName = isNameFree ? nameM : useGenerateUniqueName(nameM);

      useDeckStore.getState().setBuildName(newBuildDataId, newName);
    }
  },

  sortBuildsList: (screenName, sortNumber, buildsDataMap, statNames) => {
    const { buildsList, buildsListName } = get().getBuildsList(screenName);

    const buildsListSortable = buildsList.map((build: Build) => {
      const buildName = useDeckStore.getState().deck.get(build.buildDataId)?.name;

      const buildData: BuildData = buildsDataMap.get(build.buildDataId);

      const mappedStats = {};

      statNames.forEach((statName, index) => {
        mappedStats[statName] = buildData.stats[index];
      });

      return {
        name: buildName,
        buildDataId: build.buildDataId,
        ...mappedStats,
      };
    });

    const buildsListSorted = sortElements(buildsListSortable, sortNumber);
    const buildsListSortedLight: Build[] = buildsListSorted.map((build) => {
      const buildDataId = buildsList.find((bld) => bld.buildDataId === build.buildDataId).buildDataId;
      return {
        buildDataId: buildDataId,
      };
    });

    set({ [buildsListName]: buildsListSortedLight });
  },

  findSameBuildInScreen: ({ buildDataId, buildsList, screenName }) => {
    if (!buildsList) {
      buildsList = get().getBuildsList(screenName).buildsList;
    }
    const sameBuild = buildsList.find((build) => build.buildDataId === buildDataId);
    return sameBuild;
  },
}));

export default useBuildsListStore;
