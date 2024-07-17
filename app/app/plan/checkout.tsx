import { honoClient } from "@/components/fetcher";
import { Button, Text } from "@/components/injector/ReactNativePaper";
import { useQuery } from "@tanstack/react-query";
import type { responseType } from "api";
import { Link, Redirect, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function SearchAccomodationPage() {
  const { id } = useLocalSearchParams<{
    id?: string;
  }>();

  const { data: plan } = useQuery({
    queryKey: ["plan", id],
    queryFn: async () => {
      if (!id) return null;

      const res = await honoClient.plan[":id"].$get({
        param: {
          id: id,
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
      if (!id) return null;

      const res = await honoClient.plan.checkout[":id"].$post({
        param: {
          id: id,
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

  if (!id) return <Redirect href="/" />;
  if (isLoading || !data)
    return <ActivityIndicator className="m-auto" size="large" />;
  if (error) return <Text className="m-auto">An error occurred</Text>;

  return (
    <View className="flex flex-1 flex-col bg-background p-4">
      <Text className="!font-extrabold text-2xl">Ready for checkout?</Text>
      <Text className="text-lg">Let's make this plan real!</Text>

      <ScrollView className="mt-4">
        <Text className="!font-bold text-xl">Checkout Details</Text>
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

        <Text className="!font-bold mt-3 text-xl">Payment processors</Text>
        <Text className="text-lg">
          NextTravel creates amazing trips for you but is not responsible for
          attractions, accommodations, and travels.
        </Text>
        <Text className="text-lg">
          You can check and pay the providers by clicking the button below.
        </Text>

        <Text className="!font-bold mt-3 text-xl">Your plan</Text>
        {((plan?.response as responseType)?.plan ?? []).map((item) => (
          <Text
            key={item.title}
            className="flex flex-row items-center gap-2 text-lg"
          >
            <View className="block h-2 w-2 rounded-full bg-text" /> {item.title}
          </Text>
        ))}

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
    </View>
  );
}
