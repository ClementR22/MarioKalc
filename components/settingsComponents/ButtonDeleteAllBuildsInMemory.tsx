import React from "react";
import useBuildsListStore from "@/stores/useBuildsListStore";
import showToast from "@/utils/showToast";
import ButtonAndModalConfirm from "../modal/ButtonAndModalConfirm";
import useGameStore from "@/stores/useGameStore";

const ButtonDeleteAllBuildsInMemory = () => {
  const game = useGameStore((state) => state.game);
  const deleteAllSavedBuilds = useBuildsListStore((state) => state.deleteAllSavedBuilds);

  const handleDeleteAllSavedBuilds = () => {
    deleteAllSavedBuilds(game);
    showToast("toast:allSavedBuildsHaveBeenDeleted", "success", 3000);
  };

  return (
    <ButtonAndModalConfirm
      title="deleteAllBuildsInMemory"
      iconKey="trash-can"
      tooltipText="deleteAllBuildsInMemory"
      text="deleteAllBuildsInMemoryText"
      isWarning={true}
      onPress={handleDeleteAllSavedBuilds}
    />
  );
};

export default React.memo(ButtonDeleteAllBuildsInMemory);
