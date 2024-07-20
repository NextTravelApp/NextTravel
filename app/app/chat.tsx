import { useSession } from "@/components/auth/AuthContext";
import { honoClient } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { SafeAreaView, Text } from "@/components/injector";
import { LoadingScreen } from "@/components/ui/Screens";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";

const Chat = () => {
  const { session, isLoading } = useSession();
  const _res = useQuery({
    queryKey: ["chat", session?.id],
    queryFn: () =>
      session
        ? honoClient.chat.$get().then(async (res) => await res.json())
        : [],
  });

  if (isLoading) return <LoadingScreen />;
  if (!session) return <Redirect href="/login" />;

  return (
    <SafeAreaView className="flex flex-1 flex-col gap-3 bg-background p-4">
      <Text className="font-extrabold text-4xl">{i18n.t("chat.title")}</Text>
    </SafeAreaView>
  );
};

export default Chat;
