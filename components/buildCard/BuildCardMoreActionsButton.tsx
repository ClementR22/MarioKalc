import React from "react";
import { useActionIconPropsList } from "@/hooks/useActionIconPropsList";
import { ActionNamesList } from "@/hooks/useBuildCardConfig";
import { ScreenName } from "@/contexts/ScreenContext";
import PopoverMenu from "../popover/PopoverMenu";
import ButtonIcon from "@/primitiveComponents/ButtonIcon";

interface BuildCardMoreActionsButtonProps {
  moreActionNamesList: ActionNamesList;
  buildDataId: string;
  screenName: ScreenName;
}

const BuildCardMoreActionsButton: React.FC<BuildCardMoreActionsButtonProps> = ({
  moreActionNamesList,
  buildDataId,
  screenName,
}) => {
  const actionIconPropsList = useActionIconPropsList(moreActionNamesList, screenName, false, buildDataId);

  return (
    <PopoverMenu
      trigger={(openPopover) => (
        <ButtonIcon tooltipText="moreActions" onPress={openPopover} iconProps={{ iconKey: "more" }} />
      )}
      actionIconPropsList={actionIconPropsList}
    />
  );
};

export default React.memo(BuildCardMoreActionsButton);
