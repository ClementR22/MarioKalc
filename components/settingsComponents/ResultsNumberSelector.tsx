import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import ButtonIcon from "@/primitiveComponents/ButtonIcon";
import useGeneralStore from "@/stores/useGeneralStore";
import ButtonAndModal from "@/components/modal/ButtonAndModal";
import Text from "@/primitiveComponents/Text";
import ButtonSettings from "@/primitiveComponents/ButtonSettings";

const MIN_RESULTS = 1;
const MAX_RESULTS = 20;

const ResultsNumberSelector = () => {
  const resultsNumber = useGeneralStore((state) => state.resultsNumber);
  const setResultsNumber = useGeneralStore((state) => state.setResultsNumber);

  const [resultsNumberInModal, setResultsNumberInModal] = useState(resultsNumber);

  const canDecrement = resultsNumberInModal > MIN_RESULTS;
  const canIncrement = resultsNumberInModal < MAX_RESULTS;

  return (
    <ButtonAndModal
      modalTitle="numberOfSearchResults"
      triggerComponent={
        <ButtonSettings
          title="numberOfSearchResults"
          iconProps={{ iconKey: "numbers" }}
          tooltipText="numberOfSearchResults"
        />
      }
      onOpen={() => setResultsNumberInModal(resultsNumber)}
      onClose={() => {
        if (resultsNumber !== resultsNumberInModal) {
          setResultsNumber(resultsNumberInModal);
        }
      }}
    >
      <View style={styles.container}>
        <ButtonIcon
          onPress={() => setResultsNumberInModal((v) => Math.max(v - 1, MIN_RESULTS))}
          iconProps={{ iconKey: "minus" }}
          disabled={!canDecrement}
          tooltipText="decrease"
        />

        <Text role="display" size="medium" textAlign="center" style={styles.resultsNumberText} namespace="not">
          {resultsNumberInModal}
        </Text>

        <ButtonIcon
          onPress={() => setResultsNumberInModal((v) => Math.min(v + 1, MAX_RESULTS))}
          iconProps={{ iconKey: "plus" }}
          disabled={!canIncrement}
          tooltipText="increase"
        />
      </View>
    </ButtonAndModal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    flexDirection: "row",
    paddingHorizontal: 14,
  },
  resultsNumberText: {
    flexGrow: 1,
  },
});

export default React.memo(ResultsNumberSelector);
