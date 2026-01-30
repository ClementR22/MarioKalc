import ButtonIcon, { ButtonIconProps } from "@/primitiveComponents/ButtonIcon";
import IconContainer from "@/primitiveComponents/IconContainer";
import Text from "@/primitiveComponents/Text";
import useThemeStore from "@/stores/useThemeStore";
import { BORDER_RADIUS_INF } from "@/utils/designTokens";
import React from "react";
import { StyleSheet, View } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

interface ButtonIconWithBadgeProps extends ButtonIconProps {
  // if the badge content is a number, then give it as badgeText
  badgeText?: string | number;
  // but if the badge content up/down arrow icon, then use direction
  direction?: "asc" | "desc";
  isBadge?: boolean;
}

const BADGE_ICON_INNER_SIZE = 20;

const ButtonIconWithBadge: React.FC<ButtonIconWithBadgeProps> = ({
  onPress,
  tooltipText,
  namespace,
  iconProps,
  backgroundColor,
  badgeText,
  direction,
  isBadge = true,
}) => {
  const theme = useThemeStore((state) => state.theme);

  const badgeIconName = direction === "asc" ? "arrow-up" : "arrow-down";
  const badgeBackgroundColor = theme.primary_container;
  const badgeIconColor = theme.on_primary_container;

  const Wrapper = onPress || tooltipText ? ButtonIcon : IconContainer;

  return (
    <View>
      <Wrapper
        onPress={onPress}
        tooltipText={tooltipText}
        namespace={namespace}
        iconProps={iconProps}
        backgroundColor={backgroundColor ?? theme.primary}
      />
      {isBadge && (
        <View style={[styles.badgeContainer, { backgroundColor: badgeBackgroundColor }]}>
          {direction ? (
            <Icon
              name={badgeIconName}
              type={IconType.MaterialCommunityIcons}
              size={BADGE_ICON_INNER_SIZE}
              color={badgeIconColor}
            />
          ) : (
            <Text role="title" size="small" namespace="not">
              {badgeText}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    position: "absolute",
    top: 2,
    right: -5,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    borderRadius: BORDER_RADIUS_INF,
    width: 20,
    height: 20,
  },
});

export default React.memo(ButtonIconWithBadge);
