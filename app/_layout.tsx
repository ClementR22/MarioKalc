// _layout.tsx
import React, { useCallback, useEffect, useState } from "react";
import { Tabs, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Appearance, BackHandler, Platform, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MenuProvider } from "react-native-popup-menu";
import Toast from "react-native-toast-message";

import CustomHeader from "@/components/CustomHeader";
import EditBuildModal from "@/components/modal/EditBuildModal";
import LoadBuildModal from "@/components/modal/LoadBuildModal";
import HelpSearchBuildScreen from "@/components/helpScreens/HelpSearchBuildScreen";
import HelpDisplayBuildScreen from "@/components/helpScreens/HelpDisplayBuildScreen";
import HelpSavedBuildScreen from "@/components/helpScreens/HelpSavedBuildScreen";

import useThemeStore from "@/stores/useThemeStore";
import useBuildsActionsStore from "@/stores/useBuildsActionsStore";
import useBuildsListStore from "@/stores/useBuildsListStore";
import useGeneralStore from "@/stores/useGeneralStore";

import { toastConfig } from "@/config/toastConfig";
import { useTranslation } from "react-i18next";

import ButtonIconWithBadge from "@/components/sortModeSelector/ButtonIconWithBadge";
import { useInitStatsStore } from "@/hooks/useInitStatsStore";
import { useInitPressableElementsStore } from "@/hooks/useInitPressableElementsStore";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import UpdateAvailableModal from "@/components/modal/UpdateAvailableModal";
import WelcomeModal from "@/components/modal/WelcomeModal";
import { runMigrations } from "@/utils/migrations";
import { loadThingFromMemory, saveThingInMemory } from "@/utils/asyncStorageOperations";
import { useSettingsMap } from "@/hooks/useSettingsMap";
import ModalConfirm from "@/components/modal/ModalConfirm";
import PortraitContainer from "@/components/PortraitContainer";

export default function TabLayout() {
  const { t } = useTranslation("screens");
  const theme = useThemeStore((state) => state.theme);
  const isSettingsLoaded = useGeneralStore((state) => state.isSettingsLoaded);
  const setIsSettingsLoaded = useGeneralStore((state) => state.setIsSettingsLoaded);
  const buildsListSaved = useBuildsListStore((state) => state.buildsListSaved);
  const numberSavedBuilds = useGeneralStore((state) => state.numberSavedBuilds);
  const setNumberSavedBuilds = useGeneralStore((state) => state.setNumberSavedBuilds);
  const updateSystemTheme = useThemeStore((state) => state.updateSystemTheme);
  const loadBuildsSaved = useBuildsActionsStore((state) => state.loadBuildsSaved);

  const settingsMap = useSettingsMap();

  const [isReady, setIsReady] = useState(false);
  const [isModalQuitVisible, setIsModalQuitVisible] = useState(false);

  // 1. INITIALISATION AU DÉMARRAGE (une seule fois)
  useEffect(() => {
    const initApp = async () => {
      try {
        // Exécuter les migrations et récupérer le changelog
        const changelogMessage = await runMigrations();

        // Charger les settings
        for (const [key, { setState }] of Object.entries(settingsMap)) {
          await loadThingFromMemory(key, setState);
        }

        // Charger les builds pour le game persisté
        await loadBuildsSaved();

        setIsSettingsLoaded(true);

        // Vérifier si le tutorial a déjà été vu
        const welcomeSeen = await loadThingFromMemory("welcomeSeen");
        // Si une migration a un message, l'afficher
        if (changelogMessage) {
          useGeneralStore.getState().showWelcome(changelogMessage);
        } else if (!welcomeSeen || Platform.OS === "web") {
          // Afficher le tutorial uniquement si jamais vu
          useGeneralStore.getState().showWelcome(""); // vide = tutorial
          await saveThingInMemory("welcomeSeen", true);
        }

        setIsReady(true);
      } catch (error) {
        console.error("App initialization failed:", error);
        setIsReady(true);
      }
    };

    initApp();
  }, []); // Vide, s'exécute une seule fois

  // 2. ÉCOUTER LES CHANGEMENTS DE THÈME SYSTÈME
  useEffect(() => {
    const listener = Appearance.addChangeListener(updateSystemTheme);
    return () => listener.remove();
  }, [updateSystemTheme]);

  // 3. RECHARGER LES BUILDS QUAND LE JEU CHANGE
  useEffect(() => {
    if (!isSettingsLoaded) return;
    loadBuildsSaved();
  }, [isSettingsLoaded, loadBuildsSaved]);

  // 4. METTRE À JOUR LE COMPTEUR DE BUILDS
  useEffect(() => {
    setNumberSavedBuilds(buildsListSaved.length);
  }, [buildsListSaved, setNumberSavedBuilds]);

  // 5. INITIALISER LES STORES
  useInitStatsStore();
  useInitPressableElementsStore();

  // 6. INTERCEPTER LE BACK POUR EVITER DE QUITTER INVOLONTAIREMENT
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isModalQuitVisible) {
          setIsModalQuitVisible(false);
          return true;
        }

        setIsModalQuitVisible(true);
        return true;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => subscription.remove();
    }, []),
  );

  // 7. CALLBACKS MÉMOÏSÉS POUR LES HEADERS
  const renderSearchHeader = useCallback(
    () => <CustomHeader iconKey="magnify" title="buildFinderTitle" helpComponent={<HelpSearchBuildScreen />} />,
    [],
  );

  const renderDisplayHeader = useCallback(
    () => <CustomHeader iconKey="compare" title="comparatorTitle" helpComponent={<HelpDisplayBuildScreen />} />,
    [],
  );

  const renderSavedHeader = useCallback(
    () => <CustomHeader iconKey="cards" title="collectionTitle" helpComponent={<HelpSavedBuildScreen />} />,
    [],
  );

  const renderGalleryHeader = useCallback(() => <CustomHeader iconKey="image" title="galleryTitle" />, []);

  const renderSettingsHeader = useCallback(() => <CustomHeader iconKey="settings" title="settingsTitle" />, []);

  // Return anticipé APRÈS tous les hooks
  if (!isReady) {
    return null; // ou <SplashScreen />
  }

  return (
    <PortraitContainer>
      <SafeAreaProvider>
        <MenuProvider>
          <GestureHandlerRootView style={styles.container}>
            <BottomSheetModalProvider>
              <StatusBar style={theme.theme_surface} />
              <Tabs
                screenOptions={{
                  sceneStyle: { backgroundColor: theme.surface },
                  tabBarStyle: {
                    backgroundColor: theme.surface_container,
                    borderTopWidth: 0,
                    elevation: 1,
                  },
                  tabBarItemStyle: {
                    height: 100, // ça ne change pas la height du parent tabBar,
                    //  mais ça permet de ne pas couper le bas du contenu
                  },
                  tabBarActiveTintColor: theme.primary,
                  tabBarInactiveTintColor: theme.on_surface_variant,
                  tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: "500",
                  },
                }}
              >
                <Tabs.Screen
                  name="index"
                  options={{
                    title: t("buildFinderTabTitle"),
                    tabBarIcon: ({ color }) => (
                      <ButtonIconWithBadge
                        tooltipText=""
                        iconProps={{ iconKey: "magnify", iconColor: color }}
                        backgroundColor="transparent"
                        isBadge={false}
                      />
                    ),
                    header: renderSearchHeader,
                  }}
                />
                <Tabs.Screen
                  name="DisplayBuildScreen"
                  options={{
                    title: t("comparatorTabTitle"),
                    tabBarIcon: ({ color }) => (
                      <ButtonIconWithBadge
                        tooltipText=""
                        iconProps={{ iconKey: "compare", iconColor: color }}
                        backgroundColor="transparent"
                        isBadge={false}
                      />
                    ),
                    header: renderDisplayHeader,
                  }}
                />
                <Tabs.Screen
                  name="SavedBuildScreen"
                  options={{
                    title: t("collectionTabTitle"),
                    tabBarIcon: ({ color, focused }) => (
                      <ButtonIconWithBadge
                        tooltipText=""
                        iconProps={{ iconKey: focused ? "cards" : "cards-outline", iconColor: color }}
                        badgeText={numberSavedBuilds}
                        backgroundColor="transparent"
                      />
                    ),
                    header: renderSavedHeader,
                  }}
                />
                <Tabs.Screen
                  name="GalleryScreen"
                  options={{
                    title: t("galleryTabTitle"),
                    tabBarIcon: ({ color, focused }) => (
                      <ButtonIconWithBadge
                        tooltipText=""
                        iconProps={{ iconKey: focused ? "image" : "image-outline", iconColor: color }}
                        backgroundColor="transparent"
                        isBadge={false}
                      />
                    ),
                    header: renderGalleryHeader,
                  }}
                />
                <Tabs.Screen
                  name="SettingsScreen"
                  options={{
                    title: t("settingsTabTitle"),
                    tabBarIcon: ({ color, focused }) => (
                      <ButtonIconWithBadge
                        tooltipText=""
                        iconProps={{ iconKey: focused ? "settings" : "settings-outline", iconColor: color }}
                        backgroundColor="transparent"
                        isBadge={false}
                      />
                    ),
                    header: renderSettingsHeader,
                  }}
                />
              </Tabs>
              <EditBuildModal />
              <LoadBuildModal />
              <UpdateAvailableModal />
              <WelcomeModal />
              <ModalConfirm
                isModalVisible={isModalQuitVisible}
                setIsModalVisible={setIsModalQuitVisible}
                text="quitApp"
                onPress={BackHandler.exitApp}
              />
            </BottomSheetModalProvider>
            <Toast config={toastConfig} bottomOffset={59} swipeable={false} />
          </GestureHandlerRootView>
        </MenuProvider>
      </SafeAreaProvider>
    </PortraitContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
