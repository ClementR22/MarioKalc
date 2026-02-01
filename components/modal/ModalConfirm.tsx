import React from "react";
import useThemeStore from "@/stores/useThemeStore";
import Text from "@/primitiveComponents/Text";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, View } from "react-native";
import Modal from "@/primitiveComponents/Modal";

export interface ModalConfirmProps {
  isModalVisible: boolean;
  setIsModalVisible: (newBool: boolean) => void;
  title?: string;
  text?: string | string[];
  isWarning?: boolean;
  isOpenBrowser?: boolean;
  withConfirmButton?: boolean;
  onPress: () => any;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  isModalVisible,
  setIsModalVisible,
  title,
  text,
  isWarning = false,
  isOpenBrowser = false,
  withConfirmButton = true,
  onPress,
}) => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <Modal
      isModalVisible={isModalVisible}
      setIsModalVisible={setIsModalVisible}
      modalTitle={isWarning ? undefined : title}
      bottomButtonProps={
        isOpenBrowser
          ? { text: "open", onPress, tooltipText: "open" }
          : withConfirmButton
            ? {
                text: "confirm",
                tooltipText: "confirm",
                onPress,
                isErrorStyle: isWarning,
              }
            : undefined
      }
      childrenContainerStyle={styles.childrenContainer}
    >
      {isWarning && (
        <View>
          <MaterialIcons style={styles.icon} name="warning-amber" size={48} color={theme.error} />
          <Text role="headline" size="large" color={theme.error} textAlign="center" namespace="text">
            warning
          </Text>
        </View>
      )}

      {text && (
        <>
          {Array.isArray(text) ? (
            text.map((line, index) => (
              <Text
                key={index}
                role="body"
                size="large"
                weight="regular"
                textAlign="center"
                color={isWarning ? theme.on_error_container : undefined}
                namespace="text"
              >
                {line}
              </Text>
            ))
          ) : (
            <Text
              role="body"
              size="large"
              weight="regular"
              textAlign="center"
              color={isWarning ? theme.on_error_container : undefined}
              namespace="text"
            >
              {text}
            </Text>
          )}
        </>
      )}

      {isOpenBrowser && (
        <Text
          role="body"
          size="large"
          weight="regular"
          textAlign="center"
          color={isWarning ? theme.on_error_container : undefined}
          namespace="text"
        >
          doYouWantToOpenTheBrowser
        </Text>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  childrenContainer: { paddingVertical: 20, paddingHorizontal: 10 },
  icon: { alignSelf: "center" },
});

export default React.memo(ModalConfirm);
