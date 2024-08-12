import { useSession } from "@/components/auth/AuthContext";
import { useFetcher } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { Button, SafeAreaView, Text } from "@/components/injector";
import { Accomodation } from "@/components/plan/Accomodation";
import { RetrievedAttraction } from "@/components/plan/Attraction";
import { InviteMember } from "@/components/plan/InviteMember";
import { PlanSettings } from "@/components/plan/PlanSettings";
import { Navbar } from "@/components/ui/Navbar";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Screens";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { responseType } from "api";
import { Link, Redirect, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

const CheckoutPage = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const { session } = useSession();
  const { fetcher } = useFetcher();
  const { data: plan } = useQuery({
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
  const { data: accomodation } = useQuery({
    queryKey: ["accomodation", plan?.accomodation],
    queryFn: async () => {
      if (!plan?.accomodation) return null;

      const res = await fetcher.retriever.accomodations[":id"].$get({
        param: {
          id: plan.accomodation,
        },
      });

      const resData = await res.json();
      if ("t" in resData) throw new Error(resData.t);

      return resData;
    },
  });
  const {
    data: shared,
    refetch,
    isLoading: isSharedLoading,
  } = useQuery({
    queryKey: ["shared", id],
    queryFn: async () => {
      const res = await fetcher.plan[":id"].shared.$get({
        param: {
          id,
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
      const res = await fetcher.plan[":id"].checkout.$post({
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
  const share = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetcher.plan[":id"].share.$post({
        param: {
          id: id as string,
        },
        json: {
          email,
        },
      });

      const data = await res.json();
      if ("t" in data) throw new Error(data.t);

      return data;
    },
    onSettled: () => {
      refetch();
    },
  });
  const deleteShare = useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetcher.plan[":id"].shared[":userId"].$delete({
        param: {
          id: id as string,
          userId,
        },
      });

      const data = await res.json();
      if ("t" in data) throw new Error(data.t);

      return data;
    },
    onSettled: () => {
      refetch();
    },
  });

  const [inviteOpen, setInviteOpen] = useState(false);

  if (!id) return <Redirect href="/" />;
  if (isLoading) return <LoadingScreen />;
  if (!data) return <ErrorScreen error={i18n.t("plan.checkout.error")} />;
  if (error) return <ErrorScreen error={error.message} />;

  return (
    <SafeAreaView className="flex flex-1 flex-col bg-background p-4">
      <Navbar title={i18n.t("plan.checkout.title")} back />
      <Text className="text-lg">{i18n.t("plan.checkout.description")}</Text>

      <ScrollView className="mt-4">
        <View className="flex gap-3">
          {accomodation &&
            data.items.find((item) => item.type === "accomodation") && (
              <Accomodation
                {...accomodation}
                checkoutUrl={
                  data.items.find((item) => item.type === "accomodation")?.url
                }
              />
            )}
          {plan?.attractions?.map((attraction) => (
            <RetrievedAttraction id={attraction} key={attraction} />
          ))}
        </View>

        {plan?.userId === session?.id && (
          <>
            <Text className="!font-bold mt-3 text-2xl">
              {i18n.t("plan.checkout.friends")}
            </Text>
            <Text className="mb-4 text-lg">
              {i18n.t("plan.checkout.friends_description")}
            </Text>

            <View className="flex flex-row flex-wrap items-center">
              {shared
                ?.filter(
                  (friend) =>
                    (!deleteShare.isPending && !isSharedLoading) ||
                    friend.id !== deleteShare.variables,
                )
                .map((friend, i) => (
                  <TouchableOpacity
                    key={friend.id}
                    onPress={() => {
                      deleteShare.mutate(friend.id);
                    }}
                  >
                    <View
                      className={`flex h-10 w-10 items-center justify-center rounded-full border border-text bg-background p-2 text-center${i > 0 ? " -ml-3" : ""}`}
                    >
                      <Text>{friend.name.substring(0, 1)}</Text>
                    </View>
                  </TouchableOpacity>
                ))}

              <TouchableOpacity
                onPress={() => {
                  setInviteOpen(true);
                }}
              >
                <View
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-text bg-background p-2 text-center${
                    (shared?.filter(
                      (friend) =>
                        (!deleteShare.isPending && !isSharedLoading) ||
                        friend.id !== deleteShare.variables,
                    ).length || 0) > 0
                      ? " -ml-3"
                      : ""
                  }`}
                >
                  <Text>+</Text>
                </View>
              </TouchableOpacity>

              <Text className="ml-3 text-lg">
                {
                  shared?.filter(
                    (friend) =>
                      (!deleteShare.isPending && !isSharedLoading) ||
                      friend.id !== deleteShare.variables,
                  ).length
                }{" "}
                {i18n.t("plan.checkout.friends_count")}
              </Text>
            </View>

            <PlanSettings
              id={id}
              public={plan?.public ?? false}
              bookmark={plan?.bookmark ?? false}
            />
          </>
        )}
      </ScrollView>

      <View className="flex flex-row gap-3">
        <Link href={`/plan/${id}/calendar`} asChild>
          <Button
            mode="contained"
            className="h-14 w-[49%] justify-center bg-card text-center font-bold"
          >
            <Text>{i18n.t("plan.calendar")}</Text>
          </Button>
        </Link>

        <Link href="/" asChild>
          <Button
            mode="contained"
            className="h-14 w-[49%] justify-center text-center font-bold"
          >
            {i18n.t("plan.back")}
          </Button>
        </Link>
      </View>

      <InviteMember
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={(email) => {
          share.mutate(email);
        }}
      />
    </SafeAreaView>
  );
};

export default CheckoutPage;
