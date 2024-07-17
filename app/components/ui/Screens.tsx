import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Text } from "../injector";

export function LoadingScreen() {
  return (
    <View className="min-h-screen w-full bg-background">
      <ActivityIndicator className="m-auto" size="large" />
    </View>
  );
}

export function ErrorScreen({
  error,
}: {
  error: string;
}) {
  return (
    <View className="flex flex-1 flex-col items-center justify-center gap-3 bg-background text-center">
      <Text className="text-center font-extrabold text-4xl">Oh no!</Text>
      <Text className="text-center text-xl">
        An error occurred.. Please try again later
      </Text>
      <Text className="text-center text-lg">{error}</Text>
    </View>
  );
}
