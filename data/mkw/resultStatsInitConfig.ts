import { statNames } from "./stats";
import { ResultStat } from "@/types/mkw/stats";
import { StatName } from "@/types/mkw";

const resultStatsDefaultConfig: Record<StatName, boolean> = {
  speedSmooth: true,
  speedRough: false,
  speedWater: false,
  acceleration: true,
  weight: false,
  handlingSmooth: false,
  handlingRough: false,
  handlingWater: false,
  miniTurbo: true,
  coin: false,
};

export const resultStatsDefaultInit: ResultStat[] = statNames.map((statName) => ({
  name: statName,
  checked: resultStatsDefaultConfig[statName],
}));

export const resultStatsSaveScreenInit: ResultStat[] = statNames.map((statName) => ({
  name: statName,
  checked: true,
}));
