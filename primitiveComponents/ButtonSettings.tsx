import { IconProps } from "@/types";
import React, { memo } from "react";
import { StyleSheet } from "react-native";
import Text from "./Text";
import IconContainer from "./IconContainer";
import useThemeStore from "@/stores/useThemeStore";
import Tooltip from "@/components/Tooltip";

interface ButtonSettingsProps {
  title: React.ReactNode;
  onPress?: () => void;
  iconProps: IconProps;
  backgroundColor?: string;
  tooltipText: string;
  disabled?: boolean;
}

const ButtonSettings: React.FC<ButtonSettingsProps> = ({
  title,
  onPress,
  iconProps,
  backgroundColor,
  tooltipText,
  disabled = false,
}) => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <Tooltip
      onPress={onPress}
      childStyleInner={[styles.containerInner, { backgroundColor: theme.surface }]}
      tooltipText={tooltipText}
      onPressDisabled={disabled}
      top={-10}
    >
      <IconContainer
        iconProps={{
          iconKey: iconProps.iconKey,
          iconColor: disabled ? theme.surface_container : iconProps.iconColor || theme.on_primary,
        }}
        backgroundColor={disabled ? "grey" : backgroundColor || theme.primary}
        shape="square"
        containerSize={30}
      />
      <Text role="title" size="small" textAlign="left" namespace="button" flexShrink={1}>
        {title}
      </Text>
    </Tooltip>
  );
};

const styles = StyleSheet.create({
  containerInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 5,
  },
});

export default memo(ButtonSettings);
