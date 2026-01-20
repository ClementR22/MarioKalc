import { create } from "zustand";
import * as Clipboard from "expo-clipboard";
import "react-native-get-random-values";
import { router } from "expo-router";

// Data and Types
import { ScreenName } from "@/contexts/ScreenContext";
import { MAX_NUMBER_BUILDS_DISPLAY, MAX_NUMBER_BUILDS_SAVE } from "./useBuildsListStore";
import { Build, Game } from "@/types";

// Utilities
import { checkFormatBuildImported } from "@/utils/checkFormatBuildImported";

// Stores
import useStatsStore from "./useStatsStore";
import useBuildsListStore from "./useBuildsListStore";
import useBuildsPersistenceStore from "./useBuildsPersistenceStore";
import useGeneralStore from "./useGeneralStore";
import useDeckStore from "./useDeckStore";
import { t } from "i18next";
import { BuildAlreadyExistsError, WrongGameBuildImportedError } from "@/errors/errors";
import { useGenerateUniqueName } from "@/hooks/useGenerateUniqueName";
import { BuildData } from "@/types";
import useGameStore from "./useGameStore";
import { numberOfCategories as numberOfCategoriesMK8D } from "@/data/mk8d";
import { numberOfCategories as numberOfCategoriesMKW } from "@/data/mkw";

interface BuildsActionsStoreState {
  loadBuildCard: (params: {
    source?: ScreenName;
    buildDataId?: string;
    build?: Build;
    name?: string;
    target: ScreenName;
  }) => void;
  loadToSearch: (
    params: { source?: ScreenName; buildDataId?: string; build?: Build },
    buildsDataMap: Map<string, BuildData>,
  ) => void;
  loadToDisplay: (params: { source: ScreenName; buildDataId: string }) => void;
  loadBuildsSaved: () => Promise<void>;
  saveBuild: (source: ScreenName, buildDataId: string) => Promise<void>;
  unSaveBuild: (buildDataId: string, game: Game) => Promise<void>;
  exportBuild: (screenName: ScreenName, buildDataId: string) => void;
  importBuild: (clipboardContent: string, screenName: ScreenName, buildsDataMap: Map<string, BuildData>) => void;
}

const useBuildsActionsStore = create<BuildsActionsStoreState>((set, get) => ({
  loadBuildCard: (params: {
    source?: ScreenName;
    buildDataId?: string;
    build?: Build;
    name?: string;
    target: ScreenName;
  }) => {
    const { source, buildDataId, build: providedBuild, name: providedName, target } = params;

    // on récupère build depuis les props ou bien on le calcule
    // et on retire percentage
    let build: Build;
    if (providedBuild) {
      const { percentage, ...build_ } = providedBuild;
      build = build_;
    } else {
      const { percentage, ...build_ } = useBuildsListStore.getState().getBuild(source, buildDataId);
      build = build_;
    }

    let name: string;
    if (providedName) {
      name = providedName;
    } else {
      name = useDeckStore.getState().deck.get(build.buildDataId)?.name;
    }

    const buildsListTarget = useBuildsListStore.getState().getBuildsList(target).buildsList;

    const sameBuild = useBuildsListStore
      .getState()
      .findSameBuildInScreen({ buildDataId: build.buildDataId, screenName: target });

    if (sameBuild) {
      const sameBuildName = useDeckStore.getState().deck.get(sameBuild.buildDataId).name;
      name = sameBuildName || build.buildDataId;
      throw new BuildAlreadyExistsError(target, providedName && sameBuildName);
      // la 2e props buildName est donnée seulement si providedName est défini càd
      // seulement si on est dans le cas d'une importation
    }

    // vérification de la limit de builds
    if (
      (target === "display" && buildsListTarget.length >= MAX_NUMBER_BUILDS_DISPLAY) ||
      (target === "save" && buildsListTarget.length >= MAX_NUMBER_BUILDS_SAVE)
    ) {
      throw new Error("buildLimitReachedInThisScreen");
    }

    const newBuildsListTarget = [...buildsListTarget, build];

    const setBuildsListTarget = useBuildsListStore.getState().getSetBuildsList(target);
    setBuildsListTarget(newBuildsListTarget);
  },

  loadToSearch: (params: { source?: ScreenName; buildDataId?: string; build?: Build }, buildsDataMap) => {
    const { source, buildDataId, build: providedBuild } = params;

    // on récupère build depuis les props ou bien on le calcule
    // pas nécessaire de retirer percentage
    let build: Build;
    if (providedBuild) {
      build = providedBuild;
    } else {
      build = useBuildsListStore.getState().getBuild(source, buildDataId);
    }

    const stats = buildsDataMap.get(build.buildDataId).stats;

    useStatsStore.getState().loadBuildStats(stats);

    router.push({ pathname: "/", params: { scrollToTop: "true" } });
    useGeneralStore.getState().setShouldScrollToTop();
  },

  loadToDisplay: (params: { source: ScreenName; buildDataId: string }) => {
    const { source, buildDataId } = params;

    get().loadBuildCard({ source, buildDataId, target: "display" });

    router.push({ pathname: "/DisplayBuildScreen", params: { scrollToTop: "true" } });
    useGeneralStore.getState().setShouldScrollToTop();
  },

  loadBuildsSaved: async () => {
    const game = useGameStore.getState().game;
    const buildsPersistant = await useBuildsPersistenceStore.getState().fetchBuildsSaved(game);
    const buildsListSaved: Build[] = buildsPersistant.map((buildPersistant) => ({
      buildDataId: buildPersistant.buildDataId,
    }));

    useBuildsListStore.getState().setBuildsListSaved(buildsListSaved);
    useDeckStore.getState().loadBuildsSaved(buildsPersistant);
  },

  saveBuild: async (source: ScreenName, buildDataId: string) => {
    const buildsListSaved = useBuildsListStore.getState().buildsListSaved;
    if (buildsListSaved.length >= MAX_NUMBER_BUILDS_SAVE) {
      throw new Error("buildLimitReachedInThisScreen");
    }

    const build = useBuildsListStore.getState().getBuild(source, buildDataId);

    const name = useDeckStore.getState().deck.get(buildDataId)?.name;

    get().loadBuildCard({ build: build, target: "save" });
    const game = useGameStore.getState().game;
    await useBuildsPersistenceStore.getState().saveBuildInMemory(buildDataId, name, game);
    useDeckStore.getState().saveBuild(build.buildDataId);
  },

  unSaveBuild: async (buildDataId, game) => {
    await useBuildsListStore.getState().removeBuild(buildDataId, "save", game);
  },

  exportBuild: (screenName, buildDataId) => {
    const build = useBuildsListStore.getState().getBuild(screenName, buildDataId);
    const name = useDeckStore.getState().deck.get(build.buildDataId)?.name;

    const json = JSON.stringify({ name: name, buildDataId: build.buildDataId });
    Clipboard.setStringAsync(json + "\n" + t("text:tutoImportation"));
  },

  importBuild: (clipboardContent: string, screenName: ScreenName, buildsDataMap) => {
    let parsedBuild: unknown;

    // Cherche le premier JSON dans le texte
    const match = clipboardContent.match(/\{[^{}]*\}/);
    if (!match) {
      throw new Error("incorrectFormat");
    }

    try {
      parsedBuild = JSON.parse(match[0]);
    } catch (e) {
      throw new Error("incorrectFormat");
    }

    if (!checkFormatBuildImported(parsedBuild)) {
      throw new Error("incorrectFormat");
    }

    const { buildDataId, name } = parsedBuild;

    const numberOfCategoriesBuildImported = buildDataId.split("-").length;
    const gameTarget: Game =
      numberOfCategoriesBuildImported === numberOfCategoriesMKW
        ? "MKW"
        : numberOfCategoriesBuildImported === numberOfCategoriesMK8D
          ? "MK8D"
          : null;
    const gameCurrent = useGameStore.getState().game;
    if (gameTarget != gameCurrent) {
      throw new WrongGameBuildImportedError(gameTarget);
    }

    const build: Build = { buildDataId };

    if (screenName === "search") {
      get().loadToSearch({ build }, buildsDataMap);
    } else {
      const isNameFree = useDeckStore.getState().checkNameFree(name);
      const newName = isNameFree ? name : useGenerateUniqueName(name);

      get().loadBuildCard({ build, name: newName, target: screenName });
      useDeckStore.getState().setBuildName(buildDataId, newName);

      if (screenName === "save") {
        const game = useGameStore.getState().game;
        useBuildsPersistenceStore.getState().saveBuildInMemory(buildDataId, newName, game);
      }
    }
  },
}));

export default useBuildsActionsStore;
