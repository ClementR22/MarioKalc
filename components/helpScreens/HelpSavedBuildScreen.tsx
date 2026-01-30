import React, { memo } from "react";
import HelpModal from "./HelpModal";
import HelpButtonDescription from "../helpComponents/HelpButtonDescription";
import Text from "@/primitiveComponents/Text";
import HelpStepItem from "../helpComponents/HelpStepItem";
import HelpSection from "../helpComponents/HelpSection";
import { sortsNamespaceByGame } from "@/translations/namespaces";
import useGameStore from "@/stores/useGameStore";

const HelpFavoritesScreen = () => {
  const game = useGameStore((state) => state.game);

  return (
    <HelpModal title="guideBuildCollection">
      {/* Intro */}
      <Text role="body" size="large" textAlign="center" namespace="not">
        <Text role="body" size="large" weight="bold" namespace="helpSave">
          intro.centralize
        </Text>
        <Text role="body" size="large" textAlign="center" namespace="helpSave">
          intro.description
        </Text>
      </Text>

      <HelpSection title="how_to_use_collection.title" namespace="helpSave" contentType="step">
        <HelpStepItem stepChar={"1"} title="how_to_use_collection.step.save_set" namespace="helpSave">
          <HelpButtonDescription
            iconKey="content-save-outline"
            description="how_to_use_collection.step.save_set.label_description"
            namespaceDescription="helpSave"
            tooltipText="save"
          />
        </HelpStepItem>

        <HelpStepItem stepChar={"2"} title="how_to_use_collection.step.choose_stats" namespace="helpSave">
          <HelpButtonDescription
            iconKey="checkbox-multiple-marked"
            description="how_to_use_collection.step.choose_stats.label_description"
            namespaceDescription="helpSave"
            tooltipText="displayedStatsInBuilds"
          />
        </HelpStepItem>
      </HelpSection>

      <HelpSection title="advanced_options.title" namespace="helpSave" contentType="step">
        <HelpStepItem stepChar={"A"} title="advanced_options.step.import_set" namespace="helpSave">
          <HelpButtonDescription
            iconKey="content-paste"
            description="advanced_options.step.import_set.label_description"
            namespaceDescription="helpSave"
            tooltipText="importACopiedBuild"
          />
        </HelpStepItem>

        <HelpStepItem stepChar={"B"} title="advanced_options.step.sort_sets" namespace="helpSave">
          <HelpButtonDescription
            iconKey="sort"
            description="advanced_options.step.sort_sets.label_open_sorts"
            namespaceDescription="helpSave"
            tooltipText="sortBuilds"
          />
          <HelpButtonDescription
            iconKey="sort-alphabetical-ascending"
            description="advanced_options.step.sort_sets.label_select_sort"
            namespaceDescription="helpSave"
            tooltipText="name"
            namespaceTooltipText={sortsNamespaceByGame[game]}
          />
          <Text role="body" size="large" fontStyle="italic" namespace="helpSave">
            advanced_options.step.sort_sets.label_long_press_hint
          </Text>
        </HelpStepItem>
      </HelpSection>

      <HelpSection title="actions.title" namespace="helpSave" contentType="button">
        <HelpButtonDescription
          iconKey="pencil"
          description="actions.label_edit_elements"
          namespaceDescription="helpSave"
          tooltipText="editTheBuild"
        />
        <HelpButtonDescription
          iconKey="compare"
          description="actions.label_add_to"
          namespaceDescription="helpSave"
          tooltipText="loadTheBuildToDisplayScreen"
        />
        <HelpButtonDescription
          iconKey="magnify"
          description="actions.label_copy_to_finder"
          namespaceDescription="helpSave"
          tooltipText="loadTheStatsToSearchScreen"
        />
        <HelpButtonDescription
          iconKey="share"
          description="actions.label_export_set"
          namespaceDescription="helpSave"
          tooltipText="share"
        />
        <HelpButtonDescription
          iconKey="trash-can"
          description="actions.label_delete_set"
          namespaceDescription="helpSave"
          tooltipText="remove"
          namespaceTooltipText="button"
        />
      </HelpSection>
    </HelpModal>
  );
};

export default memo(HelpFavoritesScreen);
