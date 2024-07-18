import { honoClient } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { Button, SafeAreaView, Text } from "@/components/injector";
import { Accomodation } from "@/components/plan/Accomodation";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Screens";
import { useQuery } from "@tanstack/react-query";
import type { searchSchemaType } from "api";
import { Link, Redirect, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";

const SearchAccomodationPage = () => {
  const { id } = useLocalSearchParams<{
    id?: string;
  }>();

  const {
    data: searchRecord,
    isLoading,
    error,
  } = useQuery({
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
  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error.message} />;

  return (
    <SafeAreaView className="flex min-h-screen flex-1 flex-col bg-background p-4">
      <Text className="!font-extrabold text-2xl">
        {i18n.t("plan.accomodation.select")}
      </Text>

      <ScrollView className="mt-4">
        <View className="flex gap-3 pb-4">
          {accomodations?.map((item) => (
            <Accomodation key={item.id} {...item} edit />
          ))}
        </View>
      </ScrollView>

      <Link href={`/plan?id=${id}`} asChild>
        <Button
          mode="contained"
          className="h-14 w-[93vw] items-center justify-center px-4 text-center font-bold"
        >
          {i18n.t("plan.back")}
        </Button>
      </Link>
    </SafeAreaView>
  );
};

export default SearchAccomodationPage;
