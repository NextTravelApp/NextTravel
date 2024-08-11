import { honoClient } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { Button, MapView, SafeAreaView } from "@/components/injector";
import { Accomodation } from "@/components/plan/Accomodation";
import { Navbar } from "@/components/ui/Navbar";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Screens";
import { useQuery } from "@tanstack/react-query";
import type { responseType, searchSchemaType } from "api";
import { Link, Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

const AccomodationsPage = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const router = useRouter();

  const {
    data: searchRecord,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["plan", id],
    queryFn: async () => {
      const res = await honoClient.plan[":id"].$get({
        param: {
          id: id as string,
        },
      });

      const data = await res.json();
      if ("t" in data) throw new Error(data.t);

      return {
        ...data,
        response: data.response as responseType,
      };
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  const { data: accomodations, isLoading: isListLoading } = useQuery({
    queryKey: ["accomodations", searchRecord?.id],
    queryFn: async () => {
      if (!searchRecord) return null;

      const request = searchRecord.request as searchSchemaType;
      if (request.startDate === request.endDate) {
        router.replace(`/plan/${id}/attractions`);
        return [];
      }

      const res = await honoClient.retriever.accomodations.$post({
        json: {
          location: request.location,
          members: request.members,
          checkIn: request.startDate,
          checkOut: request.endDate,
        },
      });

      const data = await res.json();
      return data;
    },
  });

  if (!id) return <Redirect href="/" />;
  if (isLoading || isListLoading)
    return <LoadingScreen title={i18n.t("plan.loading.accomodation")} />;
  if (error) return <ErrorScreen error={error.message} />;

  return (
    <SafeAreaView className="flex min-h-screen flex-1 flex-col gap-3 bg-background p-4">
      <Navbar title={i18n.t("plan.accomodation.select")} back />

      {/* TODO: Display locations and markers */}
      <MapView className="h-60 w-full rounded-xl" />

      <ScrollView className="mt-4">
        <View className="flex gap-3 pb-4">
          {accomodations?.map((item) => (
            <Accomodation key={item.id} {...item} edit />
          ))}
        </View>
      </ScrollView>

      <Link href={`/plan/${id}/attractions`} asChild>
        <Button
          mode="contained"
          className="h-14 w-[93vw] justify-center text-center font-bold"
        >
          {i18n.t("plan.next")}
        </Button>
      </Link>
    </SafeAreaView>
  );
};

export default AccomodationsPage;
