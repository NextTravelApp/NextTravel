import { useSession } from "@/components/auth/AuthContext";
import { useFetcher } from "@/components/fetcher";
import { Location } from "@/components/home/Location";
import { i18n } from "@/components/i18n";
import { Button, SafeAreaView, Text } from "@/components/injector";
import { Navbar } from "@/components/ui/Navbar";
import { LoadingScreen } from "@/components/ui/Screens";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { ScrollView, View } from "react-native";

const Account = () => {
  const { session, isLoading, logout } = useSession();
  const { fetcher } = useFetcher();
  const publicPlans = useQuery({
    queryKey: ["public", session?.id],
    queryFn: () =>
      session
        ? fetcher.auth.me.public.$get().then(async (res) => await res.json())
        : [],
  });

  if (isLoading) return <LoadingScreen />;
  if (!session) return null;

  return (
    <SafeAreaView className="flex flex-1 flex-col gap-3 bg-background p-4">
      <Navbar title="Account" />

      <View className="flex w-full items-center">
        <FontAwesome name="user-circle-o" size={80} color="gray" />
        <Text className="text-2xl">{session.name}</Text>
        <Text className="text-lg text-primary">
          {i18n.t(`account.premium.${session.plan || "random_traveler"}.title`)}
        </Text>
      </View>

      <View>
        <Text className="my-3 font-bold text-2xl">
          {i18n.t("account.public")}
        </Text>
        <ScrollView
          horizontal
          contentContainerStyle={{
            columnGap: 12,
          }}
        >
          {publicPlans.data?.map((bookmark) => (
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
      </View>

      <View className="mt-auto flex w-full flex-row items-center gap-3">
        <Link href="/premium" asChild>
          <Button className="!bg-card w-[49%]" mode="contained">
            <Text>{i18n.t("account.manage_plan")}</Text>
          </Button>
        </Link>

        <Button className="w-[49%]" mode="contained" onPress={logout}>
          {i18n.t("settings.logout")}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Account;
