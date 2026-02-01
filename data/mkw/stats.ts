import { StatNameHandling, StatName, StatNameSpeed, ChosenStat } from "@/types/mkw/stats";
import { SortNameElementDefault, SortNameBuildCardDefault, StatNameSortDefault } from "@/types/mkw/sorts";

export const statNames: StatName[] = [
  "speedSmooth",
  "speedRough",
  "speedWater",
  "acceleration",
  "weight",
  "handlingSmooth",
  "handlingRough",
  "handlingWater",
  "miniTurbo",
  "coin",
];

export const statNamesCompact = {
  speedSmooth: "SS",
  speedRough: "SR",
  speedWater: "SW",
  acceleration: "Acc",
  weight: "Wei",
  handlingSmooth: "HS",
  handlingRough: "HR",
  handlingWater: "HW",
  miniTurbo: "MTu",
  coin: "Coi",
};

const statNamesSortDefault: StatNameSortDefault[] = [
  "speed", // A special button to open the speed-specific sorting sub-menu
  "acceleration",
  "weight",
  "handling", // A special button to open the handling-specific sorting sub-menu
  "miniTurbo",
  "coin",
];

export const sortNamesBuildCardDefault: SortNameBuildCardDefault[] = ["name", ...statNamesSortDefault];
export const sortNamesElementDefault: SortNameElementDefault[] = ["id", ...sortNamesBuildCardDefault];

export const statNamesSpeed: StatNameSpeed[] = ["speedSmooth", "speedRough", "speedWater"];

export const statNamesHandling: StatNameHandling[] = ["handlingSmooth", "handlingRough", "handlingWater"];

const chosenStatsSelectedInit: StatName[] = ["speedSmooth", "acceleration", "miniTurbo"];

export const chosenStatsInit: ChosenStat[] = statNames.map((name) => ({
  name,
  checked: chosenStatsSelectedInit.includes(name),
  value: 0,
  statFilterNumber: 0,
}));
