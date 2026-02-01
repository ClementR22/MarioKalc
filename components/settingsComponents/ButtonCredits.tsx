import React, { useCallback } from "react";
import { Linking } from "react-native";
import ButtonAndModalConfirm from "../modal/ButtonAndModalConfirm";

const url = "https://github.com/ClementR22/MarioKalc";

const ButtonCredits = () => {
  const handlePress = useCallback(() => {
    Linking.openURL(url);
  }, []);

  return (
    <ButtonAndModalConfirm
      title="credits"
      iconKey="credits"
      tooltipText="credits"
      text={["creditsText", "specialThanks"]}
      withConfirmButton={false}
      onPress={handlePress}
    />
  );
};

export default React.memo(ButtonCredits);
