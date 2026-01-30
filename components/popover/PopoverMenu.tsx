import useThemeStore from "@/stores/useThemeStore";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Menu, MenuOptions, MenuTrigger, renderers } from "react-native-popup-menu";
import PopoverMenuItem from "./PopoverMenuItem";
import { ActionIconProps } from "@/hooks/useActionIconPropsList";
import { BUTTON_SIZE } from "@/utils/designTokens";

interface PopoverMenuProps {
  trigger: (openPopover: () => void) => React.ReactNode;
  actionIconPropsList?: ActionIconProps[];
}

const PopoverMenu: React.FC<PopoverMenuProps> = ({ trigger, actionIconPropsList }) => {
  const theme = useThemeStore((state) => state.theme);

  const [isOpen, setIsOpen] = useState(false);

  const openPopover = () => setIsOpen(true);
  const closePopover = () => setIsOpen(false);

  return (
    <Menu opened={isOpen} onBackdropPress={closePopover} renderer={renderers.NotAnimatedContextMenu}>
      <MenuTrigger>{trigger(openPopover)}</MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: [styles.menuContainerList],
        }}
      >
        {actionIconPropsList.map((actionProps) => {
          const { title, iconKey, onPress } = actionProps;
          return (
            <PopoverMenuItem
              key={title}
              onPress={() => {
                onPress();
                closePopover();
              }}
              title={title}
              iconKey={iconKey}
            />
          );
        })}
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  menuContainerList: {
    borderRadius: 4,
    overflow: "hidden",
    width: 166,
    marginTop: BUTTON_SIZE,
  },
});

export default React.memo(PopoverMenu);
