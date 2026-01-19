import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import ButtonMultiStateToggle from "../ButtonMultiStateToggle";
import { Slider } from "@miblanchard/react-native-slider";
import useGeneralStore from "@/stores/useGeneralStore";
import useStatsStore from "@/stores/useStatsStore";
import { getStatSliderBorderColor } from "@/utils/getStatSliderBorderColor";
import useThemeStore from "@/stores/useThemeStore";
import { StatName } from "@/types";
import { BORDER_RADIUS_INF, BORDER_RADIUS_STAT_GAUGE_CONTAINER, BUTTON_SIZE } from "@/utils/designTokens";
import { box_shadow_z1 } from "../styles/shadow";
import Text from "@/primitiveComponents/Text";
import useGameStore from "@/stores/useGameStore";
import { statsNamespaceByGame } from "@/translations/namespaces";
import { useGameData } from "@/hooks/useGameData";

interface StatSliderContentProps {
  name: StatName;
  value: number;
  statFilterNumber: number;
  setStatFilterNumber: (num: number) => void;
  // setValuePreview n'est donnée quand dans help (donc il joue aussi le rôle de "disabled")
  setValuePreview?: React.Dispatch<React.SetStateAction<number>>;
  onPress?: () => void;
}

const StatSliderContent = ({
  name,
  value,
  statFilterNumber,
  setStatFilterNumber,
  setValuePreview,
  onPress = () => {},
}: StatSliderContentProps) => {
  const game = useGameStore((state) => state.game);
  const theme = useThemeStore((state) => state.theme);
  const { MAX_STAT_VALUE_BUILD, STEP } = useGameData();

  const setIsScrollEnable = useGeneralStore((state) => state.setIsScrollEnable);
  const updateStatValue = useStatsStore((state) => state.updateStatValue);
  const [tempValue, setTempValue] = useState(value);

  // Mémoïsation stricte des handlers
  const onValueChange = useCallback(([v]: [number]) => setTempValue(Math.round(v * 100) / 100), []);

  const onSlidingStart = useCallback(() => {
    setIsScrollEnable(false);
  }, [setIsScrollEnable]);

  const onSlidingComplete = useCallback(
    ([v]: [number]) => {
      v = Math.round(v * 100) / 100;
      if (setValuePreview) {
        setValuePreview(v);
      } else {
        if (v !== value) {
          updateStatValue(name, v);
        }
      }
      setIsScrollEnable(true);
    },
    [updateStatValue, name, setIsScrollEnable, value],
  );

  useEffect(() => {
    if (value !== tempValue) {
      setTempValue(value);
    }
  }, [value]);

  // Styles dynamiques pour le thumb du slider
  const renderCustomThumb = useCallback(
    () => (
      <View style={[styles.thumbWrapper, { backgroundColor: theme.surface }]}>
        <View style={[styles.thumb, { backgroundColor: theme.primary }]} />
      </View>
    ),
    [styles, theme],
  );

  return (
    <Pressable
      style={StyleSheet.flatten([
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: getStatSliderBorderColor(statFilterNumber, theme),
        },
      ])}
      onPress={onPress}
    >
      <View style={styles.containerLeft}>
        <View style={styles.textWrapper}>
          <Text
            role="title"
            size="medium"
            numberOfLines={1}
            ellipsizeMode="tail"
            namespace={statsNamespaceByGame[game]}
          >
            {name}
          </Text>
          <Text role="title" size="medium" style={styles.separatorText} namespace="text">
            colon
          </Text>
        </View>

        <Slider
          containerStyle={styles.sliderContainer}
          value={tempValue}
          onValueChange={onValueChange}
          onSlidingStart={onSlidingStart}
          onSlidingComplete={onSlidingComplete}
          minimumValue={0}
          maximumValue={MAX_STAT_VALUE_BUILD}
          step={STEP}
          trackStyle={styles.track}
          renderThumbComponent={renderCustomThumb}
          minimumTrackStyle={{ backgroundColor: theme.primary }}
          maximumTrackStyle={{ backgroundColor: theme.surface_variant }}
        />
      </View>
      <View style={styles.containerRight}>
        <View style={styles.valueWrapper}>
          <Text role="title" size="medium" namespace="not">
            {tempValue}
          </Text>
        </View>

        <View style={styles.buttonWrapper}>
          <ButtonMultiStateToggle
            number={statFilterNumber}
            setNumber={setStatFilterNumber}
            tooltipText="changeCondition"
          />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 2,
    borderRadius: BORDER_RADIUS_STAT_GAUGE_CONTAINER,
    flexDirection: "row",
    paddingTop: 3,
    paddingHorizontal: 13,
    gap: 13,
    boxShadow: box_shadow_z1,
  },
  containerLeft: { flex: 1, justifyContent: "flex-start" },
  containerRight: { alignItems: "center", justifyContent: "flex-start", width: 46 },
  textWrapper: {
    flexDirection: "row",
    marginLeft: 3,
    paddingTop: 2,
  },
  sliderContainer: {
    marginBottom: 4,
  },
  valueWrapper: {
    width: BUTTON_SIZE,
    alignItems: "flex-start",
    paddingTop: 2,
  },
  buttonWrapper: { position: "absolute", bottom: 8 },
  track: {
    height: 16,
    borderRadius: BORDER_RADIUS_INF,
  },
  thumbWrapper: {
    width: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  thumb: {
    width: 4,
    height: 36,
    borderRadius: BORDER_RADIUS_INF,
  },
  separatorText: {
    marginRight: 2,
  },
});

export default React.memo(StatSliderContent);
