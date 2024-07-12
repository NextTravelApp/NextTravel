import { useTheme } from "@/components/Theme";
import { useSession } from "@/components/auth/AuthContext";
import { Redirect } from "expo-router";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function Account() {
  const theme = useTheme();
  const { session, isLoading } = useSession();

  if (isLoading) return <ActivityIndicator className="m-auto" size="large" />;

  if (!session && !isLoading) return <Redirect href="/login" />;

  return <View className="flex flex-1 flex-col bg-background" />;
}
