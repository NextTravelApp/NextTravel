import { Link } from "expo-router";
import { View } from "react-native";
import { i18n } from "../i18n";
import { Button, Text } from "../injector";

export function LimitScreen({
  back,
}: {
  back?: () => void;
}) {
  return (
    <View className="flex flex-1 flex-col items-center justify-center gap-3 bg-background text-center">
      <Text className="text-center font-extrabold text-4xl">
        {i18n.t("plan.limit.title")}
      </Text>
      <Text className="text-center text-xl">
        {i18n.t("plan.limit.description")}
      </Text>

      <View className="flex flex-row gap-3">
        <Link href="/premium" asChild>
          <Button mode="contained">{i18n.t("plan.limit.premium")}</Button>
        </Link>
        <Link href="/" asChild onPress={back}>
          <Button mode="contained" className="bg-card">
            <Text>{i18n.t("plan.back")}</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}
