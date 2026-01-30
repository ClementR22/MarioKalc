import { SortButtonProps, SortName } from "@/types/mkw/sorts";

// Merged configuration for all icons
export const sortButtonsConfig: { [key in SortName]: SortButtonProps } = {
  // Sorting specific icons
  id: { iconKey: "sort-numeric-ascending" },
  name: { iconKey: "sort-alphabetical-ascending" },

  // General category icons (for sub-menus)
  speed: { iconKey: "speed" },
  handling: { iconKey: "handling" },

  // Speed-related icons with specific background colors
  speedSmooth: {
    iconKey: "speed",
    backgroundColor: "smooth",
  },
  speedRough: {
    iconKey: "speed",
    backgroundColor: "rough",
  },
  speedWater: {
    iconKey: "speed",
    backgroundColor: "water",
  },

  // Handling-related icons with specific background colors
  handlingSmooth: {
    iconKey: "handling",
    backgroundColor: "smooth",
  },
  handlingRough: {
    iconKey: "handling",
    backgroundColor: "rough",
  },
  handlingWater: {
    iconKey: "handling",
    backgroundColor: "water",
  },

  // Other direct stat sorts
  acceleration: {
    iconKey: "acceleration",
  },
  weight: {
    iconKey: "weight",
  },
  miniTurbo: {
    iconKey: "miniTurbo",
  },
};
