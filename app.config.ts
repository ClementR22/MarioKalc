import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  owner: "lentrepriz",
  name: "Mario Kalc",
  slug: "MK8DSB",
  version: "{{VERSION}}",

  runtimeVersion: {
    policy: "sdkVersion",
  },

  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",

  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.clementrayer.MarioKart",
    buildNumber: process.env.IOS_BUILD_NUMBER ?? "1",
  },

  android: {
    package: "com.clement_rayer.MarioKalc",
    edgeToEdgeEnabled: true,
    versionCode: Number(process.env.ANDROID_VERSION_CODE ?? 1),
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },

  androidNavigationBar: {
    backgroundColor: "#FF0000",
  },

  androidStatusBar: {
    translucent: true,
    backgroundColor: "#00000000",
  },

  plugins: ["expo-router", "expo-localization", "expo-web-browser", "./custom.plugin"],

  experiments: {
    typedRoutes: true,
  },

  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },

  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "00f67cbf-872e-41b5-8b6c-4b4ae1f6c6bb",
    },
  },
});
