import React from "react";
import ButtonBase from "./ButtonBase";
import IconContainer, { IconContainerProps } from "./IconContainer";
import { BUTTON_SIZE } from "@/utils/designTokens";
import useThemeStore from "@/stores/useThemeStore";

export interface ButtonIconProps extends IconContainerProps {
  onPress?: (event?: Event) => void;
  tooltipText: string;
  namespace?: string;
  toolTipPlacement?: "top" | "right" | "bottom" | "left" | "auto";
  disabled?: boolean;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({
  onPress,
  tooltipText,
  namespace,
  toolTipPlacement = "top",
  disabled = false,
  iconProps,
  shape = "circle",
  containerSize = BUTTON_SIZE,
  backgroundColor,
}) => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <ButtonBase
      onPress={onPress}
      tooltipText={tooltipText}
      namespace={namespace}
      placement={toolTipPlacement}
      disabled={disabled}
    >
      <IconContainer
        iconProps={disabled ? { iconKey: iconProps.iconKey, iconColor: theme.on_disabled } : iconProps}
        shape={shape}
        containerSize={containerSize}
        backgroundColor={disabled ? theme.disabled : backgroundColor}
      />
    </ButtonBase>
  );
};

ButtonIcon.displayName = "ButtonIcon";

export default React.memo(ButtonIcon);
