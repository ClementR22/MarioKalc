import React from "react";
import { StyleSheet, View } from "react-native";
import ButtonAndModal from "../modal/ButtonAndModal";
import ButtonSettings from "@/primitiveComponents/ButtonSettings";
import licenses from "@/assets/licenses.json";
import { ScrollView } from "react-native-gesture-handler";
import { vh } from "../styles/theme";
import Text from "@/primitiveComponents/Text";
import Separator from "../Separator";
import { PADDING_BOX_CONTAINER } from "@/utils/designTokens";

const ButtonLicenses = () => {
  return (
    <ButtonAndModal
      modalTitle="licenses"
      triggerComponent={
        <ButtonSettings
          title="openSourceLicenses"
          iconProps={{ iconKey: "license" }}
          tooltipText="openSourceLicenses"
        />
      }
    >
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
        {Object.entries(licenses).map(([packageName, data]: any) => (
          <View key={packageName} style={styles.licenseContainer}>
            <Text key="packageName" role="label" size="large" namespace="not">
              {packageName}
            </Text>
            <Text key="licenseText" role="body" size="large" namespace="not">
              {data.licenseText}
            </Text>

            <Separator direction="horizontal" wrapperStyle={styles.separatorWrapper} />
          </View>
        ))}
      </ScrollView>
    </ButtonAndModal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    padding: PADDING_BOX_CONTAINER,
    paddingTop: 20,
    width: "100%",
  },
  scrollView: {
    maxHeight: vh * 0.75,
  },
  licenseContainer: { gap: PADDING_BOX_CONTAINER },
  separatorWrapper: { marginVertical: 10 },
});

// pour mettre à jour la liste des licences
// npm run generate:licenses

export default React.memo(ButtonLicenses);
