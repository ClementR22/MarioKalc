import { BaseElementData } from "../common/elements";
import { Bodytype } from "./bodytypes";
import { Category } from "./categories";

export type ElementData = BaseElementData & {
  category: Category;
};

export interface ElementDataCharacter extends ElementData {
  category: "character";
}

export interface ElementDataBody extends ElementData {
  category: "body";
  bodytype: Bodytype;
}

// Define the structure for all the stats
export type ElementStats = {
  speedSmooth: number;
  speedRough: number;
  speedWater: number;
  acceleration: number;
  weight: number;
  handlingSmooth: number;
  handlingRough: number;
  handlingWater: number;
  miniTurbo: number;
  coin: number;
};
