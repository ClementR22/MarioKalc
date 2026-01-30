import React, { useCallback } from "react";
import { Linking } from "react-native";
import ButtonAndModalConfirm from "../modal/ButtonAndModalConfirm";

const url = "https://forms.gle/YZvjYiu2pT9Futvd9";

const ButtonSendFeedback = () => {
  const handlePress = useCallback(() => {
    Linking.openURL(url);
  }, []);

  return (
    <ButtonAndModalConfirm
      title="sendFeedback"
      iconKey="feedback"
      tooltipText="sendFeedback"
      isOpenBrowser
      onPress={handlePress}
    />
  );
};

export default React.memo(ButtonSendFeedback);
