import React, { memo, useMemo } from "react";
import useLoadBuildModalStore from "@/stores/useLoadBuildModalStore";
import ButtonIconWithBadge from "../sortModeSelector/ButtonIconWithBadge";
import useGeneralStore from "@/stores/useGeneralStore";
import PopoverMenu from "../popover/PopoverMenu";
import { ActionIconProps } from "@/hooks/useActionIconPropsList";
import { useImportBuild } from "@/hooks/useImportBuild";
import { useScreen } from "@/contexts/ScreenContext";

interface ButtonLoadBuildProps {
  tooltipText: string;
}

const ButtonLoadBuild: React.FC<ButtonLoadBuildProps> = ({ tooltipText }) => {
  const screenName = useScreen();
  const importBuild = useImportBuild(screenName);
  const openLoadBuildModal = useLoadBuildModalStore((state) => state.openLoadBuildModal);
  const numberSavedBuilds = useGeneralStore((state) => state.numberSavedBuilds);

  const actionIconPropsList: ActionIconProps[] = useMemo(
    () => [
      {
        title: "collection",
        iconKey: "cards-outline",
        onPress: openLoadBuildModal,
      },
      {
        title: "import",
        iconKey: "content-paste",
        onPress: importBuild,
      },
    ],
    [openLoadBuildModal, importBuild],
  );

  return (
    <PopoverMenu
      trigger={(openPopover) => (
        <ButtonIconWithBadge
          onPress={openPopover}
          tooltipText={tooltipText}
          iconProps={{ iconKey: "cards-outline" }}
          badgeText={numberSavedBuilds}
        />
      )}
      actionIconPropsList={actionIconPropsList}
    />
  );
};

export default memo(ButtonLoadBuild);
