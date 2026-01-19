import React, { useState, useCallback, useRef, useEffect } from "react";
import { useScreen } from "../../contexts/ScreenContext";
import useBuildsListStore from "@/stores/useBuildsListStore";
import BuildNameInputContent from "./BuildNameInputContent";
import showToast from "@/utils/showToast";
import { NameAlreadyExistsError, NameInvalidError } from "@/errors/errors";
import { useKeyboardDidHideWhileFocused } from "@/hooks/useKeyboardDidHideWhileFocused";
import { TextInput } from "react-native";

interface BuildNameInputProps {
  name: string;
  buildDataId: string;
  editable?: boolean;
  isSaved: boolean;
}

const BuildNameInput: React.FC<BuildNameInputProps> = ({ name, buildDataId, editable = true, isSaved }) => {
  const screenName = useScreen();
  const renameBuild = useBuildsListStore((state) => state.renameBuild);
  const setScrollRequest = useBuildsListStore((state) => state.setScrollRequest);

  const [localName, setLocalName] = useState(name);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (name != localName) {
      setLocalName(name);
    }
  }, [name]);

  const updateName = useCallback(
    (localName: string) => {
      let newName = localName.trim();

      if (!newName) {
        newName = "";
        setLocalName(newName);
      }

      if (newName !== name) {
        try {
          renameBuild(localName, screenName, buildDataId, isSaved);
          showToast("toast:buildRenamed", "success");
        } catch (e) {
          if (e instanceof NameAlreadyExistsError) {
            showToast(`error:${e.message}|${e.buildName}`, "error");
          } else if (e instanceof NameInvalidError) {
            showToast(`error:${e.message}|${e.buildName}`, "error");
          } else {
            showToast(`error:${e.message}`, "error");
          }
          setLocalName(name);
        }
      }
    },
    [name, screenName, buildDataId, isSaved, renameBuild],
  );

  // Hook pour ne déclencher que si l'input est focus
  useKeyboardDidHideWhileFocused(updateName, focused, inputRef, localName);

  const handleFocus = useCallback(() => {
    setFocused(true);
    setScrollRequest(screenName, buildDataId);
  }, [screenName, buildDataId, , setScrollRequest]);

  const handleEndEditingOrBlur = useCallback(() => {
    "end editing";
    if (focused) {
      setFocused(false);
    }
    // si on blur avant de fermer le keyboard,
    // alors useKeyboardDidHideWhileFocused n'appelle par updateName
    // donc on le fait ici
    updateName(localName);
  }, [localName, focused, setFocused, updateName]);

  return (
    <BuildNameInputContent
      inputRef={inputRef}
      value={localName}
      onChangeText={setLocalName}
      onEndEditingOrBlur={handleEndEditingOrBlur}
      editable={editable}
      onFocus={handleFocus}
      id={buildDataId.toString()}
    />
  );
};

BuildNameInput.displayName = "BuildNameInput";

export default React.memo(BuildNameInput);
