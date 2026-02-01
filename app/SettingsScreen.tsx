import React, { useCallback, useState } from "react";
import { ResultStatsProvider } from "@/contexts/ResultStatsContext";
import LanguageSelector from "@/components/settingsComponents/LanguageSelector";
import ThemeSelector from "@/components/settingsComponents/ThemeSelector";
import ButtonResetSettings from "@/components/settingsComponents/ButtonResetSettings";
import ButtonSendFeedback from "@/components/settingsComponents/ButtonSendFeedback";
import ButtonLicenses from "@/components/settingsComponents/ButtonLicenses";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteUserMemory, saveThingInMemory } from "@/utils/asyncStorageOperations";
import ButtonDeleteAllBuildsInMemory from "@/components/settingsComponents/ButtonDeleteAllBuildsInMemory";
import StatSelector from "@/components/statSelector/StatSelector";
import { ScreenProvider } from "@/contexts/ScreenContext";
import ScrollViewScreen from "@/components/ScrollViewScreen";
import ResultsNumberSelector from "@/components/settingsComponents/ResultsNumberSelector";
import Text from "@/primitiveComponents/Text";
import GameSelector from "@/components/settingsComponents/GameSelector";
import ButtonMakeADonation from "@/components/settingsComponents/ButtonMakeADonation";
import ButtonSourceCode from "@/components/settingsComponents/ButtonSourceCode";
import ButtonUpdate from "@/components/settingsComponents/ButtonUpdate";
import { Pressable, StyleSheet, View } from "react-native";
import packageJSON from "@/package.json";
import BoxContainer from "@/primitiveComponents/BoxContainer";
import useGeneralStore from "@/stores/useGeneralStore";
import Modal from "@/primitiveComponents/Modal";
import { ScrollView } from "react-native-gesture-handler";
import useThemeStore from "@/stores/useThemeStore";
import useGameStore from "@/stores/useGameStore";
import { GAME_VERSIONS } from "@/data/registry";

const SettingsScreen: React.FC = () => {
  const theme = useThemeStore((state) => state.theme);
  const game = useGameStore((state) => state.game);
  const isScrollEnable = useGeneralStore((state) => state.isScrollEnable);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [debugDump, setDebugDump] = useState<string | null>(null);

  const updateDebugDump = useCallback(async () => {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);

    setDebugDump(JSON.stringify(Object.fromEntries(items), null, 2));
  }, []);

  const handleRemoveUserMemory = useCallback(async () => {
    // eslint-disable-next-line no-console
    console.log("remove user memory only");
    await deleteUserMemory();

    await updateDebugDump();

    // Réafficher le tutorial mais pas le changelog
    useGeneralStore.getState().showWelcome("");
    // Marquer tutorial comme vu pour que ça ne réapparaisse pas au prochain lancement
    await saveThingInMemory("welcomeSeen", true);
  }, [updateDebugDump]);

  return (
    <ScreenProvider screenName="settings">
      <ScrollViewScreen scrollEnabled={isScrollEnable}>
        <BoxContainer>
          <LanguageSelector />

          <ThemeSelector />

          <GameSelector />

          <View style={styles.buttonsContainer}>
            <ResultsNumberSelector />

            <ResultStatsProvider>
              <StatSelector>
                <Text role="title" size="small" namespace="text">
                  appliedForBuildFinderAndComparator
                </Text>
              </StatSelector>
            </ResultStatsProvider>

            <ButtonSendFeedback />

            <ButtonMakeADonation />

            <ButtonSourceCode />

            <ButtonLicenses />

            <ButtonUpdate />

            <ButtonDeleteAllBuildsInMemory />

            <ButtonResetSettings />
          </View>

          <Pressable
            onLongPress={() => {
              updateDebugDump();
              setIsModalVisible(true);
            }}
          >
            <Text role="body" size="medium" namespace="not" color={theme.on_surface_variant}>
              {`Mario Kalc v${packageJSON.version}  •  ${game} v${GAME_VERSIONS[game]}`}
            </Text>
          </Pressable>

          <Modal
            modalTitle={undefined}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            bottomButtonProps={{
              onPress: handleRemoveUserMemory,
              text: "deleteAllData",
              tooltipText: "deleteAllData",
              isErrorStyle: true,
            }}
          >
            <Text role="title" size="large" namespace="not">
              Debug
            </Text>

            <ScrollView style={styles.debugDump} showsVerticalScrollIndicator>
              <Text role="body" size="large" namespace="not">
                {debugDump}
              </Text>
            </ScrollView>
          </Modal>
        </BoxContainer>
      </ScrollViewScreen>
    </ScreenProvider>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    borderRadius: 12,
    width: "100%",
    gap: 1,
    overflow: "hidden",
  },
  debugDump: { maxHeight: 300 },
});

SettingsScreen.displayName = "SettingsScreen";

export default React.memo(SettingsScreen);
