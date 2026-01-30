import React from "react";
import BoxContainer from "../../primitiveComponents/BoxContainer";
import ButtonIcon from "../../primitiveComponents/ButtonIcon";
import { useActionIconPropsList } from "@/hooks/useActionIconPropsList";
import { ActionNamesList } from "@/hooks/useBuildCardConfig";
import { ScreenName } from "@/contexts/ScreenContext";
import { BORDER_RADIUS_MEDIUM } from "@/utils/designTokens";

interface BuildCardActionButtonsProps {
  actionNamesList: ActionNamesList;
  buildDataId: string;
  screenName: ScreenName;
  isInLoadBuildModal: boolean;
  isSaved: boolean;
}

const BuildCardActionButtons: React.FC<BuildCardActionButtonsProps> = ({
  actionNamesList,
  buildDataId,
  screenName,
  isInLoadBuildModal,
  isSaved,
}) => {
  const actionIconPropsList = useActionIconPropsList(
    actionNamesList,
    screenName,
    isInLoadBuildModal,
    buildDataId,
    isSaved,
  );

  return (
    <BoxContainer
      flexDirection="row"
      key="comparatorTitleActionButtonContainer"
      marginHorizontal={0}
      justifyContent="space-around"
      borderRadius={BORDER_RADIUS_MEDIUM}
    >
      {actionIconPropsList.map((actionProps) => {
        const { title, iconKey, onPress } = actionProps;
        return <ButtonIcon key={title} tooltipText={title} iconProps={{ iconKey }} onPress={onPress} />;
      })}
    </BoxContainer>
  );
};

export default React.memo(BuildCardActionButtons);
