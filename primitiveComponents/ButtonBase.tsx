import React from "react";
import { ViewStyle } from "react-native";
import Tooltip from "@/components/Tooltip";

type ButtonBaseProps = {
  children: React.ReactNode;
  onPress: () => void;
  tooltipText: string;
  namespace?: string;
  placement?: "top" | "right" | "bottom" | "left" | "auto";
  containerStyleOuter?: ViewStyle | ViewStyle[];
  containerStyleInner?: ViewStyle | ViewStyle[];
  disabled?: boolean;
};

const ButtonBase = ({
  children,
  onPress,
  tooltipText,
  namespace,
  placement = "top",
  containerStyleOuter,
  containerStyleInner,
  disabled = false,
}: ButtonBaseProps) => {
  if (!tooltipText) {
    console.error("tooltipText missing in buttonBase", children, onPress);
  }
  return (
    <Tooltip
      onPress={onPress}
      childStyleOuter={containerStyleOuter}
      childStyleInner={containerStyleInner}
      tooltipText={tooltipText}
      namespace={namespace}
      placement={placement}
      onPressDisabled={disabled}
    >
      {children}
    </Tooltip>
  );
};

export default ButtonBase;
