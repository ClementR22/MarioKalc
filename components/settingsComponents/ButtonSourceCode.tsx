import React, { useCallback } from "react";
import { Linking } from "react-native";
import { IconType } from "react-native-dynamic-vector-icons";
import ButtonAndModalConfirm from "../modal/ButtonAndModalConfirm";

const url = "https://github.com/ClementR22/MK8DSB";

const ButtonSourceCode = () => {
  const handlePress = useCallback(() => {
    Linking.openURL(url);
  }, []);

  return (
    <ButtonAndModalConfirm
      title="sourceCode"
      iconProps={{ name: "github", type: IconType.AntDesign }}
      tooltipText="sourceCode"
      isOpenBrowser
      onPress={handlePress}
    />
  );
};

export default React.memo(ButtonSourceCode);
