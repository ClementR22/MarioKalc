import { LayoutProvider } from "@/contexts/LayoutContext";
import { View, useWindowDimensions, Platform } from "react-native";

// Ratio d'un smartphone typique (ex: 9:16)
const PORTRAIT_RATIO = 9 / 16;
// Largeur de référence mobile
const TARGET_MOBILE_WIDTH = 390;

const PortraitContainer = ({ children }) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  if (isLandscape && Platform.OS === "web") {
    // Calculer la largeur maximale pour garder le ratio portrait
    const maxWidth = height * PORTRAIT_RATIO;

    const scale = maxWidth / TARGET_MOBILE_WIDTH;

    return (
      <LayoutProvider width={TARGET_MOBILE_WIDTH} height={height / scale} scale={scale}>
        <View
          style={{
            width: maxWidth,
            height: height,
            alignSelf: "center",
          }}
        >
          <View
            style={{
              width: TARGET_MOBILE_WIDTH,
              height: height / scale,
              transform: [{ scale }],
              transformOrigin: "top left",
            }}
          >
            {children}
          </View>
        </View>
      </LayoutProvider>
    );
  }

  // Mode normal pour mobile portrait
  return (
    <LayoutProvider width={width} height={height} scale={1}>
      {children}
    </LayoutProvider>
  );
};

export default PortraitContainer;
