import React, { useMemo } from "react";
import { Picker as NativePicker } from "@react-native-picker/picker";
import { View, StyleSheet, Platform } from "react-native";
import useThemeStore from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";
import Text from "@/primitiveComponents/Text";
import { BORDER_RADIUS_STANDARD } from "@/utils/designTokens";
import { typography } from "./styles/typography";

export type PickerItem<T> = {
  label: string;
  value: T;
  translatable?: boolean;
};

interface PickerProps<T extends string> {
  value: string;
  setValue: (value: string | number) => void;
  itemList: PickerItem<T>[];
  pickerTitle: string;
  namespace: string;
}

const Picker = <T extends string>({ value, setValue, itemList, pickerTitle, namespace }: PickerProps<T>) => {
  const theme = useThemeStore((state) => state.theme);

  const { t } = useTranslation(namespace);

  const getLabel = (item: PickerItem<T>) => {
    if (item.translatable === false) return item.label;

    return t(item.label);
  };

  const transformedItems = useMemo(() => {
    return itemList.map((item) => <NativePicker.Item key={item.value} label={getLabel(item)} value={item.value} />);
  }, [itemList, t]);

  return (
    <View style={styles.container}>
      <Text role="title" size="small" weight="semibold" namespace="text">
        {pickerTitle}
      </Text>

      <View style={[styles.pickerWrapper, { backgroundColor: "red", borderColor: theme.outline }]}>
        <NativePicker
          selectedValue={value}
          onValueChange={setValue}
          style={[styles.pickerInput, { color: theme.on_surface }]}
          itemStyle={Platform.OS === "ios" ? { color: theme.on_surface } : undefined}
          mode="dropdown"
          dropdownIconColor={Platform.OS === "android" ? "transparent" : undefined}
        >
          {transformedItems}
        </NativePicker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS_STANDARD,
  },
  pickerInput: {
    fontSize: typography.title.small.fontSize,
    paddingHorizontal: 10,
    minHeight: 30,
    width: "100%",
  },
  chevronIcon: {
    position: "absolute",
    right: 10,
    pointerEvents: "none",
  },
});

export default React.memo(Picker);
