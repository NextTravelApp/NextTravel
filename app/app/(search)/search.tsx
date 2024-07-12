import { honoClient } from "@/components/fetcher";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export default function SearchPage() {
  const { location, members, startDate, endDate } = useLocalSearchParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["search", location, members, startDate, endDate],
    queryFn: () => {
      if (!location || !members || !startDate || !endDate) return null;

      const parsedStart = format(startDate as string, "yyyy-MM-dd");
      const parsedEnd = format(endDate as string, "yyyy-MM-dd");

      return honoClient.search
        .$post({
          json: {
            location: location as string,
            members: Number.parseInt(members as string),
            startDate: parsedStart,
            endDate: parsedEnd,
          },
        })
        .then(async (res) => await res.json());
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  if (isLoading) return <ActivityIndicator className="m-auto" size="large" />;
  if (error) return <Text>An error occurred</Text>;

  return <View />;
}
