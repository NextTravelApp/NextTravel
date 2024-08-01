import { useSession } from "@/components/auth/AuthContext";
import { honoClient } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { Button, SafeAreaView, Text } from "@/components/injector";
import { Accomodation } from "@/components/plan/Accomodation";
import { LimitScreen } from "@/components/plan/LimitScreen";
import { PlanStep } from "@/components/plan/PlanStep";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Screens";
import { useQuery } from "@tanstack/react-query";
import type { responseType } from "api";
import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";

const PlanPage = () => {
  const { id, t } = useLocalSearchParams<{
    id: string;
    t?: string;
  }>();
  const { session } = useSession();
  const { data, isLoading, error } = useQuery({
    queryKey: ["plan", id, t],
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
  const { data: accomodation } = useQuery({
    queryKey: ["accomodation", data?.response.accomodationId],
    queryFn: async () => {
      if (!data?.response.accomodationId) return null;

      const res = await honoClient.retriever.accomodations[":id"].$get({
        param: {
          id: data.response.accomodationId,
        },
      });

      const resData = await res.json();
      if ("t" in resData) throw new Error(resData.t);

      return resData;
    },
  });

  if (isLoading) return <LoadingScreen />;
  if (error && error.message === "month_limit") return <LimitScreen />;
  if (error) return <ErrorScreen error={error.message} />;

  return (
    <SafeAreaView className="flex flex-1 flex-col bg-background p-4">
      <Text className="!font-extrabold text-2xl">{i18n.t("plan.title")}</Text>
      <Text className="text-lg">{i18n.t("plan.description")}</Text>

      <ScrollView className="mt-4">
        {accomodation && (
          <>
            <Text className="!font-bold text-xl">
              {i18n.t("plan.accomodation_title")}
            </Text>
            <Accomodation
              {...accomodation}
              switch={session?.id === data?.userId}
            />
          </>
        )}

        <View className="flex gap-3 pb-6">
          <Text className="!font-bold mt-4 text-xl">{i18n.t("plan.plan")}</Text>
          {data?.response.plan?.map((item) => (
            <PlanStep key={item.title} {...item} />
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

export default PlanPage;
