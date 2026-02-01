import React, { useCallback } from "react";
import { Linking } from "react-native";
import ButtonAndModalConfirm from "../modal/ButtonAndModalConfirm";

const url = "https://docs.google.com/spreadsheets/d/1BtHeFAEwL1MLND-l7KZz_Zg4wZWC2YIikbyweocqwSs/edit?usp=sharing";

const ButtonGameData = () => {
  const handlePress = useCallback(() => {
    Linking.openURL(url);
  }, []);

  return (
    <ButtonAndModalConfirm
      title="gameData"
      iconKey="database"
      tooltipText="gameData"
      isOpenBrowser
      onPress={handlePress}
    />
  );
};

export default React.memo(ButtonGameData);
