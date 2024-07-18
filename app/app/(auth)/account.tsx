import { useSession } from "@/components/auth/AuthContext";
import { honoClient } from "@/components/fetcher";
import { Location } from "@/components/home/Location";
import { i18n } from "@/components/i18n";
import { Button, SafeAreaView, Text } from "@/components/injector";
import { LoadingScreen } from "@/components/ui/Screens";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, View } from "react-native";

const Account = () => {
  const { session, isLoading, logout } = useSession();
  const bookmarks = useQuery({
    queryKey: ["bookmarks", session?.id],
    queryFn: () =>
      session
        ? honoClient.auth.me.bookmarks
            .$get()
            .then(async (res) => await res.json())
        : [],
  });

  if (isLoading) return <LoadingScreen />;
  if (!session) return null;

  return (
    <SafeAreaView className="flex flex-1 flex-col bg-background p-4">
      <View className="flex w-full items-center">
        <FontAwesome name="user-circle-o" size={80} color="gray" />
        <Text className="text-2xl">{session.name}</Text>
      </View>

      <Text className="mt-4 font-bold text-2xl">
        {i18n.t("account.bookmarks")}
      </Text>
      <ScrollView
        horizontal
        contentContainerStyle={{
          columnGap: 12,
        }}
      >
        {bookmarks.data?.map((bookmark) => (
          <Location
            key={bookmark.id}
            image={bookmark.image}
            imageAttribs={bookmark.imageAttributes}
            name={bookmark.title}
            id={bookmark.id}
            restore
          />
        ))}
      </ScrollView>

      <Button mode="contained" onPress={logout}>
        Logout
      </Button>
    </SafeAreaView>
  );
};

export default Account;
