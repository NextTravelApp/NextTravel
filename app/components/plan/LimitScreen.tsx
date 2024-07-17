import { Alert, View } from "react-native";
import { Button, Text } from "../injector";

export function LimitScreen() {
  return (
    <View className="flex flex-1 flex-col items-center justify-center gap-3 bg-background text-center">
      <Text
        style={{
          fontSize: 40,
        }}
        className="text-center font-extrabold"
      >
        Oh no!
      </Text>
      <Text
        style={{
          fontSize: 20,
        }}
        className="text-center"
      >
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
