import React, { createContext, useContext, ReactNode } from "react";
import { useColorScheme } from "react-native";

const lightTheme = {
  scheme: "light",
  backgroundPrimary: "#EBEBEB",
  backgroundSecondary: "#dbdbdbff",
  text: "#111111",
  accent: "#5865F2",
  accentPressed: "#5057E9",
  surface: "#FAFAFA",
};

const darkTheme = {
  scheme: "dark",
  backgroundPrimary: "#282b30",
  backgroundSecondary: "#525963ff",
  text: "#EDEDED",
  accent: "#6670e2ff",
  accentPressed: "#5a61e9ff",
  surface: "#33363bff",
};

type Theme = typeof lightTheme;

interface ThemeContextProps {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: lightTheme,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme: Theme = useColorScheme() === "dark" ? darkTheme : lightTheme;

  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
