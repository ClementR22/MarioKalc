import React from "react";
import { useCheckUpdate } from "@/hooks/useCheckUpdate";
import { IconType } from "react-native-dynamic-vector-icons";
import ButtonAndModalConfirm from "../modal/ButtonAndModalConfirm";

interface ButtonUpdateProps {}

const ButtonUpdate: React.FC<ButtonUpdateProps> = () => {
  const { updateAvailable, openDownloadPage } = useCheckUpdate();

  return (
    <ButtonAndModalConfirm
      title="updateTheApp"
      iconProps={{ name: "system-update-alt", type: IconType.MaterialIcons }}
      tooltipText="updateTheApp"
      isOpenBrowser
      disabled={!updateAvailable}
      onPress={openDownloadPage}
    />
  );
};

export default ButtonUpdate;
