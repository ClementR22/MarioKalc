import React from "react";
import { StyleSheet, View } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import useThemeStore from "@/stores/useThemeStore";
import {
  BORDER_RADIUS_INF,
  BORDER_RADIUS_MEDIUM,
  BUTTON_SIZE,
  HEIGHT_BUTTON_RECTANGLE,
  WIDTH_BUTTON_RECTANGLE,
} from "@/utils/designTokens";

type Shape = "circle" | "rectangle" | "square";

const getContainerStyle = (shape: Shape, containerSize?: number) => {
  if (shape === "circle") {
    return {
      height: containerSize,
      width: containerSize,
      borderRadius: BORDER_RADIUS_INF,
    };
  }
  if (shape === "rectangle") {
    return { height: HEIGHT_BUTTON_RECTANGLE, width: WIDTH_BUTTON_RECTANGLE, borderRadius: BORDER_RADIUS_MEDIUM };
  }
  if (shape === "square") {
    return { height: containerSize, width: containerSize, borderRadius: 6 };
  }
};

interface IconContainerProps {
  iconName: string;
  iconType: IconType;
  shape?: Shape;
  containerSize?: number;
  backgroundColor?: string;
  iconColor?: string;
}

const IconContainer = ({
  iconName,
  iconType,
  shape = "circle",
  containerSize = BUTTON_SIZE,
  backgroundColor,
  iconColor,
  ...iconProps
}: IconContainerProps) => {
  const { theme } = useThemeStore();

  const iconSize = (24 / BUTTON_SIZE) * containerSize;
  const containerStyle = getContainerStyle(shape, containerSize);

  return (
    <View
      style={[
        styles.container,
        {
          height: containerSize,
          width: containerSize,
          backgroundColor: backgroundColor || theme.primary,
        },
        containerStyle,
      ]}
    >
      <Icon name={iconName} type={iconType} size={iconSize} color={iconColor || theme.on_primary} {...iconProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default React.memo(IconContainer);
