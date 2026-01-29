import React, { useMemo, useState } from "react";
import useThemeStore from "@/stores/useThemeStore";
import { IconType } from "react-native-dynamic-vector-icons";
import ButtonSettings from "@/primitiveComponents/ButtonSettings";
import ModalConfirm from "./ModalConfirm";

interface ButtonAndModalConfirmProps {
  title?: string;
  iconProps: { name: string; type: IconType };
  tooltipText: string;
  text?: string;
  isWarning?: boolean;
  isOpenBrowser?: boolean;
  disabled?: boolean;
  onPress: () => any;
}

const ButtonAndModalConfirm: React.FC<ButtonAndModalConfirmProps> = ({
  title,
  iconProps,
  tooltipText,
  text,
  isWarning = false,
  isOpenBrowser = false,
  disabled = false,
  onPress,
}) => {
  const theme = useThemeStore((state) => state.theme);

  // État interne pour gérer la visibilité si les props externes ne sont pas fournies
  const [isModalVisible, setIsModalVisible] = useState(false);

  const triggerComponent = useMemo(
    () => (
      <ButtonSettings
        title={title}
        onPress={() => setIsModalVisible(true)}
        iconProps={{ name: iconProps.name, type: iconProps.type, color: isWarning ? theme.on_error : undefined }}
        backgroundColor={isWarning ? theme.error : undefined}
        tooltipText={tooltipText}
        disabled={disabled}
      />
    ),
    [iconProps, isWarning, tooltipText, disabled, theme],
  );

  return (
    <>
      {triggerComponent}
      <ModalConfirm
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        title={title}
        text={text}
        isOpenBrowser={isOpenBrowser}
        isWarning={isWarning}
        onPress={onPress}
      />
    </>
  );
};

export default React.memo(ButtonAndModalConfirm);
