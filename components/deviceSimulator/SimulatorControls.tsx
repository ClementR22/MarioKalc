import Button from "@/primitiveComponents/Button";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SimulatorControlsProps {
  onFullScreen: () => void;
  onReset: () => void;
  isDefaultSize: boolean;
  offsetLeft: number;
  themeInverse: any;
}

const SimulatorControls: React.FC<SimulatorControlsProps> = ({
  onFullScreen,
  onReset,
  isDefaultSize,
  offsetLeft,
  themeInverse,
}) => {
  return (
    <View style={[styles.toolbar, { left: offsetLeft }]}>
      <Button
        onPress={onFullScreen}
        tooltipText="switchToFullScreen"
        buttonColor={themeInverse.surface_container_high}
        buttonTextColor={themeInverse.on_surface}
      >
        fullScreen
      </Button>
      <Button
        onPress={onReset}
        tooltipText="resetDimensions"
        buttonColor={isDefaultSize ? themeInverse.surface_container : themeInverse.surface_container_high}
        buttonTextColor={
          isDefaultSize ? (themeInverse.isLight ? "silver" : themeInverse.on_disabled) : themeInverse.on_surface
        }
      >
        reset
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -45 }],
    gap: 10,
    zIndex: 100,
  },
});

export default React.memo(SimulatorControls);
