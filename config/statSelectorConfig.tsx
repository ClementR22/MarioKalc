import { ScreenName } from "@/contexts/ScreenContext";
import Button from "@/primitiveComponents/Button";
import ButtonIcon from "@/primitiveComponents/ButtonIcon";
import ButtonSettings from "@/primitiveComponents/ButtonSettings";

export const modalTitleConfig: Record<ScreenName, string> = {
  search: "desiredStatsAndStatsInBuilds",
  display: "statsToCompare",
  save: "displayedStatsInBuilds",
  gallery: null,
  settings: "defaultDisplayedStats",
};

export const tooltipTextConfig: Record<ScreenName, string> = {
  search: "desiredStatsAndStatsInBuilds",
  display: "statsToCompare",
  save: "displayedStatsInBuilds",
  gallery: null,
  settings: "configureDefaultStats",
};

export const triggerConfig: Record<ScreenName, React.ReactElement> = {
  search: <ButtonIcon iconProps={{ iconKey: "checkbox-multiple-marked" }} tooltipText={tooltipTextConfig.search} />,

  save: <ButtonIcon iconProps={{ iconKey: "checkbox-multiple-marked" }} tooltipText={tooltipTextConfig.save} />,

  display: (
    <Button iconKey="checkbox-multiple-marked" tooltipText={tooltipTextConfig.display}>
      statsToCompare
    </Button>
  ),
  settings: (
    <ButtonSettings
      title="defaultStats"
      iconProps={{ iconKey: "checkbox-multiple-marked" }}
      tooltipText={tooltipTextConfig.settings}
    />
  ),
  gallery: null,
};
