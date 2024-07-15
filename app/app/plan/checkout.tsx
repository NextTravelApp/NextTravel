import { honoClient } from "@/components/fetcher";
import { Button, Text } from "@/components/injector/ReactNativePaper";
import { useQuery } from "@tanstack/react-query";
import { Link, Redirect, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function SearchAccomodationPage() {
  const { id } = useLocalSearchParams<{
    id?: string;
  }>();

  const { isLoading, error } = useQuery({
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

  if (!id) return <Redirect href="/" />;
  if (isLoading) return <ActivityIndicator className="m-auto" size="large" />;
  if (error) return <Text className="m-auto">An error occurred</Text>;

  return (
    <View className="flex flex-1 flex-col bg-background p-4">
      <Text className="!font-extrabold text-2xl">Ready for checkout?</Text>
      <Text className="text-lg">Let's make this plan real!</Text>

      <Text className="!font-bold mt-6 text-xl">Checkout Details</Text>

      <View className="fixed bottom-16 left-3 flex h-14 w-[93vw] flex-row items-center rounded-xl bg-card px-4 shadow-xl">
        <Text className="text-2xl">Total price:</Text>
        <Text className="!font-bold ml-2 text-2xl">€100</Text>

        <Link href={`/plan?id=${id}`} asChild>
          <Button mode="contained" className="ml-auto">
            Back
          </Button>
        </Link>
      </View>
    </View>
  );
}
