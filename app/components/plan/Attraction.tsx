import { FontAwesome } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useTheme } from "../Theme";
import { honoClient } from "../fetcher";
import { i18n } from "../i18n";
import { Button, Text } from "../injector";
import { ExternalLink } from "../ui/ExternalLink";
import { Image } from "../ui/Image";

export function RetrievedAttraction({
  id,
}: {
  id: string;
}) {
  const { data: attraction } = useQuery({
    queryKey: ["attraction", id],
    queryFn: async () => {
      const res = await honoClient.retriever.attractions[":id"].$get({
        param: {
          id,
        },
      });

      const data = await res.json();
      if ("t" in data) throw new Error(data.t);

      return data;
    },
  });

  if (!attraction) return null;

  return <Attraction {...attraction} active />;
}

export type AttractionProps = {
  id: string;
  name: string;
  location: string;
  image: string;
  price: number;
  rating: number;
  active: boolean;
  edit?: boolean;
  checkoutUrl?: string;
};

export function Attraction(props: AttractionProps) {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const queryClient = useQueryClient();

  return (
    <View className="flex h-32 w-full flex-1 flex-row gap-3">
      <Image
        source={{
          uri: props.image,
        }}
        contentFit="fill"
        className="h-full flex-1 rounded-xl"
      />

      <View className="m-auto flex h-full w-1/2">
        <Text className="!font-bold truncate text-xl" numberOfLines={1}>
          {props.name}
        </Text>

        <View className="flex flex-row items-center">
          {Array.from({ length: props.rating }).map((_, i) => (
            <FontAwesome
              name="star"
              size={20}
              color={theme.primary}
              // biome-ignore lint/suspicious/noArrayIndexKey: Required
              key={i}
            />
          ))}
        </View>

        <Text className="text-lg">
          {i18n.t("plan.accomodation.price")}: €{props.price}
        </Text>

        {props.edit && (
          <Button
            onPress={() => {
              if (!props.edit) return;

              honoClient.plan[":id"]
                .$patch({
                  param: {
                    id: id as string,
                  },
                  json: {
                    attractionId: props.id,
                  },
                })
                .then(() => {
                  queryClient.invalidateQueries({
                    queryKey: ["plan", id],
                  });
                });
            }}
            mode="contained"
            className={`mt-auto w-full rounded-xl ${
              props.active ? "bg-card" : "bg-primary"
            }`}
          >
            <Text className={props.active ? "" : "text-white"}>
              {i18n.t("plan.booked")}
            </Text>
          </Button>
        )}

        {props.checkoutUrl && (
          <ExternalLink href={props.checkoutUrl} asChild>
            <Button mode="contained" className="mt-auto w-full rounded-xl">
              {i18n.t("plan.book")}
            </Button>
          </ExternalLink>
        )}
      </View>
    </View>
  );
}
