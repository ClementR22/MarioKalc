export type Terrain = "smooth" | "rough" | "water";

export type StatName =
  | "speedSmooth"
  | "speedRough"
  | "speedWater"
  | "acceleration"
  | "weight"
  | "handlingSmooth"
  | "handlingRough"
  | "handlingWater"
  | "miniTurbo"
  | "coin";

export type StatNameSpeed = Extract<StatName, "speedSmooth" | "speedRough" | "speedWater">;

export type StatNameHandling = Extract<StatName, "handlingSmooth" | "handlingRough" | "handlingWater">;

export type ResultStat = {
  name: StatName;
  checked: boolean;
};

export type ChosenStat = {
  name: StatName;
  checked: boolean;
  value: number | null;
  statFilterNumber: number;
};
