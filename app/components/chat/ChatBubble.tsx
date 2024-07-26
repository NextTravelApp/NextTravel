import { View } from "react-native";
import { Text } from "../injector";

export type ChatBubbleProps = {
  bot: boolean;
  content: string;
};

export function ChatBubble(props: ChatBubbleProps) {
  return (
    <View
      className={`w-1/2 rounded-xl p-4 ${props.bot ? "bg-card" : "bg-primary"}`}
      style={{
        alignSelf: props.bot ? "flex-start" : "flex-end",
      }}
    >
      <Text>{props.content}</Text>
    </View>
  );
}
