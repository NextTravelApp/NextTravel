import { View } from "react-native";
import { i18n } from "../i18n";
import { Text } from "../injector";
import { AnimatedLogo } from "../svg/Logo";

export function LoadingScreen() {
  return (
    <View className="min-h-screen w-full items-center justify-center bg-background">
      <AnimatedLogo />
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
      <Text className="text-center font-extrabold text-4xl">
        {i18n.t("errors.screen.title")}
      </Text>
      <Text className="text-center text-xl">
        {i18n.t("errors.screen.description")}
      </Text>
      <Text className="text-center text-lg">{i18n.t(`errors.${error}`)}</Text>
    </View>
  );
}
