import React, { memo, useCallback } from "react";
import useEditBuildModalStore from "@/stores/useEditBuildModalStore";
import Modal from "../../primitiveComponents/Modal";
import PannelElementsBottom from "../elementsSelector/PannelElementsBottom";
import usePressableElementsStore from "@/stores/usePressableElementsStore";
import { useScreenNameFromPath } from "@/hooks/useScreenNameFromPath";
import useBuildsListStore from "@/stores/useBuildsListStore";
import showToast from "@/utils/showToast";
import { BuildAlreadyExistsError } from "@/errors/errors";
import useGameStore from "@/stores/useGameStore";

const EditBuildModal: React.FC = () => {
  const game = useGameStore((state) => state.game);
  const isEditBuildModalVisible = useEditBuildModalStore((state) => state.isEditBuildModalVisible);
  const setIsEditBuildModalVisible = useEditBuildModalStore((state) => state.setIsEditBuildModalVisible);
  const isBuildsListUpdated = usePressableElementsStore((state) => state.isBuildsListUpdated);
  const selectedClassIdsByCategory = usePressableElementsStore((state) => state.selectedClassIdsByCategory);
  const setIsBuildsListUpdated = usePressableElementsStore((state) => state.setIsBuildsListUpdated);
  const updateBuildsList = useBuildsListStore((state) => state.updateBuildsList);
  const screenName = useScreenNameFromPath();

  const handleCloseEditBuildModal = useCallback(() => {
    if (!isBuildsListUpdated) {
      try {
        updateBuildsList(selectedClassIdsByCategory, screenName, game);
        setIsBuildsListUpdated(true);
        showToast("toast:buildUpdated", "success");
      } catch (e) {
        if (e instanceof BuildAlreadyExistsError) {
          // Construction du message avec sécurité
          const targetMessage = e.target ? `|toast:in|toast:${e.target}` : "";
          const buildNameMessage = e.buildName ? `|toast:withTheName|${e.buildName}` : "";

          const fullMessage = `error:${e.message}${targetMessage}${buildNameMessage}`;

          showToast(fullMessage, "error");
        }
      }
    }
  }, [isBuildsListUpdated, selectedClassIdsByCategory, screenName, game, updateBuildsList, setIsBuildsListUpdated]);

  return (
    <Modal
      modalTitle="selectABuild"
      isModalVisible={isEditBuildModalVisible}
      setIsModalVisible={setIsEditBuildModalVisible}
      onClose={handleCloseEditBuildModal}
    >
      <PannelElementsBottom />
    </Modal>
  );
};

EditBuildModal.displayName = "EditBuildModal";

export default memo(EditBuildModal);
