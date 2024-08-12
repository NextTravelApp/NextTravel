import { useColorScheme, vars } from "nativewind";
import type { ReactNode } from "react";
import { View } from "react-native";

type Color = `#${string}`;

type Theme = {
  primary: Color;
  secondary: Color;
  text: Color;
  placeholders: Color;
  background: Color;
  card: Color;

  style: () => Record<string, string>;
};

function exportTheme(theme: Theme) {
  const keys = Object.keys(theme).filter(
    (key) => key !== "style" && key !== "colorScheme",
  );
  const values = Object.values(theme);

  return keys.reduce(
    (acc, key, index) => {
      const value = values[index];
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      acc[`--color-${cssKey}`] = value as string;
      return acc;
    },
    {} as Record<string, string>,
  );
}

export const lightTheme = {
  primary: "#66B3FF",
  secondary: "#E6F2FF",
  text: "#1E1E1E",
  placeholders: "#A0A0A0",
  background: "#ffffff",
  card: "#F2F2F2",

  style: function () {
    return vars(exportTheme(this));
  },
} satisfies Theme;

export const darkTheme = {
  primary: "#66B3FF",
  secondary: "#E6F2FF",
  text: "#F2F2F2",
  placeholders: "#A0A0A0",
  background: "#1E1E1E",
  card: "#2A2A2A",

  style: function () {
    return vars(exportTheme(this));
  },
} satisfies Theme;

export const useTheme = () => {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return {
    ...theme,
    colorScheme,
  };
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <View
      style={theme.style()}
      className="flex min-h-screen w-full flex-1 flex-col bg-background text-text"
    >
      {children}
    </View>
  );
}
