export type BaseBuildData<TStats extends number[], TClassIds extends number[]> = {
  buildDataId: string;
  classIds: TClassIds;
  stats: TStats;
};

export type Build = {
  buildDataId: string; // référence vers les stats, etc.
  percentage?: number;
};

export type BuildPersistant = {
  buildDataId: string;
  name?: string;
};
