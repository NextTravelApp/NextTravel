import { honoClient } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { SafeAreaView, Text } from "@/components/injector";
import { Accomodation } from "@/components/plan/Accomodation";
import { Navbar } from "@/components/ui/Navbar";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Screens";
import { useQuery } from "@tanstack/react-query";
import type { responseType } from "api";
import { Redirect, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

const CheckoutPage = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const { data: plan } = useQuery({
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
  const { data: accomodation } = useQuery({
    queryKey: ["accomodation", plan?.response.accomodationId],
    queryFn: async () => {
      if (!plan?.response.accomodationId) return null;

      const res = await honoClient.retriever.accomodations[":id"].$get({
        param: {
          id: plan.response.accomodationId,
        },
      });

      const resData = await res.json();
      if ("t" in resData) throw new Error(resData.t);

      return resData;
    },
  });
  const { data, isLoading, error } = useQuery({
    queryKey: ["checkout", id],
    queryFn: async () => {
      const res = await honoClient.plan[":id"].checkout.$post({
        param: {
          id: id as string,
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

  if (!id) return <Redirect href="/" />;
  if (isLoading || !data) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error.message} />;

  return (
    <SafeAreaView className="flex flex-1 flex-col bg-background p-4">
      <Navbar title={i18n.t("plan.checkout.title")} back />
      <Text className="text-lg">{i18n.t("plan.checkout.description")}</Text>

      <ScrollView className="mt-4">
        {accomodation && <Accomodation {...accomodation} />}

        {/* TODO: Show extras */}

        <Text className="!font-bold mt-3 text-2xl">
          {i18n.t("plan.checkout.friends")}
        </Text>
        <Text className="mb-4 text-lg">
          {i18n.t("plan.checkout.friends_description")}
        </Text>

        {/* TODO: Show friends */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckoutPage;
