import { BaseBuildData } from "../common/builds";
import { Bodytype } from "./bodytypes";

export type BuildData = BaseBuildData<
  [number, number, number, number, number, number, number, number, number, number], // 10 stats MKW
  [number, number] // 2 categories
> & {
  bodytypes: Bodytype[];
};
