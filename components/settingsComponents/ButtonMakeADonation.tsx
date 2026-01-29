import React, { useCallback } from "react";
import { Linking } from "react-native";
import { IconType } from "react-native-dynamic-vector-icons";
import ButtonAndModalConfirm from "../modal/ButtonAndModalConfirm";

const url = "https://www.paypal.com/donate/?hosted_button_id=7YMYSGASUL7A8";

const ButtonMakeADonation = () => {
  const handleContactPress = useCallback(() => {
    Linking.openURL(url);
  }, []);

  return (
    <ButtonAndModalConfirm
      title="makeADonation"
      iconProps={{ name: "hand-heart", type: IconType.MaterialCommunityIcons }}
      tooltipText="makeADonation"
      isOpenBrowser
      onPress={handleContactPress}
    />
  );
};

export default React.memo(ButtonMakeADonation);
