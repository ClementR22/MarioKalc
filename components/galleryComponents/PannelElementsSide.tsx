import useThemeStore from "@/stores/useThemeStore";
import { BORDER_RADIUS_18, LEFT_PANNEL_WIDTH_COLLAPSED, LEFT_PANNEL_WIDTH_EXPANDED } from "@/utils/designTokens";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useSharedValue, withTiming, useAnimatedStyle, SharedValue } from "react-native-reanimated";
import { box_shadow_z1 } from "../styles/shadow";
import ButtonIcon from "@/primitiveComponents/ButtonIcon";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface PannelElementsSideProps {
  isLeftPannelExpanded: boolean;
  setIsLeftPannelExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  overlayOpacity: SharedValue<number>;
  children: React.ReactElement;
}

const OVERLAY_MAX = 0.5;

const PannelElementsSide: React.FC<PannelElementsSideProps> = ({
  isLeftPannelExpanded,
  setIsLeftPannelExpanded,
  overlayOpacity,
  children,
}) => {
  const theme = useThemeStore((state) => state.theme);

  const width = useSharedValue(isLeftPannelExpanded ? LEFT_PANNEL_WIDTH_EXPANDED : LEFT_PANNEL_WIDTH_COLLAPSED);

  // Sync externe
  useEffect(() => {
    const targetWidth = isLeftPannelExpanded ? LEFT_PANNEL_WIDTH_EXPANDED : LEFT_PANNEL_WIDTH_COLLAPSED;

    width.value = withTiming(targetWidth, { duration: 300 });
    overlayOpacity.value = withTiming(isLeftPannelExpanded ? OVERLAY_MAX : 0, {
      duration: 300,
    });
  }, [isLeftPannelExpanded, width, overlayOpacity]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  const toggleLeftPannelExpanded = () => setIsLeftPannelExpanded((prev) => !prev);

  return (
    <GestureHandlerRootView
      style={[
        styles.container,
        {
          width: isLeftPannelExpanded ? LEFT_PANNEL_WIDTH_EXPANDED : LEFT_PANNEL_WIDTH_COLLAPSED,
        },
      ]}
    >
      <Animated.View style={[styles.pannel, animatedContainerStyle, { backgroundColor: theme.surface_container }]}>
        {children}
      </Animated.View>

      <View style={styles.buttonWrapper}>
        <ButtonIcon
          iconProps={{ iconKey: isLeftPannelExpanded ? "chevron-left" : "chevron-right" }}
          onPress={toggleLeftPannelExpanded}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pannel: {
    flex: 1,
    borderTopEndRadius: BORDER_RADIUS_18,
    borderEndEndRadius: BORDER_RADIUS_18,
    boxShadow: box_shadow_z1,
    overflow: "hidden",
  },
  childrenWrapper: {
    flex: 1,
  },
  buttonWrapper: {
    marginTop: 10,
    width: LEFT_PANNEL_WIDTH_COLLAPSED,
    alignItems: "center",
  },
});

export default PannelElementsSide;
