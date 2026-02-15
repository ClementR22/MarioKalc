import Text from "@/primitiveComponents/Text";
import useThemeStore from "@/stores/useThemeStore";
import React from "react";
import { Platform } from "react-native";
import { StyleSheet, View } from "react-native";

interface ResizeHandlesProps {
  onStartResize: (type: string) => (e: any) => void;
  width: number;
  height: number;
}

const ResizeHandles: React.FC<ResizeHandlesProps> = ({ onStartResize, width, height }) => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <>
      <View style={styles.handleRight} onPointerDown={onStartResize("w")} />
      <View style={styles.handleBottom} onPointerDown={onStartResize("h")} />
      <View style={styles.handleCorner} onPointerDown={onStartResize("wh")} />
      <View style={styles.dimBadge}>
        <Text
          role="body"
          size="small"
          fontFamily={Platform.OS === "web" ? "monospace" : undefined}
          namespace="not"
          color={theme.outline}
        >
          {Math.round(width)} x {Math.round(height)}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  handleRight: {
    position: "absolute",
    right: -4,
    top: 0,
    bottom: 0,
    width: 8,
    cursor: "ew-resize" as any,
    zIndex: 10,
  },
  handleBottom: {
    position: "absolute",
    bottom: -4,
    left: 0,
    right: 0,
    height: 8,
    cursor: "ns-resize" as any,
    zIndex: 10,
  },
  handleCorner: {
    position: "absolute",
    bottom: -6,
    right: -6,
    width: 14,
    height: 14,
    cursor: "nwse-resize" as any,
    zIndex: 11,
    backgroundColor: "#444",
    borderRadius: 3,
    borderWidth: 2,
    borderColor: "#121212",
  },
  dimBadge: {
    position: "absolute",
    top: -25,
    right: 0,
  },
});

export default ResizeHandles;
