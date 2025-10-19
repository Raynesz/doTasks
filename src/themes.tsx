import React, { createContext, useContext, ReactNode } from "react";
import { useColorScheme } from "react-native";

const lightTheme = {
  scheme: "light",
  background: "#EBEBEB",
  text: "#111111",
  accent: "#5865F2",
  accentPressed: "#5057E9",
  surface: "#FAFAFA",
  dividers: "#2C2C2C",
};

const darkTheme = {
  scheme: "dark",
  background: "#282b30",
  text: "#EDEDED",
  accent: "#6670e2ff",
  accentPressed: "#5a61e9ff",
  surface: "#40444B",
  dividers: "#2C2C2C",
};

type Theme = typeof lightTheme;

interface ThemeContextProps {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: lightTheme,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme();
  const theme: Theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
