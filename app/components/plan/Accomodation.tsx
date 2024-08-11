import { FontAwesome } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { type Href, Link, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { useTheme } from "../Theme";
import { honoClient } from "../fetcher";
import { i18n } from "../i18n";
import { Button, Text } from "../injector";
import { ExternalLink } from "../ui/ExternalLink";
import { Image } from "../ui/Image";

export type AccomodationProps = {
  id: string;
  name: string;
  location: string;
  image: string;
  price: number;
  rating: number;
  link?: string;
  edit?: boolean;
  switch?: boolean;
  checkoutUrl?: string;
};

export function Accomodation(props: AccomodationProps) {
  const { id } = useLocalSearchParams();
  const theme = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <Link
      href={
        props.edit || !props.switch
          ? ("#" as Href)
          : `/plan/${id}/accomodations`
      }
      className="flex h-32 w-full flex-1 flex-row gap-3"
      asChild
    >
      <Pressable
        onPress={(e) => {
          if (props.edit || !props.switch) e.preventDefault();
        }}
      >
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

          {props.price > 0 && (
            <Text className="text-lg">
              {i18n.t("plan.accomodation.price")}: {props.price}
            </Text>
          )}

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
                      accomodationId: props.id,
                    },
                  })
                  .then(() => {
                    queryClient.invalidateQueries({
                      queryKey: ["plan", id],
                    });
                    router.push(`/plan/${id}/checkout`);
                  });
              }}
              mode="contained"
              className="mt-auto w-full rounded-xl"
            >
              {i18n.t("plan.book")}
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
      </Pressable>
    </Link>
  );
}
