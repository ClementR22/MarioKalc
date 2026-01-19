import React from "react";
import useBuildsListStore from "@/stores/useBuildsListStore";
import showToast from "@/utils/showToast";
import ButtonAndModalConfirm from "../modal/ButtonAndModalConfirm";
import { IconType } from "react-native-dynamic-vector-icons";

const ButtonDeleteAllBuildsInMemory = () => {
  const deleteAllSavedBuilds = useBuildsListStore((state) => state.deleteAllSavedBuilds);

  const handleDeleteAllSavedBuilds = () => {
    deleteAllSavedBuilds();
    showToast("toast:allSavedBuildsHaveBeenDeleted", "success", 3000);
  };

  return (
    <ButtonAndModalConfirm
      title="deleteAllBuildsInMemory"
      iconProps={{ name: "trash-can", type: IconType.MaterialCommunityIcons }}
      tooltipText="deleteAllBuildsInMemory"
      text="deleteAllBuildsInMemoryText"
      isWarning={true}
      onPress={handleDeleteAllSavedBuilds}
    />
  );
};

export default React.memo(ButtonDeleteAllBuildsInMemory);
