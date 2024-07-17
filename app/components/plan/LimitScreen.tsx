import { Alert, View } from "react-native";
import { Button, Text } from "../injector";

export function LimitScreen() {
  return (
    <View className="flex flex-1 flex-col items-center justify-center gap-3 bg-background text-center">
      <Text className="text-center font-extrabold text-4xl">Oh no!</Text>
      <Text className="text-center text-xl">
        You have reached your monthly limit. Buy a premium subscription to
        coontinue
      </Text>

      <Button
        mode="contained"
        onPress={() => Alert.alert("This feature is not available yet.")}
      >
        Buy Premium
      </Button>
    </View>
  );
}
