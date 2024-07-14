import { honoClient } from "@/components/fetcher";
import { Button, Text } from "@/components/injector/ReactNativePaper";
import { Accomodation } from "@/components/search/Accomodation";
import { PlanStep } from "@/components/search/PlanStep";
import { useQuery } from "@tanstack/react-query";
import type { searchSchemaType } from "api";
import { Link, Redirect, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function SearchAccomodationPage() {
  const { id } = useLocalSearchParams<{
    id?: string;
  }>();

  const {
    data: searchRecord,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["get-search", id],
    queryFn: async () => {
      if (!id) return null;

      const res = await honoClient.search[":id"].$get({
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

  const { data: accomodations } = useQuery({
    queryKey: ["accomodations", searchRecord?.id],
    queryFn: async () => {
      if (!searchRecord) return null;

      const request = searchRecord.request as searchSchemaType;
      const res = await honoClient.retriever.accomodations.$post({
        json: {
          location: request.location as string,
          members: [request.members as number],
          checkIn: request.startDate as string,
          checkOut: request.endDate as string,
        },
      });

      const data = await res.json();
      return data;
    },
  });

  if (!id) return <Redirect href="/" />;
  if (isLoading) return <ActivityIndicator className="m-auto" size="large" />;
  if (error) return <Text className="m-auto">An error occurred</Text>;

  return (
    <View className="flex flex-1 flex-col bg-background p-4">
      <Text className="!font-extrabold text-2xl">Select your accomodation</Text>

      <ScrollView className="mt-4">
        <View className="flex gap-3">
          {accomodations?.map((item) => (
            <Accomodation
              key={item.id}
              image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=fernando-alvarez-rodriguez-M7GddPqJowg-unsplash.jpg&w=640"
              {...item}
            />
          ))}
        </View>
      </ScrollView>

      <View className="fixed bottom-16 left-3 flex h-14 w-[93vw] flex-row items-center rounded-xl bg-card px-4 shadow-xl">
        <Text className="text-2xl">Total price:</Text>
        <Text className="!font-bold ml-2 text-2xl">€100</Text>

        <Link href={`/search?id=${id}`} asChild>
          <Button mode="contained" className="ml-auto">
            Go back
          </Button>
        </Link>
      </View>
    </View>
  );
}
