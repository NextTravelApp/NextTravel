import "react-native-reanimated";
import "../assets/global.css";

import { ThemeProvider, useTheme } from "@/components/Theme";
import { AuthProvider } from "@/components/auth/AuthContext";
import { getLocale } from "@/components/i18n/LocalesHandler";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import ReactNativePaperDates from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();
SplashScreen.preventAutoHideAsync();
ReactNativePaperDates.registerTranslation("en", ReactNativePaperDates.en);

const RootLayout = () => {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  useReactQueryDevTools(queryClient);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <RootLayoutNav />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

function RootLayoutNav() {
  const theme = useTheme();
  const DefaultTheme =
    theme.colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;

  useEffect(() => {
    const code = getLocale();

    if (code !== "en" && code in ReactNativePaperDates) {
      const translation = ReactNativePaperDates[
        code as keyof typeof ReactNativePaperDates
      ] as ReactNativePaperDates.TranslationsType;

      ReactNativePaperDates.registerTranslation(code, translation);
    }
  }, []);

  return (
    <PaperProvider
      theme={{
        ...DefaultTheme,
        roundness: 3,
        colors: {
          ...DefaultTheme.colors,
          ...theme,
          surface: theme.card,
          onSurfaceVariant: theme.placeholders,
          onSurface: theme.text,
        },
        fonts: {
          ...DefaultTheme.fonts,
          default: {
            ...DefaultTheme.fonts.default,
          },
        },
      }}
    >
      <Tabs
        screenOptions={() => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: theme.primary,
          tabBarBackground: () => (
            <View className="h-full w-full bg-background" />
          ),
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: (props) => <FontAwesome name="home" {...props} />,
          }}
        />
        <Tabs.Screen
          name="(auth)"
          options={{
            tabBarIcon: (props) => (
              <FontAwesome name="user-circle-o" {...props} />
            ),
          }}
        />
        <Tabs.Screen name="plan" options={{ href: null }} />
      </Tabs>
    </PaperProvider>
  );
}

export default RootLayout;
