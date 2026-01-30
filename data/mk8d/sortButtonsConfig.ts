import { SortButtonProps, SortName } from "@/types/mk8d/sorts";

// Merged configuration for all icons
export const sortButtonsConfig: { [key in SortName]: SortButtonProps } = {
  // Sorting specific icons
  id: { iconKey: "sort-numeric-ascending" },
  name: { iconKey: "sort-alphabetical-ascending" },

  // General category icons (for sub-menus)
  speed: { iconKey: "speed" },
  handling: { iconKey: "handling" },

  // Speed-related icons with specific background colors
  speedGround: {
    iconKey: "speed",
    backgroundColor: "ground",
  },
  speedAntiGravity: {
    iconKey: "speed",
    backgroundColor: "antiGravity",
  },
  speedWater: {
    iconKey: "speed",
    backgroundColor: "water",
  },
  speedAir: {
    iconKey: "speed",
    backgroundColor: "air",
  },

  // Handling-related icons with specific background colors
  handlingGround: {
    iconKey: "handling",
    backgroundColor: "ground",
  },
  handlingAntiGravity: { iconKey: "handling", backgroundColor: "antiGravity" },
  handlingWater: { iconKey: "handling", backgroundColor: "water" },
  handlingAir: { iconKey: "handling", backgroundColor: "air" },

  // Other direct stat sorts
  acceleration: {
    iconKey: "acceleration",
  },
  weight: {
    iconKey: "weight",
  },
  traction: {
    iconKey: "traction",
  },
  miniTurbo: { iconKey: "miniTurbo" },
};
