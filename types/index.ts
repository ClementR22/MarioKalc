import * as MK8D from "./mk8d";
import * as MKW from "./mkw";
import { IconKey } from "@/constants/Icons";
export * from "./common";

// Les exports namespaced
// export { MK8D, MKW };

export type Game = "MK8D" | "MKW";

// Types fusionnés
export type Category = MK8D.Category | MK8D.Category;

export type Bodytype = MK8D.Bodytype | MKW.Bodytype;

export type ElementData = MK8D.ElementData | MKW.ElementData;

export type ElementStats = MK8D.ElementStats | MKW.ElementStats;

export type StatName = MK8D.StatName | MKW.StatName | MKW.StatName;

export type Stat = { name: StatName; value: number };

export type SortName = MK8D.SortName | MKW.SortName;

export type SortButtonProps = MK8D.SortButtonProps | MKW.SortButtonProps;

export type ResultStat = MK8D.ResultStat | MKW.ResultStat;

export type ChosenStat = MK8D.ChosenStat | MKW.ChosenStat;

export type BuildData = MK8D.BuildData | MKW.BuildData;

export type SelectedClassIdsByCategory = MK8D.SelectedClassIdsByCategory | MKW.SelectedClassIdsByCategory;

export type MultiSelectedClassIdsByCategory =
  | MK8D.MultiSelectedClassIdsByCategory
  | MKW.MultiSelectedClassIdsByCategory;

export type IconProps = {
  iconKey: IconKey;
  iconColor?: string;
};
