import { useSession } from "@/components/auth/AuthContext";
import { useFetcher } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { Button, MapView, SafeAreaView, Text } from "@/components/injector";
import { Navbar } from "@/components/ui/Navbar";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Screens";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { responseType, searchSchemaType } from "api";
import { Image } from "expo-image";
import { Link, Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Marker } from "react-native-maps";

const AccomodationsPage = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const { session } = useSession();
  const { fetcher } = useFetcher();
  const router = useRouter();
  const queryClient = useQueryClient();

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

  const { data: accomodations, isLoading: isListLoading } = useQuery({
    queryKey: ["accomodations", searchRecord?.id],
    queryFn: async () => {
      if (!searchRecord) return null;

      const request = searchRecord.request as searchSchemaType;
      if (request.startDate === request.endDate) {
        router.replace(`/plan/${id}/attractions`);
        return [];
      }

      const res = await fetcher.retriever.accomodations.$post({
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

  const bookAccomodation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetcher.plan[":id"].$patch({
        param: {
          id,
        },
        json: {
          accomodationId: selectedAccomodation?.id,
        },
      });

      const data = await res.json();
      if ("t" in data) throw new Error(data.t);

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["plan", id],
      });
    },
  });

  const [selected, setSelected] = useState<string | null>(null);
  const selectedAccomodation = useMemo(() => {
    return accomodations?.find((item) => item.id === selected);
  }, [selected, accomodations]);

  useEffect(() => {
    if (searchRecord?.accomodation) setSelected(searchRecord.accomodation);
  }, [searchRecord]);

  if (!id) return <Redirect href="/" />;
  if (isLoading || isListLoading)
    return <LoadingScreen title={i18n.t("plan.loading.accomodation")} />;
  if (error) return <ErrorScreen error={error.message} />;

  return (
    <SafeAreaView className="flex min-h-screen flex-1 flex-col gap-3 bg-background p-4">
      <Navbar title={i18n.t("plan.accomodation.select")} back />

      <MapView
        initialRegion={
          accomodations?.[0]?.locationData && {
            latitude: accomodations[0].locationData.latitude || 0,
            longitude: accomodations[0].locationData.longitude || 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }
        }
        className={`w-full rounded-xl ${selected ? "h-60" : "h-[76vh]"}`}
        onPress={(e) => {
          if (e.nativeEvent.action === "marker-press") return;
          setSelected(null);
        }}
      >
        {accomodations
          ?.filter((item) => !!item.locationData)
          .map(
            (item) =>
              item.locationData && (
                <Marker
                  key={`marker-${item.id}`}
                  coordinate={item.locationData}
                  title={item.name}
                  description={`€${item.price}`}
                  onPress={() => setSelected(item.id)}
                />
              ),
          )}
      </MapView>

      {selectedAccomodation && (
        <View className="flex flex-1">
          <Image
            source={{
              uri: selectedAccomodation.image,
            }}
            contentFit="fill"
            className="max-h-60 flex-1 rounded-xl"
          />
          <Text className="mt-3 font-extrabold text-3xl">
            {selectedAccomodation.name}
          </Text>
          <Text className="text-lg">{selectedAccomodation.location}</Text>
          <Text className="text-lg">€{selectedAccomodation.price}</Text>

          {session?.id === searchRecord?.userId && (
            <Button
              disabled={selected === searchRecord?.accomodation}
              onPress={() => bookAccomodation.mutate(id)}
              loading={bookAccomodation.isPending}
              mode="contained"
              className="mt-auto w-full rounded-xl"
            >
              {selected === searchRecord?.accomodation
                ? i18n.t("plan.booked")
                : i18n.t("plan.book")}
            </Button>
          )}
        </View>
      )}

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
