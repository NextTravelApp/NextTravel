import "react-native-reanimated";
import "../assets/global.css";

import { ThemeProvider, useTheme } from "@/components/Theme";
import { AuthProvider } from "@/components/auth/AuthContext";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { en, registerTranslation } from "react-native-paper-dates";

const queryClient = new QueryClient();
SplashScreen.preventAutoHideAsync();
registerTranslation("en", en);

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Geist: require("../assets/fonts/GeistVF.ttf"),
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
      <ThemeProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const theme = useTheme();

  return (
    <PaperProvider
      theme={{
        ...DefaultTheme,
        roundness: 1,
        colors: {
          ...DefaultTheme.colors,
          ...theme,
        },
        fonts: {
          ...DefaultTheme.fonts,
          default: {
            ...DefaultTheme.fonts.default,
            fontFamily: "Geist",
          },
        },
      }}
    >
      <Tabs
        screenOptions={() => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: theme.primary,
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
