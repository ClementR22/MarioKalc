import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Data and Types
import { BuildPersistant, Game } from "@/types";

// Utilities
import {
  getOnlyBuildsSavedKeysFromMemory,
  loadThingFromMemory,
  saveThingInMemory,
} from "@/utils/asyncStorageOperations";
import { SORT_NUMBER_SAVED_BUILDS_DEFAULT } from "@/config/config";
import useGameStore from "./useGameStore";

interface BuildsPersistenceStoreState {
  sortNumberSavedBuilds: number;

  setSortNumberSavedBuilds: (newSortNumberSavedBuilds: number) => Promise<void>;
  fetchBuildsSavedKeys: () => Promise<string[]>;
  fetchBuildsSaved: () => Promise<BuildPersistant[]>;
  saveBuildInMemory: (buildDataId: string, name: string) => Promise<void>;
  removeBuildInMemory: (buildDataId: string) => Promise<void>;
  loadSortNumberFromMemory: () => Promise<void>;
}

const useBuildsPersistenceStore = create<BuildsPersistenceStoreState>((set, get) => ({
  sortNumberSavedBuilds: SORT_NUMBER_SAVED_BUILDS_DEFAULT,

  setSortNumberSavedBuilds: async (newSortNumberSavedBuilds) => {
    await saveThingInMemory("sortNumberSavedBuilds", newSortNumberSavedBuilds);
    set({ sortNumberSavedBuilds: newSortNumberSavedBuilds });
  },

  fetchBuildsSavedKeys: async () => {
    const buildsKeys = await getOnlyBuildsSavedKeysFromMemory();
    return buildsKeys;
  },

  fetchBuildsSaved: async () => {
    const buildsKeys = await get().fetchBuildsSavedKeys();
    const buildsValues = await AsyncStorage.multiGet(buildsKeys);
    const buildsValuesParsed: BuildPersistant[] = buildsValues
      .map(([, value]) => {
        try {
          return value ? JSON.parse(value) : null;
        } catch (e) {
          console.error("Error parsing saved build:", e);
          return null;
        }
      })
      .filter((buildPersistant) => buildPersistant !== null) as BuildPersistant[];
    return buildsValuesParsed;
  },

  saveBuildInMemory: async (buildDataId, name) => {
    const game = useGameStore.getState().game;
    const buildPersistant: BuildPersistant = { buildDataId, name };
    await saveThingInMemory(`${game}:${buildDataId}`, buildPersistant);
  },

  removeBuildInMemory: async (buildDataId) => {
    const game = useGameStore.getState().game;
    await AsyncStorage.removeItem(`${game}:${buildDataId}`);
  },

  loadSortNumberFromMemory: async () => {
    await loadThingFromMemory("sortNumberSavedBuilds", get().setSortNumberSavedBuilds);
  },
}));

export default useBuildsPersistenceStore;
