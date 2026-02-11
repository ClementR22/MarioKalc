// components/modal/WelcomeModal.tsx
import React, { useEffect, useRef, useState } from "react";
import Modal from "@/primitiveComponents/Modal";
import Text from "@/primitiveComponents/Text";
import useGeneralStore from "@/stores/useGeneralStore";
import { Image, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useGameData } from "@/hooks/useGameData";
import { BUTTON_SIZE, MARGIN_HORIZONTAL_MODAL_CHILDREN_CONTAINER } from "@/utils/designTokens";
import Tooltip from "../Tooltip";
import { elementsNamespaceByGame, statsNamespaceByGame } from "@/translations/namespaces";
import useGameStore from "@/stores/useGameStore";
import { ScrollView } from "react-native-gesture-handler";
import { styles as stylesButton } from "@/primitiveComponents/Button";
import useThemeStore from "@/stores/useThemeStore";
import { useLayout } from "@/contexts/LayoutContext";

const WelcomeModal = () => {
  const game = useGameStore((state) => state.game);
  const { appWidth } = useLayout();
  const { elementsData, statNames, statNamesCompact } = useGameData();
  const { ready } = useTranslation();
  const theme = useThemeStore((state) => state.theme);
  const isWelcome = useGeneralStore((state) => state.isWelcome);
  const welcomeMessage = useGeneralStore((state) => state.welcomeMessage);
  const hideWelcome = useGeneralStore((state) => state.hideWelcome);

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => setIsModalVisible(isWelcome && ready), [isWelcome, ready]);

  const scrollViewRef = useRef<ScrollView>(null);

  if (!ready) {
    return null;
  }

  const firstElement = elementsData?.[0];

  const containerStyle = [styles.container, { width: appWidth - 2 * MARGIN_HORIZONTAL_MODAL_CHILDREN_CONTAINER }];

  return (
    <Modal
      modalTitle="welcome"
      isModalVisible={isModalVisible}
      setIsModalVisible={setIsModalVisible}
      onClose={hideWelcome}
    >
      {welcomeMessage ? (
        // Si message fourni = changelog
        <View style={containerStyle}>
          <Text role="body" size="large" textAlign="center" namespace="text">
            {welcomeMessage}
          </Text>
        </View>
      ) : (
        // Sinon, c'est le tutorial
        <ScrollView ref={scrollViewRef} horizontal pagingEnabled contentContainerStyle={styles.scrollview}>
          <View style={containerStyle}>
            <Text role="body" size="large" textAlign="center" namespace="not">
              <Text role="body" size="large" textAlign="center" namespace="text">
                welcomeText1
              </Text>
              <Text role="body" size="large" weight="bold" textAlign="center" namespace="text">
                longPress
              </Text>
              <Text role="body" size="large" textAlign="center" namespace="text">
                welcomeText2
              </Text>
            </Text>

            <Tooltip
              onClose={() => scrollViewRef.current?.scrollToEnd()}
              childStyleOuter={[stylesButton.containerOuter, { backgroundColor: theme.primary }]}
              childStyleInner={stylesButton.containerInner}
              tooltipText="thisIsAnExample"
              namespace="tooltip"
            >
              <Text
                role="title"
                size="small"
                weight="semibold"
                textAlign="center"
                color={theme.on_primary}
                namespace="text"
              >
                LongPress
              </Text>
            </Tooltip>
          </View>

          <View style={containerStyle}>
            <Text role="body" size="large" textAlign="center" namespace="not">
              <Text role="body" size="large" textAlign="center" namespace="text">
                welcomeText3
              </Text>
              <Text role="body" size="large" weight="bold" textAlign="center" namespace="text">
                pictures
              </Text>
              <Text role="body" size="large" textAlign="center" namespace="text">
                and
              </Text>
              <Text role="body" size="large" weight="bold" textAlign="center" namespace="text">
                stats
              </Text>
              <Text role="body" size="large" textAlign="center" namespace="text">
                too
              </Text>
            </Text>

            <View style={styles.row}>
              {firstElement && (
                <Tooltip tooltipText={elementsData[0].name} namespace={elementsNamespaceByGame[game]}>
                  <Image source={elementsData[0].imageUrl} style={styles.image} resizeMode="contain" />
                </Tooltip>
              )}

              <Tooltip tooltipText={statNames[0]} namespace={statsNamespaceByGame[game]}>
                <Text
                  role="label"
                  size="large"
                  style={styles.abbreviation}
                  namespace={statsNamespaceByGame[game]}
                  textAlign="center"
                >
                  {statNamesCompact[statNames[0]]}
                </Text>
              </Tooltip>
            </View>
          </View>
        </ScrollView>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 15,
    padding: 10,
    alignItems: "center",
  },
  scrollview: { flexDirection: "row", alignItems: "center" },
  row: { flexDirection: "row", width: "100%", justifyContent: "space-evenly", alignItems: "center" },
  image: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE * 0.8,
  },
  abbreviation: { width: 45, marginLeft: 3, marginRight: 8 },
});

export default WelcomeModal;
