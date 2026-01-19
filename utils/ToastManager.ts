/**
 * Gestionnaire de toasts simplifié pour react-native-toast-message
 */

import Toast from "react-native-toast-message";

export type ToastType = "success" | "error" | "importError" | "info";
export type VisibilityTime = 2000 | 3000 | 4000;
class ToastManager {
  constructor() {
    this.show = this.show.bind(this);
  }

  show(text1: string, visibilityTime?: VisibilityTime, isError?: boolean): void {
    // Masquer le toast actuel avant d'en afficher un nouveau
    Toast.hide();

    // Petit délai pour permettre l'animation de fermeture
    setTimeout(() => {
      Toast.show({
        type: isError ? "error" : "info",
        text1,
        position: "bottom",
        visibilityTime: visibilityTime || 2000,
      });
    }, 100);
  }
}

export default new ToastManager();
