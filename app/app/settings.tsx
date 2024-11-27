import { useSession } from "@/components/auth/AuthContext";
import { i18n } from "@/components/i18n/LocalesHandler";
import { Button, SafeAreaView, Text } from "@/components/injector";
import { Navbar } from "@/components/ui/Navbar";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { View } from "react-native";

const Chat = () => {
  const { logout } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <SafeAreaView className="flex flex-1 flex-col gap-3 bg-background p-4">
      <Navbar title={i18n.t("settings.title")} />

      <View className="flex flex-row gap-3">
        <Button
          mode="contained"
          className="!bg-card w-[49%]"
          onPress={() => {
            queryClient.invalidateQueries();
          }}
        >
          <Text>{i18n.t("settings.clear_cache")}</Text>
        </Button>

        <Button
          className="w-[49%]"
          mode="contained"
          onPress={() => {
            logout();
            router.push("/auth");
          }}
        >
          {i18n.t("settings.logout")}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Chat;
