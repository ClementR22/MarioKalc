// InfoToast.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/primitiveComponents/Text";
import useThemeStore from "@/stores/useThemeStore";

interface InfoToastProps {
  text1: string;
  isError?: boolean;
}

const InfoToast = ({ text1, isError = false }: InfoToastProps) => {
  const theme = useThemeStore((state) => state.theme);

  const insets = useSafeAreaInsets();
  const bottomOffset = insets.bottom;

  // pas de traduction ici, déjà fait dans showToast.ts
  return (
    <View
      style={[
        styles.toast,
        { backgroundColor: isError ? theme.error : theme.toast_background_color, marginBottom: bottomOffset },
      ]}
    >
      <Text role="body" size="medium" color={isError ? theme.on_error : "white"} namespace="not">
        {text1}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    width: "90%",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 4,
  },
});

export default React.memo(InfoToast);
