import React, { memo } from "react";
import HelpModal from "./HelpModal";
import StatGaugeContainerCompare from "../statGaugeCompare/StatGaugeContainerCompare";
import HelpButtonDescription from "../helpComponents/HelpButtonDescription";
import Text from "@/primitiveComponents/Text";
import HelpStepItem from "../helpComponents/HelpStepItem";
import HelpSection from "../helpComponents/HelpSection";
import HelpHighlightBox from "../helpComponents/HelpHighlightBox";
import Button from "@/primitiveComponents/Button";
import useGameStore from "@/stores/useGameStore";
import { sortsNamespaceByGame } from "@/translations/namespaces";
import { useGameData } from "@/hooks/useGameData";

const HelpDisplayBuildScreen = () => {
  const { MAX_STAT_VALUE_BUILD } = useGameData();
  const obtainedValues = [0.5, 0.75, 0.25].map((coef) => coef * MAX_STAT_VALUE_BUILD);

  const game = useGameStore((state) => state.game);

  return (
    <HelpModal title="guideBuildComparator">
      {/* Intro */}
      <Text role="body" size="large" textAlign="center" namespace="not">
        <Text role="body" size="large" weight="bold" namespace="helpDisplay">
          intro.compare_sets
        </Text>
        <Text role="body" size="large" textAlign="center" namespace="helpDisplay">
          intro.compare_description
        </Text>
      </Text>

      {/* Section 1 — How to use */}
      <HelpSection title="how_to_use.title" namespace="helpDisplay" contentType="step">
        <HelpStepItem key={1} stepChar="1" title="how_to_use.step.add_sets" namespace="helpDisplay">
          <HelpButtonDescription
            iconKey="plus"
            description="how_to_use.step.add_sets.label_create_set"
            namespaceDescription="helpDisplay"
            tooltipText="addABuild"
          />
        </HelpStepItem>

        <HelpStepItem key={2} stepChar="2" title="how_to_use.step.edit_sets" namespace="helpDisplay">
          <HelpButtonDescription
            iconKey="pencil"
            description="how_to_use.step.edit_sets.label_edit_elements"
            namespaceDescription="helpDisplay"
            tooltipText="editTheBuild"
          />
        </HelpStepItem>

        <HelpStepItem key={3} stepChar="3" title="how_to_use.step.view_differences" namespace="helpDisplay">
          <StatGaugeContainerCompare
            name="acceleration"
            buildsIdAndValue={[
              { id: "1", value: obtainedValues[0], color: "#E74C3C" },
              { id: "2", value: obtainedValues[1], color: "#3498DB" },
              { id: "3", value: obtainedValues[2], color: "#2ECC71" },
            ]}
          />
          <Text role="body" size="large" fontStyle="italic" namespace="helpDisplay">
            how_to_use.step.view_differences.label_each_color
          </Text>
          <Text role="body" size="large" fontStyle="italic" namespace="helpDisplay">
            how_to_use.step.view_differences.label_tap_to_navigate
          </Text>
        </HelpStepItem>

        <HelpStepItem
          key={4}
          stepChar="4"
          title="how_to_use.step.choose_stats"
          namespace="helpDisplay"
          alignItems="center"
        >
          <Button iconKey="checkbox-multiple-marked" onPress={null} tooltipText="statsToCompare">
            statsToCompare
          </Button>
        </HelpStepItem>
      </HelpSection>

      {/* Section 2 — Advanced options */}
      <HelpSection title="advanced_options.title" namespace="helpDisplay" contentType="step">
        <HelpStepItem key="A" stepChar="A" title="advanced_options.step.import_from_collection" namespace="helpDisplay">
          <HelpButtonDescription
            iconKey="cards-outline"
            description="advanced_options.step.import_from_collection.label_open_collection"
            namespaceDescription="helpDisplay"
            tooltipText="loadABuild"
          />
          <HelpButtonDescription
            iconKey="check"
            description="advanced_options.step.import_from_collection.label_import_set"
            namespaceDescription="helpDisplay"
            tooltipText="loadTheBuild"
          />
        </HelpStepItem>

        <HelpStepItem key="B" stepChar="B" title="advanced_options.step.sort_sets" namespace="helpDisplay">
          <HelpButtonDescription
            iconKey="sort"
            description="advanced_options.step.sort_sets.label_open_sorts"
            namespaceDescription="helpDisplay"
            tooltipText="sortBuilds"
          />
          <HelpButtonDescription
            iconKey="sort-alphabetical-ascending"
            description="advanced_options.step.sort_sets.label_select_sort"
            namespaceDescription="helpDisplay"
            tooltipText="name"
            namespaceTooltipText={sortsNamespaceByGame[game]}
          />
          <Text role="body" size="large" fontStyle="italic" namespace="helpDisplay">
            advanced_options.step.sort_sets.label_long_press_hint
          </Text>
        </HelpStepItem>
      </HelpSection>

      {/* Section 3 — Actions */}
      <HelpSection title="actions.title" namespace="helpDisplay" contentType="button">
        <HelpButtonDescription
          iconKey="content-save-outline"
          description="actions.label_save_to_collection"
          namespaceDescription="helpDisplay"
          tooltipText="save"
        />
        <HelpButtonDescription
          iconKey="magnify"
          description="actions.label_copy_to_finder"
          namespaceDescription="helpDisplay"
          tooltipText="loadTheStats"
        />
        <HelpButtonDescription
          iconKey="share"
          description="actions.label_export_set"
          namespaceDescription="helpDisplay"
          tooltipText="share"
        />
      </HelpSection>

      {/* Tips */}
      <HelpHighlightBox type="tips" title="tips.title" namespace="helpDisplay">
        {["tips.limit_sets", "tips.tooltip"]}
      </HelpHighlightBox>
    </HelpModal>
  );
};

export default memo(HelpDisplayBuildScreen);
