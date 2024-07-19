import { Link } from "expo-router";
import { View } from "react-native";
import { i18n } from "../i18n";
import { Button, Text } from "../injector";

export function LimitScreen() {
  return (
    <View className="flex flex-1 flex-col items-center justify-center gap-3 bg-background text-center">
      <Text className="text-center font-extrabold text-4xl">
        {i18n.t("plan.limit.title")}
      </Text>
      <Text className="text-center text-xl">
        {i18n.t("plan.limit.description")}
      </Text>

      <Link href="/premium" asChild>
        <Button mode="contained">{i18n.t("plan.limit.premium")}</Button>
      </Link>
    </View>
  );
}
