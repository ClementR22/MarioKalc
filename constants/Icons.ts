import { Platform } from "react-native";
import { IconType } from "react-native-dynamic-vector-icons";

export type IconKey =
  | "magnify"
  | "compare"
  | "cards"
  | "cards-outline"
  | "image"
  | "image-outline"
  | "settings"
  | "settings-outline"
  | "license"
  | "credits"
  | "numbers"
  | "minus"
  | "plus"
  | "checkbox-multiple-marked"
  | "pencil"
  | "check"
  | "car-sports"
  | "sort"
  | "sort-alphabetical-ascending"
  | "content-save-outline"
  | "content-save-check"
  | "share"
  | "help-circle-outline"
  | "content-paste"
  | "trash-can"
  | "filter"
  | "sort-numeric-ascending"
  | "speed"
  | "handling"
  | "acceleration"
  | "weight"
  | "traction"
  | "miniTurbo"
  | "chevron-down"
  | "chevron-up"
  | "approximately-equal"
  | "greater-than-or-equal"
  | "equal"
  | "close"
  | "more"
  | "donation"
  | "database"
  | "reset"
  | "feedback"
  | "github"
  | "update";

export type AppIcon = {
  name: string;
  type: IconType;
};

export const APP_ICONS: Record<IconKey, AppIcon> = {
  magnify: {
    name: "magnify",
    type: IconType.MaterialCommunityIcons,
  },
  compare: {
    name: "compare",
    type: IconType.MaterialCommunityIcons,
  },
  cards: {
    name: "cards",
    type: IconType.MaterialCommunityIcons,
  },
  "cards-outline": {
    name: "cards-outline",
    type: IconType.MaterialCommunityIcons,
  },
  image: {
    name: "image",
    type: IconType.Ionicons,
  },
  "image-outline": {
    name: "image-outline",
    type: IconType.Ionicons,
  },
  settings: {
    name: "settings",
    type: IconType.Ionicons,
  },
  "settings-outline": {
    name: "settings-outline",
    type: IconType.Ionicons,
  },
  license: { name: "license", type: IconType.MaterialCommunityIcons },
  credits: { name: "star-circle-outline", type: IconType.MaterialCommunityIcons },
  numbers: { name: "numbers", type: IconType.MaterialIcons },
  minus: { name: "minus", type: IconType.MaterialCommunityIcons },
  plus: { name: "plus", type: IconType.MaterialCommunityIcons },
  "checkbox-multiple-marked": { name: "checkbox-multiple-marked", type: IconType.MaterialCommunityIcons },
  pencil: { name: "pencil", type: IconType.MaterialCommunityIcons },
  check: { name: "check", type: IconType.FontAwesome5 },
  "car-sports": { name: "car-sports", type: IconType.MaterialCommunityIcons },
  sort: { name: "sort", type: IconType.MaterialCommunityIcons },
  "sort-alphabetical-ascending": { name: "sort-alphabetical-ascending", type: IconType.MaterialCommunityIcons },
  "content-save-outline": { name: "content-save-outline", type: IconType.MaterialCommunityIcons },
  "content-save-check": { name: "content-save-check", type: IconType.MaterialCommunityIcons },
  share: {
    name: Platform.OS === "ios" ? "share-outline" : "share",
    type: Platform.OS === "ios" ? IconType.Ionicons : IconType.MaterialIcons,
  },
  "help-circle-outline": { name: "help-circle-outline", type: IconType.MaterialCommunityIcons },
  "content-paste": { name: "content-paste", type: IconType.MaterialCommunityIcons },
  "trash-can": { name: "trash-can", type: IconType.MaterialCommunityIcons },
  filter: { name: "filter", type: IconType.MaterialCommunityIcons },
  "sort-numeric-ascending": { name: "sort-numeric-ascending", type: IconType.MaterialCommunityIcons },
  speed: { name: "speedometer", type: IconType.SimpleLineIcons },
  handling: { name: "steering", type: IconType.MaterialCommunityIcons },
  acceleration: { name: "keyboard-double-arrow-up", type: IconType.MaterialIcons },
  weight: { name: "weight-gram", type: IconType.MaterialCommunityIcons },
  traction: { name: "car-traction-control", type: IconType.MaterialCommunityIcons },
  miniTurbo: {
    name: "rocket-launch-outline",
    type: IconType.MaterialCommunityIcons,
  },
  "chevron-down": { name: "chevron-down", type: IconType.MaterialCommunityIcons },
  "chevron-up": { name: "chevron-up", type: IconType.MaterialCommunityIcons },
  "approximately-equal": { name: "approximately-equal", type: IconType.MaterialCommunityIcons },
  "greater-than-or-equal": { name: "greater-than-or-equal", type: IconType.MaterialCommunityIcons },
  equal: { name: "equal", type: IconType.MaterialCommunityIcons },
  close: { name: "close", type: IconType.AntDesign },
  more: { name: "more-vert", type: IconType.MaterialIcons },
  donation: { name: "hand-heart", type: IconType.MaterialCommunityIcons },
  database: { name: "database", type: IconType.MaterialCommunityIcons },
  reset: { name: "rotate-ccw", type: IconType.Feather },
  feedback: { name: "chatbox-ellipses-outline", type: IconType.Ionicons },
  github: { name: "github", type: IconType.AntDesign },
  update: { name: "system-update-alt", type: IconType.MaterialIcons },
};
