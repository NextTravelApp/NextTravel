import { honoClient } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { Button, SafeAreaView, Text } from "@/components/injector";
import { Accomodation } from "@/components/plan/Accomodation";
import { LimitScreen } from "@/components/plan/LimitScreen";
import { PlanStep } from "@/components/plan/PlanStep";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Screens";
import { useQuery } from "@tanstack/react-query";
import type { responseType } from "api";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

const formatDate = (date: string) => {
  const split = date.split("/");
  if (split[0].length === 1) split[0] = `0${split[0]}`;
  if (split[1].length === 1) split[1] = `0${split[1]}`;
  return `${split[2]}-${split[0]}-${split[1]}`;
};

const PlanPage = () => {
  const { location, members, startDate, endDate, id, t } =
    useLocalSearchParams<{
      location?: string;
      members?: string;
      startDate?: string;
      endDate?: string;
      id?: string;
      t?: string;
    }>();
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["plan", id, location, members, startDate, endDate, t],
    queryFn: async () => {
      if (id) {
        const res = await honoClient.plan[":id"].$get({
          param: {
            id: id as string,
          },
        });

        const resData = await res.json();
        if ("t" in resData) throw new Error(resData.t);

        return resData.response as responseType;
      }
      if (!location || !members || !startDate || !endDate) return null;

      const res = await honoClient.plan.$post({
        json: {
          location: location as string,
          members: members ? Number.parseInt(members as string) : -1,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      });

      const data = await res.json();
      if ("error" in data)
        // biome-ignore lint/suspicious/noExplicitAny: Errors are not typed
        throw new Error((data as any).error);

      if ("t" in data) throw new Error(data.t);

      if (data.id)
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
              {i18n.t("plan.accomodation-title")}
            </Text>
            <Accomodation {...accomodation} />
          </>
        )}

        <View className="flex gap-3 pb-6">
          <Text className="!font-bold mt-4 text-xl">{i18n.t("plan.plan")}</Text>
          {data?.plan?.map((item) => (
            <PlanStep key={item.title} {...item} />
          ))}
        </View>
      </ScrollView>

      <Link href={`/plan/checkout?id=${id}`} asChild>
        <Button
          mode="contained"
          className="h-14 w-[93vw] items-center justify-center px-4 text-center font-bold"
        >
          {i18n.t("plan.next")}
        </Button>
      </Link>
    </SafeAreaView>
  );
};

export default PlanPage;
