import { View } from "react-native";
import { Text } from "../injector";

export type ChatBubbleProps = {
  bot: boolean;
  content: string;
  diffs?: {
    added: string[];
    removed: string[];
  };
};

export function ChatBubble(props: ChatBubbleProps) {
  return (
    <View>
      <View
        className={`min-w-20 max-w-72 rounded-xl p-4 ${props.bot ? "bg-card" : "bg-primary"}`}
        style={{
          alignSelf: props.bot ? "flex-start" : "flex-end",
        }}
      >
        <Text>{props.content}</Text>
      </View>

      {props.diffs && (
        <View className="mt-2 flex flex-col gap-1">
          <Text className="text-primary text-sm italic">
            Travis applied the following changes:
          </Text>

          {props.diffs.added.map((field) => (
            <Text key={field} className="text-primary text-sm">
              + {field}
            </Text>
          ))}
          {props.diffs.removed.map((field) => (
            <Text key={field} className="text-primary text-sm">
              - {field}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
