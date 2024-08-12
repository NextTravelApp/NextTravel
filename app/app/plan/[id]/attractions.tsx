import { useSession } from "@/components/auth/AuthContext";
import { useFetcher } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { Button, MapView, SafeAreaView } from "@/components/injector";
import { Attraction } from "@/components/plan/Attraction";
import { Navbar } from "@/components/ui/Navbar";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Screens";
import { useQuery } from "@tanstack/react-query";
import type { responseType, searchSchemaType } from "api";
import { Link, Redirect, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";

const AttractionsPage = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const { session } = useSession();
  const { fetcher } = useFetcher();

  const {
    data: searchRecord,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["plan", id],
    queryFn: async () => {
      const res = await fetcher.plan[":id"].$get({
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

  const { data: attractions, isLoading: isListLoading } = useQuery({
    queryKey: ["attractions", searchRecord?.id],
    queryFn: async () => {
      if (!searchRecord) return null;

      const request = searchRecord.request as searchSchemaType;
      const res = await fetcher.retriever.attractions.$post({
        json: {
          location: request.location,
        },
      });

      const data = await res.json();
      return data;
    },
  });

  if (!id) return <Redirect href="/" />;
  if (isLoading || isListLoading)
    return <LoadingScreen title={i18n.t("plan.loading.attractions")} />;
  if (error) return <ErrorScreen error={error.message} />;

  return (
    <SafeAreaView className="flex min-h-screen flex-1 flex-col gap-3 bg-background p-4">
      <Navbar title={i18n.t("plan.attractions.select")} back />

      {/* TODO: Display locations and markers */}
      <MapView className="h-60 w-full rounded-xl" />

      <ScrollView className="mt-4">
        <View className="flex gap-3 pb-4">
          {attractions?.map((item) => (
            <Attraction
              key={item.id}
              {...item}
              edit={searchRecord?.userId === session?.id}
              active={searchRecord?.attractions.includes(item.id) ?? false}
            />
          ))}
        </View>
      </ScrollView>

      <Link href={`/plan/${id}/checkout`} asChild>
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

export default AttractionsPage;
