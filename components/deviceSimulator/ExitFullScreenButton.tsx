import React from "react";
import { AnimatableNumericValue, Animated, Platform, StyleSheet } from "react-native";
import Button from "@/primitiveComponents/Button";

interface ExitFullScreenButtonProps {
  animValue: AnimatableNumericValue;
  onExit: () => void;
  themeInverse: any;
}

const ExitFullScreenButton: React.FC<ExitFullScreenButtonProps> = ({ animValue, onExit, themeInverse }) => {
  return (
    <Animated.View
      style={[
        styles.exitFullScreenBtn,
        {
          transform: [{ translateY: animValue }],
          // Optimisation spécifique Web pour forcer l'accélération GPU
          ...(Platform.OS === "web" ? { willChange: "transform" } : {}),
        },
      ]}
    >
      <Button
        onPress={onExit}
        tooltipText="mobileFormat"
        buttonColor={themeInverse.surface_container_highest}
        buttonTextColor={themeInverse.on_surface}
      >
        mobileFormat
      </Button>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  exitFullScreenBtn: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 999,
  },
});

export default React.memo(ExitFullScreenButton);
