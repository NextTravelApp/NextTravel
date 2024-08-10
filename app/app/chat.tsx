import { useSession } from "@/components/auth/AuthContext";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { honoClient } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { SafeAreaView, Text, TextInput } from "@/components/injector";
import { LoadingScreen } from "@/components/ui/Screens";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";

const Chat = () => {
  const { session, isLoading } = useSession();
  const [message, setMessage] = useState("");
  const { data, refetch } = useQuery({
    queryKey: ["chat", session?.id],
    queryFn: () =>
      session
        ? honoClient.chat.$get().then(async (res) => {
            const data = await res.json();
            if ("t" in data) throw new Error(data.t as string);

            return data;
          })
        : [],
  });
  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      const data = await honoClient.chat
        .$post({ json: { message } })
        .then((res) => res.json());

      if ("t" in data) {
        throw new Error(data.t as string);
      }

      return data;
    },
    onSettled: () => refetch(),
  });

  if (isLoading) return <LoadingScreen />;
  if (!session) return <Redirect href="/auth" />;

  return (
    <SafeAreaView className="flex flex-1 flex-col gap-3 bg-background p-4">
      <KeyboardAvoidingView behavior="padding" className="flex h-full gap-3">
        <Text className="font-extrabold text-4xl">{i18n.t("chat.title")}</Text>

        <ScrollView
          contentContainerStyle={{
            rowGap: 12,
            marginTop: "auto",
          }}
        >
          {sendMessage.isError && (
            <ChatBubble
              bot
              content={i18n.t(`errors.${sendMessage.error.message}`)}
            />
          )}
          {data &&
            "filter" in data &&
            data
              ?.filter((message) => message.content.length)
              .map((message) => (
                <ChatBubble
                  bot={message.bot}
                  content={message.content}
                  key={message.id}
                />
              ))}
          {sendMessage.isPending && (
            <ChatBubble bot={false} content={sendMessage.variables} />
          )}
        </ScrollView>

        <TextInput
          mode="outlined"
          placeholder={i18n.t("chat.input")}
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={() => {
            sendMessage.mutate(message);
            setMessage("");
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
