import React from "react";
import { StyleSheet, View } from "react-native";
import IconContainer from "@/primitiveComponents/IconContainer";
import Text from "@/primitiveComponents/Text";
import Tooltip from "../Tooltip";
import { IconKey } from "@/constants/Icons";

interface HelpButtonDescriptionProps {
  iconKey: IconKey;
  description: string;
  namespaceDescription: string;
  tooltipText: string;
  namespaceTooltipText?: string;
}

const HelpButtonDescription = ({
  iconKey,
  description,
  namespaceDescription,
  tooltipText,
  namespaceTooltipText,
}: HelpButtonDescriptionProps) => {
  return (
    <View style={styles.container}>
      <Tooltip tooltipText={tooltipText} namespace={namespaceTooltipText}>
        <IconContainer iconProps={{ iconKey }} />
      </Tooltip>

      <View style={styles.description}>
        <Text role="body" size="large" namespace={namespaceDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  description: { flex: 1 },
});

export default HelpButtonDescription;
