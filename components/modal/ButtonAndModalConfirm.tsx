import React from "react";
import ButtonAndModal from "./ButtonAndModal";
import useThemeStore from "@/stores/useThemeStore";
import Text from "@/primitiveComponents/Text";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { IconType } from "react-native-dynamic-vector-icons";
import ButtonSettings from "@/primitiveComponents/ButtonSettings";
import { StyleSheet } from "react-native";

interface ButtonAndModalWarningProps {
  title: string;
  iconProps: { name: string; type: IconType };
  tooltipText: string;
  text?: string;
  isWarning?: boolean;
  disabled?: boolean;
  onPress: () => any;
}

const ButtonAndModalConfirm: React.FC<ButtonAndModalWarningProps> = ({
  title,
  iconProps,
  tooltipText,
  text,
  isWarning = false,
  disabled = false,
  onPress,
}) => {
  const theme = useThemeStore((state) => state.theme);

  return (
    <ButtonAndModal
      modalTitle={isWarning ? undefined : title}
      triggerComponent={
        <ButtonSettings
          title={title}
          iconProps={{ name: iconProps.name, type: iconProps.type, color: isWarning ? theme.on_error : undefined }}
          backgroundColor={isWarning ? theme.error : undefined}
          tooltipText={tooltipText}
          disabled={disabled}
        />
      }
      bottomButtonProps={
        isWarning
          ? {
              text: "confirm",
              tooltipText: "confirm",
              onPress: onPress,
              isErrorStyle: true,
            }
          : { text: "open", onPress: onPress, tooltipText: "open" }
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
        {text ? text : "doYouWantToOpenTheBrowser"}
      </Text>
    </ButtonAndModal>
  );
};

const styles = StyleSheet.create({
  icon: { alignSelf: "center", paddingTop: 12 },
  text: { padding: 20 },
});

export default React.memo(ButtonAndModalConfirm);
