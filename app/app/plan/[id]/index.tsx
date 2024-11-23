import { useFetcher } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { Button, MapView, SafeAreaView, Text } from "@/components/injector";
import { LimitScreen } from "@/components/plan/LimitScreen";
import { PlanStep } from "@/components/plan/PlanStep";
import { Navbar } from "@/components/ui/Navbar";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Screens";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import { Platform, ScrollView, View } from "react-native";

const PlanPage = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const { fetcher } = useFetcher();
  const { data, isLoading, error } = useQuery({
    queryKey: ["plan", id],
    queryFn: async () => {
      const res = await fetcher.plan[":id"].$get({
        param: {
          id: id as string,
        },
      });

      const data = await res.json();
      if ("t" in data) throw new Error(data.t);

      if ("pending" in data)
        return {
          pending: true,
        };

      return data;
    },
    refetchInterval: (query) =>
      !query.state.data || "pending" in query.state.data ? 1000 : false,
  });

  if (isLoading) return <LoadingScreen />;
  if (error && error.message === "month_limit") return <LimitScreen />;
  if (error) return <ErrorScreen error={error.message} />;
  if (data && "pending" in data)
    return <LoadingScreen title={i18n.t("plan.loading.create")} />;

  return (
    <SafeAreaView className="flex flex-1 flex-col gap-3 bg-background p-4">
      <Navbar title={i18n.t("plan.title")} back />

      {/* TODO: Display locations and markers */}
      <MapView id={`plan-${id}`} className="h-60 w-full rounded-xl" />

      <ScrollView className="mt-4">
        <View className="flex gap-3 pb-6">
          <Text className="!font-bold mt-4 text-xl">{i18n.t("plan.plan")}</Text>
          {data?.response.dates?.map((item) => (
            <View key={item.date} className="flex gap-3">
              <Text className="font-bold text-xl">
                {item.date} - {item.title}
              </Text>

              {item.steps.map((step) => (
                <PlanStep key={step.title} {...step} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <Link href={`/plan/${id}/accomodations`} asChild>
        <Button
          mode="contained"
          className="h-14 w-[93vw] justify-center text-center font-bold"
          style={{
            width: Platform.OS === "web" ? "100%" : undefined,
          }}
        >
          {i18n.t("plan.next")}
        </Button>
      </Link>
    </SafeAreaView>
  );
};

export default PlanPage;
