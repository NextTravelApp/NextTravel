import { useSession } from "@/components/auth/AuthContext";
import { useTheme } from "@/components/Theme";
import { View } from "@/components/ui/Themed";
import { Redirect } from "expo-router";
import { ActivityIndicator } from "react-native";

export default function Account() {
  const theme = useTheme();
  const { session, isLoading } = useSession();

  if (isLoading || true) return <ActivityIndicator color={theme.primary} />;
  if (!session && !isLoading)
    return <View className="flex flex-1 flex-col bg-background" />;

  return <View className="flex flex-1 flex-col bg-background" />;
}
