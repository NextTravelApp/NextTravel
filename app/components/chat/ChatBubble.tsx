import { Text } from "../injector";

export type ChatBubbleProps = {
  bot: boolean;
  content: string;
};

export function ChatBubble(props: ChatBubbleProps) {
  return (
    <Text
      className={`w-1/2 rounded-xl p-4 ${props.bot ? "bg-card" : "bg-primary"}`}
      style={{
        alignSelf: props.bot ? "flex-start" : "flex-end",
      }}
    >
      {props.content}
    </Text>
  );
}
