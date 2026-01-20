import { useGameData } from "./useGameData";
import useBuildsListStore, { MAX_NUMBER_BUILDS_DISPLAY } from "@/stores/useBuildsListStore";
import { getRandomDataId } from "@/utils/getRandomDataId";

export function useBuildController() {
  const { numberOfClassesByCategory } = useGameData();
  const addBuildInDisplay = useBuildsListStore((s) => s.addBuildInDisplay);
  const buildsListDisplayed = useBuildsListStore((s) => s.buildsListDisplayed);

  function addRandomBuildInDisplay() {
    if (buildsListDisplayed.length >= MAX_NUMBER_BUILDS_DISPLAY) {
      throw new Error("buildLimitReached");
    }

    const forbiddenBuildDataIds = buildsListDisplayed.map((build) => build.buildDataId);

    const build = getRandomDataId(numberOfClassesByCategory, forbiddenBuildDataIds);
    addBuildInDisplay(build);
  }

  return { addRandomBuildInDisplay };
}
