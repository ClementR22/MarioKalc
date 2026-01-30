import React from "react";
import useThemeStore from "@/stores/useThemeStore";
import Text from "@/primitiveComponents/Text";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet } from "react-native";
import Modal from "@/primitiveComponents/Modal";

export interface ModalConfirmProps {
  isModalVisible: boolean;
  setIsModalVisible: (newBool: boolean) => void;
  title?: string;
  text?: string;
  isWarning?: boolean;
  isOpenBrowser?: boolean;
  onPress: () => any;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  isModalVisible,
  setIsModalVisible,
  title,
  text,
  isWarning = false,
  isOpenBrowser = false,
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
          : {
              text: "confirm",
              tooltipText: "confirm",
              onPress,
              isErrorStyle: isWarning,
            }
      }
    >
      {isWarning && (
        <>
          <MaterialIcons style={styles.icon} name="warning-amber" size={48} color={theme.error} />
          <Text role="headline" size="large" color={theme.error} textAlign="center" namespace="text">
            warning
          </Text>
        </>
      )}

      <Text
        role="body"
        size="large"
        weight="regular"
        textAlign="center"
        color={isWarning ? theme.on_error_container : undefined}
        style={styles.text}
        namespace="text"
      >
        {isOpenBrowser ? "doYouWantToOpenTheBrowser" : text}
      </Text>
    </Modal>
  );
};

const styles = StyleSheet.create({
  icon: { alignSelf: "center", paddingTop: 12 },
  text: { padding: 20 },
});

export default React.memo(ModalConfirm);
