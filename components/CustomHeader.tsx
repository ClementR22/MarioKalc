import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "@/primitiveComponents/Text";
import useThemeStore from "@/stores/useThemeStore";
import Icon from "react-native-dynamic-vector-icons";
import { box_shadow_z1 } from "./styles/shadow";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { APP_ICONS, IconKey } from "@/constants/Icons";

interface CustomHeaderProps {
  iconKey: IconKey;
  title: string;
  helpComponent?: React.ReactElement;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ iconKey, title, helpComponent }) => {
  const theme = useThemeStore((state) => state.theme);

  const { name, type } = APP_ICONS[iconKey];
  const statusBarHeight = useSafeAreaInsets().top;

  return (
    <View style={[styles.container, { backgroundColor: theme.surface_container, paddingTop: statusBarHeight }]}>
      <Icon name={name} type={type} size={24} color={theme.on_surface} style={styles.icon} />
      <View style={{ flex: 1, alignItems: "flex-start" }}>
        <Text role="headline" size="large" namespace="screens">
          {title}
        </Text>
      </View>

      {helpComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingEnd: 15,
    boxShadow: box_shadow_z1,
  },
  icon: {
    width: 48,
    height: 48,
    padding: 12,
    marginRight: 4,
    marginLeft: 16,
  },
});

export default React.memo(CustomHeader);
