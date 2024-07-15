import { honoClient } from "@/components/fetcher";
import { Button, Text } from "@/components/injector/ReactNativePaper";
import { Accomodation } from "@/components/plan/Accomodation";
import { PlanStep } from "@/components/plan/PlanStep";
import { useQuery } from "@tanstack/react-query";
import type { responseType } from "api";
import { format } from "date-fns";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function PlanPage() {
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

      const parsedStart = format(startDate as string, "yyyy-MM-dd");
      const parsedEnd = format(endDate as string, "yyyy-MM-dd");

      const res = await honoClient.plan.$post({
        json: {
          location: location as string,
          members: members ? Number.parseInt(members as string) : -1,
          startDate: parsedStart,
          endDate: parsedEnd,
        },
      });

      const data = await res.json();
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

      <Link href={`/plan/checkout?id=${id}`} asChild>
        <Button
          mode="contained"
          className="fixed bottom-16 left-3 h-14 w-[93vw] items-center justify-center px-4 text-center font-bold"
        >
          Next
        </Button>
      </Link>
    </View>
  );
}
