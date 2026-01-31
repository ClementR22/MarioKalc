import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import useThemeStore from "@/stores/useThemeStore";
import Icon from "react-native-dynamic-vector-icons";
import ButtonBase from "./ButtonBase";
import { BORDER_RADIUS_INF, BUTTON_SIZE } from "@/utils/designTokens";
import { box_shadow_z2 } from "@/components/styles/shadow";
import Text from "./Text";
import { APP_ICONS, IconKey } from "@/constants/Icons";

interface ButtonProps {
  children: ReactNode;
  onPress?: () => void;
  tooltipText: string;
  iconKey?: IconKey;
  buttonColor?: string;
  buttonTextColor?: string;
  isErrorStyle?: boolean;
  flex?: number;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  tooltipText,
  iconKey,
  buttonColor,
  buttonTextColor,
  isErrorStyle,
  flex,
  disabled = false,
}) => {
  const theme = useThemeStore((state) => state.theme);

  const { name, type } = APP_ICONS[iconKey as IconKey] ?? {};

  let backgroundColor: string, contentColor: string;
  if (disabled) {
    backgroundColor = "grey";
    contentColor = theme.surface_variant;
  } else if (isErrorStyle) {
    backgroundColor = theme.error;
    contentColor = theme.on_error;
  } else {
    backgroundColor = buttonColor || theme.primary;
    contentColor = buttonTextColor || theme.on_primary;
  }

  return (
    <ButtonBase
      onPress={onPress}
      tooltipText={tooltipText}
      containerStyleOuter={[
        styles.containerOuter,
        {
          backgroundColor: backgroundColor,
          flex: flex,
        },
      ]}
      containerStyleInner={styles.containerInner}
      disabled={disabled}
    >
      {iconKey && <Icon name={name} type={type} size={24} color={contentColor} />}
      <Text
        role="title"
        size="small"
        weight="semibold"
        textAlign="center"
        color={contentColor}
        inverse
        namespace="button"
      >
        {children}
      </Text>
    </ButtonBase>
  );
};

export const styles = StyleSheet.create({
  containerOuter: {
    height: BUTTON_SIZE,
    borderRadius: BORDER_RADIUS_INF,
    boxShadow: box_shadow_z2,
    minWidth: 100, // just for modal buttons
    overflow: "hidden",
  },
  containerInner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    height: BUTTON_SIZE,
    paddingHorizontal: 15,
  },
});

Button.displayName = "Button";

export default React.memo(Button);
