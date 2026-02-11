// LayoutContext.tsx
import { createContext, useContext, useMemo } from "react";

export type Layout = {
  appWidth: number;
  appHeight: number;
  appScale: number;
};

const LayoutContext = createContext<Layout>({
  appWidth: 390,
  appHeight: 844,
  appScale: 1,
});

interface LayoutProviderProps {
  width: number;
  height: number;
  scale: number;
  children: React.ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ width, height, scale, children }) => {
  const contextValue = useMemo<Layout>(
    () => ({
      appWidth: width,
      appHeight: height,
      appScale: scale,
    }),
    [width, height, scale],
  );

  return <LayoutContext.Provider value={contextValue}>{children}</LayoutContext.Provider>;
};

export const useLayout = () => useContext(LayoutContext);
