import { honoClient } from "@/components/fetcher";
import { Button, Text } from "@/components/injector/ReactNativePaper";
import { Accomodation } from "@/components/search/Accomodation";
import { PlanStep } from "@/components/search/PlanStep";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function SearchPage() {
  const { location, members, startDate, endDate, id } = useLocalSearchParams<{
    location?: string;
    members?: string;
    startDate?: string;
    endDate?: string;
    id?: string;
  }>();
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["search", id, location, members, startDate, endDate],
    queryFn: async () => {
      const parsedStart = startDate
        ? format(startDate as string, "yyyy-MM-dd")
        : undefined;
      const parsedEnd = endDate
        ? format(endDate as string, "yyyy-MM-dd")
        : undefined;

      const res = await honoClient.search.$post({
        json: {
          id: id as string,
          location: location as string,
          members: members ? Number.parseInt(members as string) : -1,
          startDate: parsedStart,
          endDate: parsedEnd,
        },
      });

      const data = await res.json();
      if ("t" in data) throw new Error(data.t);
      if (!id && data?.id)
        router.setParams({
          id: data.id,
        });

      return data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
  const { data: accomodation } = useQuery({
    queryKey: ["accomodation", data?.accomodationId],
    queryFn: async () => {
      if (!data?.accomodationId) return null;

      const res = await honoClient.retriever.accomodations[":id"].$get({
        param: {
          id: data.accomodationId,
        },
      });

      const resData = await res.json();
      if ("t" in resData) throw new Error(resData.t);

      return resData;
    },
  });

  if (isLoading) return <ActivityIndicator className="m-auto" size="large" />;
  if (error) return <Text className="m-auto">An error occurred</Text>;

  return (
    <View className="flex flex-1 flex-col bg-background p-4">
      <Text className="!font-extrabold text-2xl">Your plan is ready!</Text>
      <Text className="text-lg">
        Click any item that you want to change to edit it.
      </Text>

      <ScrollView className="mt-4">
        {accomodation && (
          <>
            <Text className="!font-bold text-xl">Accomodation</Text>
            <Accomodation {...accomodation} />
          </>
        )}

        <View className="flex gap-3">
          <Text className="!font-bold mt-4 text-xl">Your plan</Text>
          {data?.plan.map((item) => (
            <PlanStep key={item.title} {...item} />
          ))}
        </View>
      </ScrollView>

      <View className="fixed bottom-16 left-3 flex h-14 w-[93vw] flex-row items-center rounded-xl bg-card px-4 shadow-xl">
        <Text className="text-2xl">Total price:</Text>
        <Text className="!font-bold ml-2 text-2xl">€100</Text>

        <Button mode="contained" className="ml-auto">
          Checkout
        </Button>
      </View>
    </View>
  );
}
