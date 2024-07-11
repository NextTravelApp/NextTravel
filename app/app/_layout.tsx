import "react-native-reanimated";
import "../assets/global.css";

import { ThemeProvider, useTheme } from "@/components/Theme";
import { AuthProvider } from "@/components/auth/AuthContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

const queryClient = new QueryClient();
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Geist: require("../assets/fonts/GeistVF.ttf"),
    ...FontAwesome.font,
  });

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

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const theme = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Tabs
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarShowLabel: false,
              tabBarActiveTintColor: theme.primary,
              tabBarStyle: {
                display: route.name === "(auth)" ? "none" : "flex",
              },
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
                href: null,
              }}
            />
          </Tabs>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
