// LayoutContext.tsx
import { createContext, useContext, useMemo } from "react";

export type Layout = {
  appWidth: number;
  appHeight: number;
};

const LayoutContext = createContext<Layout>({
  appWidth: 390,
  appHeight: 844,
});

interface LayoutProviderProps {
  width: number;
  height: number;
  children: React.ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ width, height, children }) => {
  const contextValue = useMemo<Layout>(
    () => ({
      appWidth: width,
      appHeight: height,
    }),
    [width, height],
  );

  return <LayoutContext.Provider value={contextValue}>{children}</LayoutContext.Provider>;
};

export const useLayout = () => useContext(LayoutContext);
