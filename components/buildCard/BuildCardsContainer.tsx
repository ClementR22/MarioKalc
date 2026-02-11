import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import BuildCard from "./BuildCard";
import useThemeStore from "@/stores/useThemeStore";
import useGeneralStore from "@/stores/useGeneralStore";
import { ScreenName, useScreen } from "@/contexts/ScreenContext";
import { Build } from "@/types";
import Placeholder from "./placeholder/Placeholder";
import { BORDER_RADIUS_CONTAINER_LOWEST, MARGIN_CONTAINER_LOWEST, PADDING_STANDARD } from "@/utils/designTokens";
import { box_shadow_z1 } from "../styles/shadow";
import PlaceholderBuildCard from "./placeholder/PlaceholderBuildCard";
import useBuildsListStore from "@/stores/useBuildsListStore";
import ButtonAddBuild from "../managingBuildsButton/ButtonAddBuild";
import { useScrollClamp } from "@/hooks/useScrollClamp";
import BuildCardSkeleton from "./skeleton/BuildCardSkeleton";
import { useLayout } from "@/contexts/LayoutContext";

interface BuildWithColor extends Build {
  color: string;
}

interface BuildCardsContainerProps {
  builds: BuildWithColor[] | Build[];
  isInLoadBuildModal?: boolean;
  screenNameFromProps?: ScreenName;
}

export interface BuildCardsContainerHandles {
  scrollToStart: () => void;
  scrollToEnd: () => void;
}

const BuildCardsContainer = forwardRef<BuildCardsContainerHandles, BuildCardsContainerProps>(
  ({ builds, isInLoadBuildModal = false, screenNameFromProps }, ref) => {
    const { appWidth } = useLayout();
    const theme = useThemeStore((state) => state.theme);
    const isScrollEnable = useGeneralStore((state) => state.isScrollEnable);
    const isLoading = useGeneralStore((state) => state.isLoading);
    const screenName = useScreen();
    const scrollRequest = useBuildsListStore((state) => state.scrollRequest);
    const clearScrollRequest = useBuildsListStore((state) => state.clearScrollRequest);
    const resultsNumber = useGeneralStore((state) => state.resultsNumber);

    const scrollViewRef = useRef<ScrollView>(null);
    const scrollClamp = useScrollClamp(scrollViewRef, "x");
    const buildCardLayouts = useRef<Map<string, { x: number; width: number }>>(new Map());
    const [hasShownSearchQuestionIcon, setHasShownSearchQuestionIcon] = useState(false);

    const noBuildToShow = builds.length === 0;
    const isDisplayScreen = screenName === "display";

    // ========== IMPERATIVE HANDLE ==========
    useImperativeHandle(
      ref,
      () => ({
        scrollToStart: () => scrollViewRef.current?.scrollTo({ x: 0, animated: true }),
        scrollToEnd: () => scrollViewRef.current?.scrollToEnd({ animated: true }),
      }),
      [],
    );

    // ========== CALLBACKS ==========
    // La logique d'availableColorsRef et son useEffect ont été déplacés dans DisplayBuildScreen
    const onBuildCardLayout = useCallback((id: string, event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout;
      buildCardLayouts.current.set(id, { x, width });
    }, []);

    const scrollToBuildCard = useCallback(
      (id: string) => {
        const layout = buildCardLayouts.current.get(id);
        if (scrollViewRef.current && layout) {
          const scrollX = layout.x - appWidth / 2 + layout.width / 2;
          scrollViewRef.current.scrollTo({ x: scrollX, animated: true });
        }
      },
      [appWidth],
    );

    // ========== EFFECTS ==========
    useEffect(() => {
      if (!scrollRequest || scrollRequest.source !== screenName) return;
      scrollToBuildCard(scrollRequest.buildDataId);
      clearScrollRequest();
    }, [scrollRequest, screenName, scrollToBuildCard, clearScrollRequest]);

    useEffect(() => {
      if (!noBuildToShow && !hasShownSearchQuestionIcon) {
        setHasShownSearchQuestionIcon(true);
      }
    }, [noBuildToShow, hasShownSearchQuestionIcon]);

    // ========== MEMOIZED CONTENT ==========
    const placeholder = useMemo(() => {
      if (!noBuildToShow) return null;

      if (screenName === "search") {
        return <Placeholder text={hasShownSearchQuestionIcon ? "searchNotFound" : "searchEmpty"} />;
      }
      if (isDisplayScreen) {
        return <PlaceholderBuildCard />;
      }
      return <Placeholder text="savedEmpty" />;
    }, [noBuildToShow, screenName, isDisplayScreen, hasShownSearchQuestionIcon]);

    const buildCardSkeletons = useMemo(
      () => Array.from({ length: resultsNumber }).map((_, index) => <BuildCardSkeleton key={index} />),
      [resultsNumber],
    );

    const buildCards = useMemo(() => {
      if (noBuildToShow) return null;

      const cards = builds.map((build: BuildWithColor) => (
        <BuildCard
          key={build.buildDataId}
          buildDataId={build.buildDataId}
          isInLoadBuildModal={isInLoadBuildModal}
          screenNameFromProps={screenNameFromProps}
          percentage={build.percentage ?? undefined}
          onLayout={(event) => onBuildCardLayout(build.buildDataId, event)}
          borderColor={build.color}
        />
      ));

      if (isDisplayScreen) {
        cards.push(
          <View key="buttonAddBuildWrapper" style={styles.addBuildWrapper}>
            <ButtonAddBuild scrollRef={scrollViewRef} />
          </View>,
        );
      }

      return cards;
    }, [builds, noBuildToShow, isDisplayScreen, isInLoadBuildModal, screenNameFromProps, onBuildCardLayout]);

    // ========== RENDER ==========
    return (
      <ScrollView
        ref={scrollViewRef}
        horizontal
        {...scrollClamp}
        scrollEventThrottle={16}
        scrollEnabled={isScrollEnable}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainerStyle]}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.surface_container,
              width: noBuildToShow ? appWidth - MARGIN_CONTAINER_LOWEST * 2 : undefined,
            },
          ]}
        >
          {isLoading ? buildCardSkeletons : noBuildToShow ? placeholder : buildCards}
        </View>
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  contentContainerStyle: {
    minWidth: "100%",
  },
  container: {
    flex: 1,
    marginHorizontal: MARGIN_CONTAINER_LOWEST,
    flexDirection: "row",
    padding: PADDING_STANDARD,
    gap: PADDING_STANDARD / 1.5,
    borderRadius: BORDER_RADIUS_CONTAINER_LOWEST,
    boxShadow: box_shadow_z1,
    marginBottom: 2, // pour que l'ombre soit visible
  },
  addBuildWrapper: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});

BuildCardsContainer.displayName = "BuildCardsContainer";

export default memo(BuildCardsContainer);
