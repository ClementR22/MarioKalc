import Text from "@/primitiveComponents/Text";
import useGeneralStore from "@/stores/useGeneralStore";
import useThemeStore from "@/stores/useThemeStore";
import { buttonPressed, CORNER_SMALL } from "@/utils/designTokens";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { Menu, MenuOptions, MenuTrigger, renderers } from "react-native-popup-menu";

interface TooltipProps {
  tooltipText: string;
  namespace?: string;
  onPress?: () => void;
  onClose?: () => void;
  childStyleInner?: ViewStyle | ViewStyle[];
  childStyleOuter?: ViewStyle | ViewStyle[];
  placement?: "top" | "right" | "bottom" | "left" | "auto";
  onPressDisabled?: boolean;
  top?: number;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({
  tooltipText,
  namespace,
  onPress = null,
  onClose,
  childStyleInner,
  childStyleOuter,
  placement = "top",
  onPressDisabled = false,
  top = 0,
  children,
}) => {
  const theme = useThemeStore((state) => state.theme);
  const setIsScrollEnable = useGeneralStore((state) => state.setIsScrollEnable);

  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback(() => {
    onClose && onClose();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(false);
    setIsScrollEnable(true);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    setIsScrollEnable(false);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(close, 2000);
  }, [close]);

  useEffect(() => {
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  return (
    <Menu
      opened={isOpen}
      renderer={renderers.Popover}
      rendererProps={{ placement, anchorStyle: styles.anchor }}
      style={childStyleOuter}
    >
      <MenuTrigger>
        <Pressable
          onLongPress={open}
          onPress={onPressDisabled ? undefined : onPress}
          style={({ pressed }) => [childStyleInner, pressed && buttonPressed]} // childStyleInner
        >
          {children}
        </Pressable>
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: [styles.optionsContainer, { top }],
          optionsWrapper: { backgroundColor: theme.inverse_surface },
        }}
      >
        <Text
          role="title"
          size="small"
          style={[
            styles.content,
            {
              backgroundColor: theme.inverse_surface,
              color: theme.inverse_on_surface,
            },
          ]}
          namespace={namespace || "tooltip"}
        >
          {tooltipText}
        </Text>
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  optionsContainer: { borderRadius: CORNER_SMALL, overflow: "hidden" },
  content: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  anchor: { backgroundColor: "transparent" },
});

export default React.memo(Tooltip);
