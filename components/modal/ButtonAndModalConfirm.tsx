import React, { useMemo, useState } from "react";
import useThemeStore from "@/stores/useThemeStore";
import ButtonSettings from "@/primitiveComponents/ButtonSettings";
import ModalConfirm, { ModalConfirmProps } from "./ModalConfirm";
import { IconKey } from "@/constants/Icons";

interface ButtonAndModalConfirmProps extends Omit<ModalConfirmProps, "isModalVisible" | "setIsModalVisible"> {
  iconKey: IconKey;
  tooltipText: string;
  disabled?: boolean;
}

const ButtonAndModalConfirm: React.FC<ButtonAndModalConfirmProps> = ({
  title,
  iconKey,
  tooltipText,
  text,
  isWarning = false,
  isOpenBrowser = false,
  withConfirmButton = true,
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
        iconProps={{ iconKey, iconColor: isWarning ? theme.on_error : undefined }}
        backgroundColor={isWarning ? theme.error : undefined}
        tooltipText={tooltipText}
        disabled={disabled}
      />
    ),
    [iconKey, isWarning, tooltipText, disabled, theme],
  );

  return (
    <>
      {triggerComponent}
      <ModalConfirm
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        title={title}
        text={text}
        isWarning={isWarning}
        isOpenBrowser={isOpenBrowser}
        withConfirmButton={withConfirmButton}
        onPress={onPress}
      />
    </>
  );
};

export default React.memo(ButtonAndModalConfirm);
