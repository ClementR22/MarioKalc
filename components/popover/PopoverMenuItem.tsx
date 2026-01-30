import { APP_ICONS, IconKey } from "@/constants/Icons";
import Text from "@/primitiveComponents/Text";
import useThemeStore from "@/stores/useThemeStore";
import { buttonPressed } from "@/utils/designTokens";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Icon from "react-native-dynamic-vector-icons";

interface PopoverMenuItemProps {
  onPress: () => any;
  title: string;
  iconKey?: IconKey;
}

const PopoverMenuItem: React.FC<PopoverMenuItemProps> = ({ onPress, title, iconKey }) => {
  const theme = useThemeStore((state) => state.theme);

  const { name, type } = APP_ICONS[iconKey];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: theme.surface_container },
        pressed && buttonPressed,
      ]}
    >
      {iconKey && <Icon name={name} type={type} size={24} />}
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
