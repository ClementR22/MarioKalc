import {
  BORDER_RADIUS_STANDARD,
  buttonPressed,
  ELEMENT_LONG_IMAGE_RATIO,
  ELEMENT_LONG_IMAGE_SIZE,
  LIST_ITEM_SPACING,
} from "@/utils/designTokens";
import React, { memo } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { box_shadow_z1 } from "../styles/shadow";
import Text from "@/primitiveComponents/Text";
import { elementsNamespaceByGame } from "@/translations/namespaces";
import useGameStore from "@/stores/useGameStore";

interface ElementLongProps {
  name: string;
  imageUrl: ReturnType<typeof require>;
  onPress: () => void;
  isSelected: boolean;
  isCollapsed: boolean;
  style: any;
}

const ElementLong: React.FC<ElementLongProps> = ({ name, imageUrl, onPress, isCollapsed, style }) => {
  const game = useGameStore((state) => state.game);

  return (
    <Pressable
      style={({ pressed }) => [styles.container, style.containerDynamic, pressed && buttonPressed]}
      onPress={onPress}
    >
      <View style={styles.imagePlaceholder}>
        {/* Placeholder background */}
        <Image style={styles.image} source={imageUrl} resizeMode="contain" />
      </View>
      {!isCollapsed && (
        <Text
          key={`${name}-${game}`} // force le re-render pour refresh t la fonction de traduction
          role="title"
          size="small"
          color={style.textColorDynamic}
          numberOfLines={1}
          style={{ marginLeft: 12 }}
          namespace={elementsNamespaceByGame[game]}
        >
          {name}
        </Text>
      )}
    </Pressable>
  );
};

ElementLong.displayName = "ElementLong";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: LIST_ITEM_SPACING / 2, // Half spacing for vertical rhythm
    borderRadius: BORDER_RADIUS_STANDARD, // Medium rounded corners
    boxShadow: box_shadow_z1,
    overflow: "hidden", // Ensures shadow works nicely
  },
  imagePlaceholder: {
    width: ELEMENT_LONG_IMAGE_SIZE, // Slightly larger image placeholder
    height: ELEMENT_LONG_IMAGE_SIZE * ELEMENT_LONG_IMAGE_RATIO,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    width: "90%",
  },
});

export default memo(ElementLong);
