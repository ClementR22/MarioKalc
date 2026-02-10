import React from "react";
import Picker, { PickerItem } from "../Picker";
import useGameStore from "@/stores/useGameStore";
import { Game } from "@/types";

const gameList: PickerItem<Game>[] = [
  { label: "MarioKart8Deluxe", value: "MK8D" },
  { label: "MarioKartWorld", value: "MKW" },
];

const GameSelector = () => {
  const game = useGameStore((state) => state.game);
  const setGame = useGameStore((state) => state.setGame);

  return <Picker value={game} setValue={setGame} itemList={gameList} pickerTitle="game" namespace="game" />;
};

export default React.memo(GameSelector);
