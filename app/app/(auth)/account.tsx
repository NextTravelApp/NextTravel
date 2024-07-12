import { useSession } from "@/components/auth/AuthContext";
import { useTheme } from "@/components/Theme";
import { View } from "@/components/ui/Themed";
import { Redirect } from "expo-router";
import { ActivityIndicator } from "react-native";

export default function Account() {
  const theme = useTheme();
  const { session, isLoading } = useSession();

  if (isLoading)
    return (
      <ActivityIndicator
        color={theme.primary}
        className="m-auto"
        size="large"
      />
    );

  if (!session && !isLoading) return <Redirect href="/login" />;

  return <View className="flex flex-1 flex-col bg-background" />;
}
