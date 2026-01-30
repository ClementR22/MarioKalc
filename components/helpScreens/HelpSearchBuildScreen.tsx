import React, { memo, useState } from "react";
import { View } from "react-native";
import HelpModal from "./HelpModal";
import StatSliderPreview from "../statSlider/StatSliderPreview";
import { WIDTH_BUILD_CARD } from "@/utils/designTokens";
import Button from "@/primitiveComponents/Button";
import HelpButtonDescription from "../helpComponents/HelpButtonDescription";
import StatGaugeContainer from "../statGauge/StatGaugeContainer";
import StatGaugeBarBuildCard from "../statGauge/StatGaugeBarBuildCard";
import Text from "@/primitiveComponents/Text";
import HelpStepItem from "../helpComponents/HelpStepItem";
import HelpSection from "../helpComponents/HelpSection";
import HelpHighlightBox from "../helpComponents/HelpHighlightBox";
import { useBuildCardStyle } from "@/hooks/useBuildCardStyle";
import { useGameData } from "@/hooks/useGameData";
import StatGaugeBar from "../statGauge/StatGaugeBar";

const HelpSearchBuildScreen = () => {
  const { MAX_STAT_VALUE_BUILD } = useGameData();
  const obtainedValue = MAX_STAT_VALUE_BUILD * 0.5;

  const [chosenStat, setChosenStat] = useState(MAX_STAT_VALUE_BUILD * 0.75);
  const [isCompact, setIsCompact] = useState(false);
  const toggleSlider = () => setIsCompact(!isCompact);

  const [statFilterNumber, setStatFilterNumber] = useState(0);

  const { buildCardStyle } = useBuildCardStyle(WIDTH_BUILD_CARD);

  return (
    <HelpModal title="guideBuildFinder">
      {/* Intro */}
      <Text role="body" size="large" textAlign="center" namespace="not">
        <Text role="body" size="large" weight="bold" namespace="helpSearch">
          intro.pick_stats
        </Text>
        <Text role="body" size="large" namespace="helpSearch">
          intro.find_sets
        </Text>
      </Text>

      {/* Section 1 — How to use */}
      <HelpSection title="how_to_use.title" namespace="helpSearch" contentType="step">
        <HelpStepItem key={1} stepChar="1" title="how_to_use.step.choose_criteria" namespace="helpSearch">
          <HelpButtonDescription
            iconKey="checkbox-multiple-marked"
            description="how_to_use.step.choose_criteria.add_stat"
            namespaceDescription="helpSearch"
            tooltipText="desiredStatsAndStatsInBuilds"
          />
        </HelpStepItem>

        <HelpStepItem key={2} stepChar="2" title="how_to_use.step.adjust_values" namespace="helpSearch">
          {isCompact ? (
            <StatGaugeContainer name="acceleration" value={chosenStat} onPress={toggleSlider}>
              <StatGaugeBar value={chosenStat} statFilterNumber={statFilterNumber} />
            </StatGaugeContainer>
          ) : (
            <StatSliderPreview
              name="acceleration"
              value={chosenStat}
              setValue={setChosenStat}
              onPress={toggleSlider}
              statFilterNumber={statFilterNumber}
              setStatFilterNumber={setStatFilterNumber}
            />
          )}
          <Text role="body" size="large" fontStyle="italic" namespace="not">
            {"≈"}
            <Text role="body" size="large" namespace="text">
              colon
            </Text>
            <Text role="body" size="large" namespace="helpSearch">
              value_type.approximate
            </Text>
            {"\n"}
            {"="}
            <Text role="body" size="large" namespace="text">
              colon
            </Text>
            <Text role="body" size="large" namespace="helpSearch">
              value_type.exact
            </Text>
            {"\n"}
            {"≥"}
            <Text role="body" size="large" namespace="text">
              colon
            </Text>
            <Text role="body" size="large" namespace="helpSearch">
              value_type.minimum
            </Text>
          </Text>
          <Text role="body" size="large" fontStyle="italic" namespace="helpSearch">
            how_to_use.step.adjust_values.tap_to_reduce
          </Text>
        </HelpStepItem>

        <HelpStepItem
          key={3}
          stepChar="3"
          title="how_to_use.step.start_search"
          namespace="helpSearch"
          alignItems="center"
        >
          <Button onPress={null} tooltipText="search" iconKey="magnify">
            search
          </Button>
        </HelpStepItem>

        <HelpStepItem
          key={4}
          stepChar="4"
          title="how_to_use.step.review_results"
          alignItems="center"
          namespace="helpSearch"
        >
          <Text role="body" size="large" namespace="helpSearch">
            how_to_use.step.review_results.ranked_by_score
          </Text>
          <View style={buildCardStyle}>
            <StatGaugeContainer name="acceleration" value={obtainedValue} chosenValue={chosenStat} isInBuildCard={true}>
              <StatGaugeBarBuildCard obtainedValue={obtainedValue} chosenValue={chosenStat} isInSearchScreen={true} />
            </StatGaugeContainer>
          </View>
          <Text role="body" size="large" fontStyle="italic" namespace="helpSearch">
            how_to_use.step.review_results.tap_to_view_gap
          </Text>
        </HelpStepItem>
      </HelpSection>

      {/* Section 2 — Advanced options */}
      <HelpSection title="advanced_options.title" namespace="helpSearch" contentType="step">
        <HelpStepItem key="A" stepChar="A" title="advanced_options.step.customize_display" namespace="helpSearch">
          <HelpButtonDescription
            iconKey="checkbox-multiple-marked"
            description="advanced_options.step.customize_display.choose_stats_to_show"
            namespaceDescription="helpSearch"
            tooltipText="desiredStatsAndStatsInBuilds"
          />
        </HelpStepItem>

        <HelpStepItem key="B" stepChar="B" title="advanced_options.step.filters" namespace="helpSearch">
          <HelpButtonDescription
            iconKey="filter"
            description="advanced_options.step.filters.lock_item"
            namespaceDescription="helpSearch"
            tooltipText="chooseFilters"
          />
        </HelpStepItem>

        <HelpStepItem key="C" stepChar="C" title="advanced_options.step.reuse_stats" namespace="helpSearch">
          <HelpButtonDescription
            iconKey="cards-outline"
            description="advanced_options.step.reuse_stats.open_collection"
            namespaceDescription="helpSearch"
            tooltipText="loadStatsOfABuild"
          />
          <HelpButtonDescription
            iconKey="check"
            description="advanced_options.step.reuse_stats.import_variations"
            namespaceDescription="helpSearch"
            tooltipText="loadTheStats"
          />
        </HelpStepItem>
      </HelpSection>

      {/* Section 3 — Results management */}
      <HelpSection title="results_management.title" namespace="helpSearch" contentType="button">
        <HelpButtonDescription
          iconKey="content-save-outline"
          description="results_management.save_to_collection"
          namespaceDescription="helpSearch"
          tooltipText="save"
        />
        <HelpButtonDescription
          iconKey="compare"
          description="results_management.add_to"
          namespaceDescription="helpSearch"
          tooltipText="loadTheBuildToDisplayScreen"
        />
        <HelpButtonDescription
          iconKey="share"
          description="results_management.export_set"
          namespaceDescription="helpSearch"
          tooltipText="share"
        />
      </HelpSection>

      {/* Tips */}
      <HelpHighlightBox type="tips" title="tips.title" namespace="helpSearch">
        {["tips.start_with_key_stats", "tips.tooltip"]}
      </HelpHighlightBox>
    </HelpModal>
  );
};

export default memo(HelpSearchBuildScreen);
