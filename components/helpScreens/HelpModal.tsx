import React, { useMemo } from "react";
import { IconType } from "react-native-dynamic-vector-icons";
import ButtonIcon from "@/primitiveComponents/ButtonIcon";
import ButtonAndModal from "../modal/ButtonAndModal";
import { StyleSheet } from "react-native";
import useThemeStore from "@/stores/useThemeStore";
import { ScrollView } from "react-native-gesture-handler";
import useGeneralStore from "@/stores/useGeneralStore";

type HelpModalProps = {
  title: string;
  children: React.ReactElement[];
};

const HelpModal: React.FC<HelpModalProps> = ({ title, children }) => {
  const theme = useThemeStore((state) => state.theme);

  const isScrollEnable = useGeneralStore((state) => state.isScrollEnable);

  const triggerComponent = useMemo(
    () => (
      <ButtonIcon
        iconName="help-circle-outline"
        iconType={IconType.MaterialCommunityIcons}
        buttonSize={48}
        iconColor={theme.on_surface}
        backgroundColor="transparent"
        tooltipText="help"
        toolTipPlacement="left"
      />
    ),
    [theme.on_surface],
  );

  return (
    <ButtonAndModal modalTitle={title} triggerComponent={triggerComponent}>
      <ScrollView scrollEnabled={isScrollEnable} style={styles.scrollView} contentContainerStyle={styles.container}>
        {children}
      </ScrollView>
    </ButtonAndModal>
  );
};

const styles = StyleSheet.create({
  container: { gap: 20, padding: 10, paddingTop: 20 },
  scrollView: { maxHeight: 450 },
});

export default React.memo(HelpModal);
