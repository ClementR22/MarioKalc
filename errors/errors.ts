import { ScreenName } from "@/contexts/ScreenContext";
import { Game } from "@/types";

export class BuildAlreadyExistsError extends Error {
  target: ScreenName;
  buildName: string;

  constructor(target: ScreenName, buildName?: string) {
    super("buildAlreadyExists");
    this.target = target;
    if (buildName) {
      this.buildName = buildName;
    }
  }
}

export class NameAlreadyExistsError extends Error {
  buildName: string;

  constructor(buildName: string) {
    super("nameAlreadyExists");
    this.buildName = buildName;
  }
}

export class NameInvalidError extends Error {
  buildName: string;

  constructor(buildName: string) {
    super("nameInvalid");
    this.buildName = buildName;
  }
}

export class WrongGameBuildImportedError extends Error {
  gameTarget: Game;

  constructor(gameTarget: Game) {
    super("wrongGameBuildImported");
    this.gameTarget = gameTarget;
  }
}
