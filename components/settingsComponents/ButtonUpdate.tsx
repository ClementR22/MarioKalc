import React from "react";
import { useCheckUpdate } from "@/hooks/useCheckUpdate";
import ButtonAndModalConfirm from "../modal/ButtonAndModalConfirm";

interface ButtonUpdateProps {}

const ButtonUpdate: React.FC<ButtonUpdateProps> = () => {
  const { updateAvailable, openDownloadPage } = useCheckUpdate();

  return (
    <ButtonAndModalConfirm
      title="updateTheApp"
      iconKey="update"
      tooltipText="updateTheApp"
      isOpenBrowser
      disabled={!updateAvailable}
      onPress={openDownloadPage}
    />
  );
};

export default ButtonUpdate;
