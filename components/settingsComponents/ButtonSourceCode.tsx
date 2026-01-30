import React, { useCallback } from "react";
import { Linking } from "react-native";
import ButtonAndModalConfirm from "../modal/ButtonAndModalConfirm";

const url = "https://github.com/ClementR22/MK8DSB";

const ButtonSourceCode = () => {
  const handlePress = useCallback(() => {
    Linking.openURL(url);
  }, []);

  return (
    <ButtonAndModalConfirm
      title="sourceCode"
      iconKey="github"
      tooltipText="sourceCode"
      isOpenBrowser
      onPress={handlePress}
    />
  );
};

export default React.memo(ButtonSourceCode);
