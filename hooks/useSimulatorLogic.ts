import { useCallback, useRef, useState } from "react";
import { Platform } from "react-native";

const DEFAULT_RATIO = 9 / 16;
const MIN_WIDTH = 280;
const MIN_HEIGHT = 400;

export const useSimulatorLogic = (windowWidth: number, windowHeight: number) => {
  const [isForceFullScreen, setIsForceFullScreen] = useState(false);
  const [dims, setDims] = useState({
    width: windowHeight * DEFAULT_RATIO,
    height: windowHeight,
  });

  const isResizing = useRef(null);
  const frameId = useRef(null); // Pour annuler l'animation si besoin

  const startResize = useCallback(
    (type: string) => (e) => {
      if (Platform.OS !== "web") return;
      e.preventDefault();
      isResizing.current = type;

      const cursor = type === "wh" ? "nwse-resize" : type === "w" ? "ew-resize" : "ns-resize";
      document.body.style.cursor = cursor;
    },
    [],
  );

  const stopResize = useCallback(() => {
    if (!isResizing.current) return;
    isResizing.current = null;
    if (Platform.OS === "web") {
      document.body.style.cursor = "default";
    }
    if (frameId.current) {
      cancelAnimationFrame(frameId.current);
    }
  }, []);

  const onPointerMove = useCallback(
    (e) => {
      if (!isResizing.current) return;

      // Optimisation : On planifie la mise à jour pour la prochaine frame
      if (frameId.current) cancelAnimationFrame(frameId.current);

      frameId.current = requestAnimationFrame(() => {
        setDims((prev) => {
          let newWidth = prev.width;
          let newHeight = prev.height;
          const type = isResizing.current;

          if (!type) return prev;

          if (type.includes("w")) {
            const containerLeft = (windowWidth - prev.width) / 2;
            // e.clientX est la position absolue de la souris
            newWidth = Math.max(MIN_WIDTH, Math.min(windowWidth - 40, e.clientX - containerLeft));
          }

          if (type.includes("h")) {
            const containerTop = (windowHeight - prev.height) / 2;
            newHeight = Math.max(MIN_HEIGHT, Math.min(windowHeight - 40, e.clientY - containerTop));
          }

          // On évite un re-render si les valeurs n'ont pas bougé (après arrondi)
          if (Math.round(newWidth) === Math.round(prev.width) && Math.round(newHeight) === Math.round(prev.height)) {
            return prev;
          }

          return { width: newWidth, height: newHeight };
        });
      });
    },
    [windowWidth, windowHeight],
  );

  return {
    dims,
    setDims,
    isForceFullScreen,
    setIsForceFullScreen,
    startResize,
    stopResize,
    onPointerMove,
  };
};
