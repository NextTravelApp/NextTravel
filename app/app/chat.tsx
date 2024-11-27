import { useSession } from "@/components/auth/AuthContext";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { useFetcher } from "@/components/fetcher";
import { i18n } from "@/components/i18n/LocalesHandler";
import { SafeAreaView, TextInput } from "@/components/injector";
import { Navbar } from "@/components/ui/Navbar";
import { LoadingScreen } from "@/components/ui/Screens";
import { FontAwesome } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { TextInput as RNTextInput } from "react-native-paper";

const Chat = () => {
  const { session, isLoading } = useSession();
  const { fetcher } = useFetcher();
  const [message, setMessage] = useState("");
  const view = useRef<ScrollView>(null);
  const { data, refetch } = useQuery({
    queryKey: ["chat", session?.id],
    queryFn: () =>
      session
        ? fetcher.chat.$get().then(async (res) => {
            const data = await res.json();
            if ("t" in data) throw new Error(data.t as string);

            return data;
          })
        : [],
  });
  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      if (message.trim().length === 0) return;

      setMessage("");

      const data = await fetcher.chat
        .$post({ json: { message } })
        .then((res) => res.json());

      if ("t" in data) {
        throw new Error(data.t as string);
      }

      return data;
    },
    onSettled: (_, error) => {
      if (!error) refetch();
    },
  });

  if (isLoading) return <LoadingScreen />;
  if (!session) return <Redirect href="/auth" />;

  return (
    <SafeAreaView
      className="!pb-0 flex flex-1 flex-col gap-3 bg-background p-4"
      noPaddingBottom
    >
      <KeyboardAvoidingView behavior="padding" className="flex h-full gap-3">
        <Navbar title={i18n.t("chat.title")} />

        <ScrollView
          ref={view}
          contentContainerStyle={{
            rowGap: 12,
          }}
          onContentSizeChange={() =>
            view.current?.scrollToEnd({ animated: true })
          }
        >
          {data &&
            "filter" in data &&
            data
              ?.filter((message) => message.content.length)
              .map((message) => (
                <ChatBubble
                  bot={message.bot}
                  content={message.content}
                  key={message.id}
                  diffs={
                    (message.data as unknown as {
                      added: string[];
                      removed: string[];
                    }) || undefined
                  }
                />
              ))}
          {(sendMessage.isPending || sendMessage.isError) && (
            <ChatBubble bot={false} content={sendMessage.variables} />
          )}
          {sendMessage.isError && (
            <ChatBubble
              bot
              content={i18n.t(`errors.${sendMessage.error.message}`)}
            />
          )}
        </ScrollView>

        <TextInput
          mode="outlined"
          placeholder={i18n.t("chat.input")}
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={() => sendMessage.mutate(message)}
          right={
            <RNTextInput.Icon
              icon={(props) => <FontAwesome name="send" {...props} />}
              onPress={() => sendMessage.mutate(message)}
            />
          }
          className="!bg-background"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
