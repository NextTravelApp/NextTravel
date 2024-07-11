import { useColorScheme, vars } from "nativewind";
import type { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type Color = `#${string}`;

type Theme = {
  primary: Color;
  secondary: Color;
  text: Color;
  background: Color;
  card: Color;

  style: () => Record<string, string>;
};

function exportTheme(theme: Theme) {
  const keys = Object.keys(theme).filter((key) => key !== "style");
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
  background: "#ffffff",
  card: "#F2F2F2",

  style: function () {
    return vars(exportTheme(this));
  },
} satisfies Theme;

// todo: code a dark theme
export const darkTheme = lightTheme;

export const useTheme = () => {
  const { colorScheme } = useColorScheme();
  return colorScheme === "dark" ? darkTheme : lightTheme;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={theme.style()}
      className="flex min-h-screen flex-col bg-background text-text"
    >
      {children}
    </SafeAreaView>
  );
}
