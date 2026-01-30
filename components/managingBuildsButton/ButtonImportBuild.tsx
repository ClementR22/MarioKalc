import React from "react";
import { ScreenName } from "@/contexts/ScreenContext";
import ButtonIcon from "../../primitiveComponents/ButtonIcon";
import { useImportBuild } from "@/hooks/useImportBuild";

interface ButtonImportBuildProps {
  screenName: ScreenName;
}

const ButtonImportBuild: React.FC<ButtonImportBuildProps> = ({ screenName }) => {
  const importBuild = useImportBuild(screenName);

  return <ButtonIcon onPress={importBuild} tooltipText="importACopiedBuild" iconProps={{ iconKey: "content-paste" }} />;
};

export default React.memo(ButtonImportBuild);
