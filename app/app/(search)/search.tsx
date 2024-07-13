import { honoClient } from "@/components/fetcher";
import { Text } from "@/components/injector/ReactNativePaper";
import { Accomodation } from "@/components/search/Accomodation";
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
    queryKey: ["search", location, members, startDate, endDate, id],
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

  if (isLoading) return <ActivityIndicator className="m-auto" size="large" />;
  if (error) return <Text className="m-auto">An error occurred</Text>;

  return (
    <View className="p-4">
      <Text className="!font-extrabold text-2xl">Your plan is ready!</Text>
      <Text className="text-lg">Now let's check it!</Text>

      <ScrollView className="mt-4">
        <Text className="!font-bold text-xl">Accomodation</Text>
        <Accomodation
          id="a1"
          name="Example"
          location={data?.plan[0]?.location ?? "Rome"}
          image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=fernando-alvarez-rodriguez-M7GddPqJowg-unsplash.jpg&w=640"
          price={100}
          rating={5}
        />
      </ScrollView>
    </View>
  );
}
