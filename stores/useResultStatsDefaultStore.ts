import { create } from "zustand";
import { saveThingInMemory } from "@/utils/asyncStorageOperations";
import { Game, ResultStat } from "@/types";
import { IS_RESULT_STATS_SYNC_DEFAULT } from "@/config/config";
import { resultStatsDefaultInit as resultStatsDefaultInitMK8D } from "@/data/mk8d";
import { resultStatsDefaultInit as resultStatsDefaultInitMKW } from "@/data/mkw";
import useGameStore from "./useGameStore";

interface ResultStatsDefaultState {
  isResultStatsSync: boolean;
  setIsResultStatsSync: (newValue: boolean) => Promise<void>;

  resultStatsDefault: Record<Game, ResultStat[]>;
  initResultStatsDefault: (initObj: Record<Game, ResultStat[]>) => void;
  setResultStatsDefaultForGame: (list: ResultStat[]) => Promise<void>;
}

const useResultStatsDefaultStore = create<ResultStatsDefaultState>((set, get) => ({
  isResultStatsSync: IS_RESULT_STATS_SYNC_DEFAULT,

  setIsResultStatsSync: async (newValue) => {
    await saveThingInMemory("isResultStatsSync", newValue);
    set({ isResultStatsSync: newValue });
  },

  resultStatsDefault: { MK8D: resultStatsDefaultInitMK8D, MKW: resultStatsDefaultInitMKW },

  initResultStatsDefault: (obj) => set({ resultStatsDefault: obj }),

  setResultStatsDefaultForGame: async (list) => {
    const game = useGameStore.getState().game;

    const current = get().resultStatsDefault;
    const updated = { ...current, [game]: list };

    await saveThingInMemory("resultStatsDefault", updated);
    set({ resultStatsDefault: updated });
  },
}));

export default useResultStatsDefaultStore;
