import "react-native-reanimated";
import "../assets/global.css";

import { ThemeProvider, useTheme } from "@/components/Theme";
import { AuthProvider, useSession } from "@/components/auth/AuthContext";
import { FetcherProvider } from "@/components/fetcher";
import { getLocale } from "@/components/i18n/LocalesHandler";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Tabs, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import * as ReactNativePaperDates from "react-native-paper-dates";
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
            <FetcherProvider>
              <RootLayoutNav />
            </FetcherProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

function RootLayoutNav() {
  const theme = useTheme();
  const pathName = usePathname();
  const router = useRouter();
  const { isLoading, session } = useSession();
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

  useEffect(() => {
    if (
      pathName === "/login" ||
      pathName === "/register" ||
      pathName === "/reset" ||
      pathName === "/forgot" ||
      pathName === "/auth"
    )
      return;
    if (isLoading) return;

    if (!session) router.push("/auth");
  }, [session, isLoading, pathName, router]);

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
            <View className="relative h-full w-full bg-background" />
          ),
          tabBarStyle: {
            paddingTop: 10,
            paddingBottom: 0,
            borderWidth: 0,
            display:
              pathName === "/login" ||
              pathName === "/register" ||
              pathName === "/auth" ||
              pathName === "/reset" ||
              pathName === "/forgot" ||
              pathName.startsWith("/plan")
                ? "none"
                : "flex",
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
          name="history"
          options={{
            tabBarIcon: (props) => <FontAwesome name="list" {...props} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            tabBarIcon: (props) => <FontAwesome name="comments" {...props} />,
          }}
        />
        <Tabs.Screen
          name="bookmarks"
          options={{
            tabBarIcon: (props) => <FontAwesome name="bookmark" {...props} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: (props) => <FontAwesome name="gear" {...props} />,
          }}
        />
        <Tabs.Screen
          name="(auth)"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen name="plan" options={{ href: null }} />
      </Tabs>
    </PaperProvider>
  );
}

export default RootLayout;
