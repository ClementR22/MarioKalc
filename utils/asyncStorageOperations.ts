import { Game } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
// ne pas ajouter d'autres imports (types, stores, etc.) car souvent
// c'est asyncStorageOperations qui est importé dans d'autres fichier
// et on veut éviter Require cycle

export const saveThingInMemory = async (thingKey: string, newThing: any) => {
  try {
    await AsyncStorage.setItem(thingKey, JSON.stringify(newThing));
  } catch (e) {
    console.error("Erreur lors de la sauvegarde de ", thingKey, e);
  }
};

export const loadThingFromMemory = async (thingKey: string, setThing?: any) => {
  const savedThing = await AsyncStorage.getItem(thingKey);

  if ((savedThing != null && savedThing != "undefined") || thingKey === "language") {
    let savedThingParsed: any;
    if (savedThing === "true" || savedThing === "false") {
      // si savedSetting est un booleen
      savedThingParsed = savedThing === "true";
    } else {
      savedThingParsed = JSON.parse(savedThing);
    }
    if (setThing) {
      setThing(savedThingParsed);
    }
    return savedThingParsed;
  }
};

export const getOnlyBuildsSavedKeysFromMemory = async (game: Game) => {
  const keys = await AsyncStorage.getAllKeys();
  const onlyBuildsKeys = keys.filter((k) => k.startsWith(`${game}`));
  return onlyBuildsKeys;
};

export const deleteThingInMemory = async (thingKey) => {
  try {
    await AsyncStorage.removeItem(thingKey);
  } catch (e) {
    console.error("Erreur lors de la suppression de ", thingKey, e);
  }
};

export const deleteAllTheMemory = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    allKeys.forEach(async (thingKey) => await AsyncStorage.removeItem(thingKey));
  } catch (e) {
    console.error("Erreur lors de la suppression : ", e);
  }
};

export const deleteAllSavedBuildsInMemory = async (game: Game) => {
  try {
    const buildsKeys = await getOnlyBuildsSavedKeysFromMemory(game);
    buildsKeys.forEach(async (thingKey) => await AsyncStorage.removeItem(thingKey));
  } catch (e) {
    console.error("Erreur lors de la suppression : ", e);
  }
};
