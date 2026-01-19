import Text from "@/primitiveComponents/Text";
import useThemeStore from "@/stores/useThemeStore";
import { buttonPressed } from "@/utils/designTokens";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

interface PopoverMenuItemProps {
  onPress: () => any;
  title: string;
  iconProps?: { name: string; type: IconType };
}

const PopoverMenuItem: React.FC<PopoverMenuItemProps> = ({ onPress, title, iconProps }) => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.surface_container },
        pressed && buttonPressed,
      ]}
    >
      {iconProps && <Icon name={iconProps.name} type={iconProps.type} size={24} />}
      <Text role="title" size="small" namespace="button" style={styles.text}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  text: { flexShrink: 1 },
});

export default React.memo(PopoverMenuItem);
