import { BuildPersistant } from "@/types";

export const checkFormatBuildImported = (obj: unknown): obj is BuildPersistant => {
  if (typeof obj !== "object" || Array.isArray(obj) || obj === null) {
    return false;
  }

  const importedBuild = obj as Partial<BuildPersistant>;
  const keys = Object.keys(importedBuild);

  const dataIdRegex = /^(?:\d+(?:-\d+){1}|\d+(?:-\d+){3})$/;

  // buildDataId obligatoire et doit matcher le regex
  if (typeof importedBuild.buildDataId !== "string" || !dataIdRegex.test(importedBuild.buildDataId)) {
    return false;
  }

  // name optionnel mais si présent doit être une string
  if ("name" in importedBuild && typeof importedBuild.name !== "string") {
    return false;
  }

  // Pas d'autres propriétés que buildDataId et name
  return keys.every((key) => key === "buildDataId" || key === "name");
};
