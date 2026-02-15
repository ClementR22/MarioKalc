import React, { useCallback, useEffect, useRef, useMemo } from "react";
import { View, useWindowDimensions, Platform, StyleSheet, Animated, Easing } from "react-native";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { useSimulatorLogic } from "@/hooks/useSimulatorLogic";
import ExitFullScreenButton from "./deviceSimulator/ExitFullScreenButton";
import SimulatorControls from "./deviceSimulator/SimulatorControls";
import ResizeHandles from "./deviceSimulator/ResizeHandles";
import useThemeStore from "@/stores/useThemeStore";
import { dark_theme, light_theme } from "./styles/theme";

interface DeviceSimulatorProps {
  children: React.ReactNode;
}

const DEFAULT_RATIO = 9 / 16;

const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({ children }) => {
  const theme = useThemeStore((state) => state.theme);
  const themeInverse = theme.isLight ? dark_theme : light_theme;

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const { dims, setDims, isForceFullScreen, setIsForceFullScreen, startResize, stopResize, onPointerMove } =
    useSimulatorLogic(windowWidth, windowHeight);

  // Logique d'affichage et conditions
  const isLandscapeWeb = useMemo(
    () => windowWidth > windowHeight && Platform.OS === "web",
    [windowWidth, windowHeight],
  );

  const showSimulator = isLandscapeWeb && !isForceFullScreen;

  // Logique d'animation du bouton Exit
  const exitAnim = useRef(new Animated.Value(-80)).current;
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideExitButton = useCallback(() => {
    Animated.timing(exitAnim, {
      toValue: -80,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [exitAnim]);

  const showExitButton = useCallback(() => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);

    Animated.timing(exitAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    hideTimeout.current = setTimeout(hideExitButton, 2000);
  }, [exitAnim, hideExitButton]);

  const isDefaultSize = useMemo(() => {
    const defaultWidth = windowHeight * DEFAULT_RATIO;
    return Math.abs(dims.width - defaultWidth) < 1 && Math.abs(dims.height - windowHeight) < 1;
  }, [dims, windowHeight]);

  const offsetLeft = useMemo(() => (windowWidth - dims.width) / 2 + dims.width + 20, [windowWidth, dims.width]);

  // Gestion des Events (Web)
  useEffect(() => {
    if (Platform.OS !== "web") return;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopResize);
    window.addEventListener("pointercancel", stopResize);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopResize);
      window.removeEventListener("pointercancel", stopResize);
    };
  }, [onPointerMove, stopResize]);

  useEffect(() => {
    if (!isForceFullScreen || !isLandscapeWeb) return;

    const handleMouseMoveTop = (e) => {
      if (e.clientY < 80) showExitButton();
    };

    window.addEventListener("mousemove", handleMouseMoveTop);
    showExitButton(); // Apparition initiale lors du passage en plein écran

    return () => window.removeEventListener("mousemove", handleMouseMoveTop);
  }, [isForceFullScreen, isLandscapeWeb, showExitButton]);

  // Mode Plein Écran (Mobile ou Web forcé)
  if (!showSimulator) {
    return (
      <LayoutProvider width={windowWidth} height={windowHeight}>
        {children}
        {isForceFullScreen && isLandscapeWeb && (
          <ExitFullScreenButton
            animValue={exitAnim}
            onExit={() => setIsForceFullScreen(false)}
            themeInverse={themeInverse}
          />
        )}
      </LayoutProvider>
    );
  }

  // Mode Simulateur (Web Landscape)
  return (
    <View style={[styles.outerContainer, { backgroundColor: themeInverse.surface_container_low }]}>
      <View style={[styles.resizableWrapper, { width: dims.width, height: dims.height }]}>
        <LayoutProvider width={dims.width} height={dims.height}>
          {children}
        </LayoutProvider>

        <ResizeHandles onStartResize={startResize} width={dims.width} height={dims.height} />
      </View>

      <SimulatorControls
        onFullScreen={() => setIsForceFullScreen(true)}
        onReset={() => setDims({ width: windowHeight * DEFAULT_RATIO, height: windowHeight })}
        isDefaultSize={isDefaultSize}
        offsetLeft={offsetLeft}
        themeInverse={themeInverse}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  resizableWrapper: {
    backgroundColor: "#fff",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
    position: "relative",
  },
});

export default DeviceSimulator;
