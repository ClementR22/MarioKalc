import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BackHandler } from "react-native";

import Button from "@/primitiveComponents/Button";
import Text from "./Text";
import useThemeStore from "@/stores/useThemeStore";
import {
  BORDER_RADIUS_MODAL_CHILDREN_CONTAINER,
  MARGIN_HORIZONTAL_MODAL_CHILDREN_CONTAINER,
} from "@/utils/designTokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { ModalProvider } from "@/contexts/ModalContext";

export interface ModalButtonProps {
  text: string;
  onPress: () => void;
  tooltipText: string;
  isErrorStyle?: boolean;
}

const ModalButton = React.memo(({ text, onPress, tooltipText, isErrorStyle }: ModalButtonProps) => (
  <Button onPress={onPress} tooltipText={tooltipText} isErrorStyle={isErrorStyle}>
    {text}
  </Button>
));

interface ModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (v: boolean) => void;
  modalTitle: string;
  bottomButtonProps?: ModalButtonProps;
  withoutChildrenContainer?: boolean;
  horizontalScroll?: boolean;
  children: ReactNode;
  onClose?: () => void;
}

const Modal = ({
  isModalVisible,
  setIsModalVisible,
  modalTitle,
  bottomButtonProps,
  withoutChildrenContainer = false,
  horizontalScroll = false,
  children,
  onClose,
}: ModalProps) => {
  const theme = useThemeStore((state) => state.theme);

  const insets = useSafeAreaInsets();
  const bottomOffset = insets.bottom;

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const isClosingRef = useRef(false);

  useEffect(() => {
    if (isModalVisible) {
      bottomSheetModalRef.current?.present();
    }
  }, [isModalVisible]);

  const requestClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    // COMMIT métier AVANT fermeture
    onClose?.();

    // on ferme la modal
    bottomSheetModalRef.current?.dismiss();

    // Sync état React
    setIsModalVisible(false);
  }, [onClose, setIsModalVisible]);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} onPress={requestClose} />,
    [requestClose],
  );

  // Gérer le bouton retour Android
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isModalVisible) {
          requestClose();
          return true; // On bloque le back
        }
        return false; // On laisse le comportement par défaut
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => subscription.remove();
    }, [isModalVisible]),
  );

  // la fonction open est donnée par le store
  // la fonction close est donnée ici via le context
  const close = useCallback(() => {
    requestClose();
  }, [requestClose]);

  /* ---------------------------------------------------------------------- */
  /*                                   Render                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      backgroundStyle={{ backgroundColor: theme.surface_container_highest }}
      backdropComponent={renderBackdrop}
      onAnimate={(fromIndex, toIndex) => {
        // onAnimate est plus rapide que onChange
        if (fromIndex === 0 && toIndex === -1) {
          // la modal va se fermer
          requestClose();
        }
      }}
      onDismiss={() => {
        // cleanup SEULEMENT
        isClosingRef.current = false;
      }}
      activeOffsetY={horizontalScroll ? [-5, 5] : undefined}
      failOffsetX={horizontalScroll ? [-10, 10] : undefined}
    >
      <BottomSheetView style={{ paddingBottom: bottomOffset, gap: 10 }}>
        {modalTitle && (
          <Text role="headline" size="small" textAlign="center" style={styles.titleCenter} namespace="modal">
            {modalTitle}
          </Text>
        )}
        <View
          style={!withoutChildrenContainer && [styles.childrenContainer, { backgroundColor: theme.surface_container }]}
        >
          <ModalProvider close={close}>{children}</ModalProvider>
        </View>

        {bottomButtonProps && (
          <View style={styles.buttonContainer}>
            <ModalButton
              {...bottomButtonProps}
              onPress={() => {
                bottomButtonProps.onPress();
                requestClose();
              }}
            />
          </View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default React.memo(Modal);

/* -------------------------------------------------------------------------- */
/*                                    Styles                                  */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  childrenContainer: {
    marginHorizontal: MARGIN_HORIZONTAL_MODAL_CHILDREN_CONTAINER,
    borderRadius: BORDER_RADIUS_MODAL_CHILDREN_CONTAINER,
    overflow: "hidden",
  },
  titleCenter: {
    paddingHorizontal: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
