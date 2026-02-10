import React from "react";
import Picker, { PickerItem } from "../Picker";
import useLanguageStore, { LanguageMode } from "@/stores/useLanguageStore";

export const languageList: PickerItem<LanguageMode>[] = [
  { label: "English", value: "en", translatable: false },
  { label: "Français", value: "fr", translatable: false },
  { label: "system", value: "system", translatable: true },
];

const LanguageSelector = () => {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return (
    <Picker
      value={language}
      setValue={setLanguage}
      itemList={languageList}
      pickerTitle="language"
      namespace="language"
    />
  );
};

export default React.memo(LanguageSelector);
