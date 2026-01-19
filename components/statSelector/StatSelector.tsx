// StatSelector.tsx
import React, { useMemo, useState, useCallback } from "react";
import { View } from "react-native";
import ButtonAndModal from "../modal/ButtonAndModal";
import DoubleEntryTable, { ColumnName, StatToggleMap } from "./DoubleEntryTable";
import useStatsStore from "@/stores/useStatsStore";
import { useResultStats } from "@/contexts/ResultStatsContext";
import { ChosenStat, ResultStat } from "@/types";
import useResultStatsDefaultStore from "@/stores/useResultStatsDefaultStore";
import useThemeStore from "@/stores/useThemeStore";
import ResultStatsSyncSwitch from "./ResultStatsSyncSwitch";
import { useScreen } from "@/contexts/ScreenContext";
import { useGameData } from "@/hooks/useGameData";
import useGameStore from "@/stores/useGameStore";
import { triggerConfig, modalTitleConfig } from "@/config/statSelectorConfig";

interface StatSelectorProps {
  children?: React.ReactNode;
}

const getColumnsConfig = (screenName: string): ColumnName[] =>
  screenName === "search" ? ["chosenStats", "resultStats"] : ["resultStats"];

const StatSelector: React.FC<StatSelectorProps> = ({ children }) => {
  const { statNames } = useGameData();
  const theme = useThemeStore((state) => state.theme);
  const screenName = useScreen();
  const game = useGameStore((state) => state.game);

  const chosenStats = useStatsStore((state) => state.chosenStats);
  const setChosenStats = useStatsStore((state) => state.setChosenStats);
  const { resultStats, setResultStats } = useResultStats();
  const { resultStatsDefault, setResultStatsDefaultForGame, isResultStatsSync } = useResultStatsDefaultStore();

  const columnNames = useMemo(() => getColumnsConfig(screenName), [screenName]);
  const { triggerComponent, modalTitle } = useMemo(() => {
    const triggerComponent = triggerConfig[screenName];
    const modalTitle = modalTitleConfig[screenName];
    return { triggerComponent, modalTitle };
  }, [screenName]);

  // Fusion de tous les stats dans un map par statName
  const [statMap, setStatMap] = useState<StatToggleMap>({});

  const [resultStatsBeforeSync, setResultStatsBeforeSync] = useState(resultStats);

  // on réinitialiser statNames à chaque ouverture de la modal
  const initStatMap = useCallback(() => {
    const map: StatToggleMap = {};
    statNames.forEach((name) => {
      map[name] = {
        chosenStats: chosenStats.find((s) => s.name === name)?.checked ?? false,
        resultStats:
          screenName === "settings"
            ? (resultStatsDefault[game].find((s) => s.name === name)?.checked ?? false)
            : (resultStats.find((s) => s.name === name)?.checked ?? false),
      };
    });

    setStatMap(map);
  }, [chosenStats, resultStats, resultStatsDefault, statNames, screenName]);

  const toggleStat = useCallback(
    (statName: string, columnName: ColumnName) => {
      setStatMap((prev) => {
        const current = prev[statName][columnName];
        const newChecked = !current;

        // keep at least one selected for chosenStats in search
        if (columnName === "chosenStats" && columnNames.includes("chosenStats") && !newChecked) {
          const othersChecked = Object.entries(prev)
            .filter(([key]) => key !== statName)
            .some(([, val]) => val.chosenStats);
          if (!othersChecked) return prev;
        }

        const updated: StatToggleMap = { ...prev, [statName]: { ...prev[statName], [columnName]: newChecked } };

        // sync chosenStats -> resultStats if needed
        if (isResultStatsSync && columnName === "chosenStats" && screenName === "search") {
          updated[statName].resultStats = newChecked;
        }

        return updated;
      });
    },
    [columnNames, isResultStatsSync, screenName],
  );

  const handleModalClose = useCallback(async () => {
    // Mise à jour des stores
    const chosenUpdated: ChosenStat[] = [];
    const resultUpdated: ResultStat[] = [];
    const resultDefaultUpdated: ResultStat[] = [];

    Object.entries(statMap).forEach(([name, vals], statIndex) => {
      if (columnNames.includes("chosenStats")) {
        const prev = chosenStats[statIndex];
        chosenUpdated.push({ ...prev, name, checked: vals.chosenStats } as ChosenStat);
      }

      if (columnNames.includes("resultStats")) {
        if (screenName === "settings") resultDefaultUpdated.push({ name, checked: vals.resultStats } as ResultStat);
        else resultUpdated.push({ name, checked: vals.resultStats } as ResultStat);
      }
    });

    if (columnNames.includes("chosenStats")) setChosenStats(chosenUpdated);
    if (screenName === "settings") await setResultStatsDefaultForGame(resultDefaultUpdated);
    else setResultStats(resultUpdated);
  }, [statMap, columnNames, screenName, setChosenStats, setResultStats, setResultStatsDefaultForGame]);

  return (
    <ButtonAndModal
      modalTitle={modalTitle}
      triggerComponent={triggerComponent}
      onOpen={initStatMap}
      onClose={handleModalClose}
    >
      <View style={{ backgroundColor: theme.surface, padding: 16, gap: 10 }}>
        {children}
        {screenName === "search" && statMap && (
          <ResultStatsSyncSwitch
            resultStats={Object.entries(statMap).map(
              ([name, val]) => ({ name, checked: val.resultStats }) as ResultStat,
            )}
            setResultStats={(newList) =>
              setStatMap((prev) => {
                const updated = { ...prev };
                newList.forEach((s) => {
                  if (updated[s.name]) updated[s.name].resultStats = s.checked;
                });
                return updated;
              })
            }
            resultStatsBeforeSync={resultStatsBeforeSync}
            setResultStatsBeforeSync={setResultStatsBeforeSync}
            chosenStats={Object.entries(statMap).map(
              ([name, val]) => ({ name, checked: val.chosenStats }) as ChosenStat,
            )}
          />
        )}
        <DoubleEntryTable
          statMap={statMap}
          columnNames={columnNames}
          onToggleStat={toggleStat}
          disabled={isResultStatsSync && screenName === "search"}
        />
      </View>
    </ButtonAndModal>
  );
};

export default React.memo(StatSelector);
