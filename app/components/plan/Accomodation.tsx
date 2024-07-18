import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { honoClient } from "../fetcher";
import { i18n } from "../i18n";
import { Button, Text } from "../injector";
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
};

export function Accomodation(props: AccomodationProps) {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <Link
      href={props.edit || !props.switch ? "#" : `/plan/${id}/accomodation`}
      className="flex min-h-36 w-full flex-1 flex-row gap-3 rounded-xl bg-card"
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

        <View className="m-auto flex h-full w-1/2 py-4">
          <Text className="!font-bold text-xl">{props.name}</Text>
          <Text className="text-lg">{props.location}</Text>
          {props.price > 0 && (
            <Text className="text-lg">
              {i18n.t("plan.accomodation.price")}: {props.price}
            </Text>
          )}
          {props.rating > 0 && (
            <Text className="text-lg">
              {i18n.t("plan.accomodation.rating")}: {props.rating}
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
                    router.push(`/plan/${id}?t=${Date.now()}`);
                  });
              }}
              mode="contained"
              className="mt-4 w-3/4"
            >
              Book
            </Button>
          )}
        </View>
      </Pressable>
    </Link>
  );
}
