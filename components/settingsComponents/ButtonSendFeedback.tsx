import React, { useCallback } from "react";
import { Linking } from "react-native";
import { IconType } from "react-native-dynamic-vector-icons";
import ButtonAndModalConfirm from "../modal/ButtonAndModalConfirm";

const url = "https://forms.gle/YZvjYiu2pT9Futvd9";

const ButtonSendFeedback = () => {
  const handlePress = useCallback(() => {
    Linking.openURL(url);
  }, []);

  return (
    <ButtonAndModalConfirm
      title="sendFeedback"
      iconProps={{ name: "chatbox-ellipses-outline", type: IconType.Ionicons }}
      tooltipText="sendFeedback"
      isOpenBrowser
      onPress={handlePress}
    />
  );
};

export default React.memo(ButtonSendFeedback);
