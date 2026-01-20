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

interface BuildsPersistenceStoreState {
  sortNumberSavedBuilds: number;

  setSortNumberSavedBuilds: (newSortNumberSavedBuilds: number) => Promise<void>;
  fetchBuildsSavedKeys: (game: Game) => Promise<string[]>;
  fetchBuildsSaved: (game: Game) => Promise<BuildPersistant[]>;
  saveBuildInMemory: (buildDataId: string, name: string, game: Game) => Promise<void>;
  removeBuildInMemory: (buildDataId: string, game: Game) => Promise<void>;
  loadSortNumberFromMemory: () => Promise<void>;
}

const useBuildsPersistenceStore = create<BuildsPersistenceStoreState>((set, get) => ({
  sortNumberSavedBuilds: SORT_NUMBER_SAVED_BUILDS_DEFAULT,

  setSortNumberSavedBuilds: async (newSortNumberSavedBuilds) => {
    await saveThingInMemory("sortNumberSavedBuilds", newSortNumberSavedBuilds);
    set({ sortNumberSavedBuilds: newSortNumberSavedBuilds });
  },

  fetchBuildsSavedKeys: async (game) => {
    const buildsKeys = await getOnlyBuildsSavedKeysFromMemory(game);
    return buildsKeys;
  },

  fetchBuildsSaved: async (game) => {
    const buildsKeys = await get().fetchBuildsSavedKeys(game);
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

  saveBuildInMemory: async (buildDataId, name, game) => {
    const buildPersistant: BuildPersistant = { buildDataId, name };
    await saveThingInMemory(`${game}:${buildDataId}`, buildPersistant);
  },

  removeBuildInMemory: async (buildDataId, game) => {
    await AsyncStorage.removeItem(`${game}:${buildDataId}`);
  },

  loadSortNumberFromMemory: async () => {
    await loadThingFromMemory("sortNumberSavedBuilds", get().setSortNumberSavedBuilds);
  },
}));

export default useBuildsPersistenceStore;
