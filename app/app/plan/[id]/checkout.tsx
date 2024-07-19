import { useTheme } from "@/components/Theme";
import { useSession } from "@/components/auth/AuthContext";
import { honoClient } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { Button, SafeAreaView, Text } from "@/components/injector";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Screens";
import { FontAwesome } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { responseType } from "api";
import { Link, Redirect, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Share, View } from "react-native";

const CheckoutPage = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const theme = useTheme();
  const { session } = useSession();
  const queryClient = useQueryClient();
  const { data: plan } = useQuery({
    queryKey: ["plan", id],
    queryFn: async () => {
      const res = await honoClient.plan[":id"].$get({
        param: {
          id: id as string,
        },
      });

      const data = await res.json();
      if ("t" in data) throw new Error(data.t);

      return data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["checkout", id],
    queryFn: async () => {
      const res = await honoClient.plan[":id"].checkout.$post({
        param: {
          id: id as string,
        },
      });

      const data = await res.json();
      if ("t" in data) throw new Error(data.t);

      return data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
  const bookmark = useMutation({
    mutationFn: (bookmark: boolean) =>
      honoClient.plan[":id"].$patch({
        param: {
          id: id as string,
        },
        json: {
          bookmark,
        },
      }),
    onSettled: async () =>
      await queryClient.invalidateQueries({ queryKey: ["plan", id] }),
  });
  const publishPost = useMutation({
    mutationFn: (publicPost: boolean) =>
      honoClient.plan[":id"].$patch({
        param: {
          id: id as string,
        },
        json: {
          public: publicPost,
        },
      }),
    onSettled: async () =>
      await queryClient.invalidateQueries({ queryKey: ["plan", id] }),
  });

  if (!id) return <Redirect href="/" />;
  if (isLoading || !data) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error.message} />;

  return (
    <SafeAreaView className="flex flex-1 flex-col bg-background p-4">
      <View className="flex flex-row items-center justify-between">
        <View>
          <Text className="!font-extrabold text-2xl">
            {i18n.t("plan.checkout.title")}
          </Text>
          <Text className="text-lg">{i18n.t("plan.checkout.description")}</Text>
        </View>

        {session?.id === plan?.userId && (
          <View className="flex flex-row items-center gap-3">
            <Pressable
              onPress={() => {
                publishPost.mutate(
                  publishPost.isPending
                    ? !publishPost.variables
                    : !plan?.public,
                );
              }}
            >
              <FontAwesome
                name={
                  publishPost.isPending
                    ? publishPost.variables
                      ? "eye-slash"
                      : "eye"
                    : plan?.public
                      ? "eye-slash"
                      : "eye"
                }
                size={24}
                color={theme.text}
              />
            </Pressable>

            <Pressable
              onPress={() => {
                bookmark.mutate(
                  bookmark.isPending ? !bookmark.variables : !plan?.bookmark,
                );
              }}
            >
              <FontAwesome
                name={
                  bookmark.isPending
                    ? bookmark.variables
                      ? "bookmark"
                      : "bookmark-o"
                    : plan?.bookmark
                      ? "bookmark"
                      : "bookmark-o"
                }
                size={24}
                color={theme.text}
              />
            </Pressable>
          </View>
        )}
      </View>

      <ScrollView className="mt-4">
        <Text className="!font-bold text-xl">
          {i18n.t("plan.checkout.details")}
        </Text>
        <View className="mt-1">
          {data.items
            .filter((item) => item.price > 0)
            .filter(
              (item, i, arr) =>
                arr.findIndex((a) => a.name === item.name) === i,
            )
            .map((item) => (
              <View
                key={item.name}
                className="flex w-full flex-row justify-between"
              >
                <Text className="text-lg">{item.name}</Text>
                <Text className="text-lg">€{item.price}</Text>
              </View>
            ))}
        </View>

        <Text className="!font-bold mt-3 text-xl">
          {i18n.t("plan.checkout.plan")}
        </Text>
        {((plan?.response as responseType)?.plan ?? []).map((item) => (
          <Text
            key={item.title}
            className="flex flex-row items-center gap-2 text-lg"
          >
            <View className="block h-2 w-2 rounded-full bg-text" /> {item.title}
          </Text>
        ))}

        <Text className="!font-bold mt-3 text-xl">
          {i18n.t("plan.checkout.processor.title")}
        </Text>
        <Text className="mb-4 text-lg">
          {i18n.t("plan.checkout.processor.description")}
        </Text>
        {data.items
          .filter((item) => item.price > 0 && item.url)
          .map((item) => (
            <Link href={item.url as string} key={item.name} asChild>
              <Button mode="contained" className="mt-2">
                {item.name}
              </Button>
            </Link>
          ))}
      </ScrollView>

      <Button
        mode="outlined"
        className="mt-4"
        onPress={async () => {
          publishPost.mutate(true);

          Share.share({
            url: `${process.env.EXPO_PUBLIC_APP_URL as string}/plan/${id}`,
          });
        }}
      >
        {i18n.t("plan.share")}
      </Button>
    </SafeAreaView>
  );
};

export default CheckoutPage;
