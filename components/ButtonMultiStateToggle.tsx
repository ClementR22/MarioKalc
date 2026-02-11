import React, { useCallback } from "react";
import ButtonIcon from "@/primitiveComponents/ButtonIcon";
import { IconKey } from "@/constants/Icons";

interface ButtonMultiStateToggleProps {
  number: number;
  setNumber: (newNumber: number) => void;
  tooltipText: string;
}

const statFilterIconsNames: IconKey[] = ["approximately-equal", "greater-than-or-equal", "equal"];

const ButtonMultiStateToggle: React.FC<ButtonMultiStateToggleProps> = ({ number, setNumber, tooltipText }) => {
  const currentIconsNames = statFilterIconsNames;

  const handlePress = useCallback(() => {
    const newNumber = (number + 1) % currentIconsNames.length;
    setNumber(newNumber);
  }, [number, currentIconsNames, setNumber]);

  return (
    <ButtonIcon
      tooltipText={tooltipText}
      iconProps={{ iconKey: currentIconsNames[number] }}
      onPress={handlePress}
      shape="rectangle"
    />
  );
};

export default React.memo(ButtonMultiStateToggle);
