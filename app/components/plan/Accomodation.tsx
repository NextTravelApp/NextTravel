import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { honoClient } from "../fetcher";
import { Text } from "../injector/ReactNativePaper";
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
};

export function Accomodation(props: AccomodationProps) {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <Link
      href={props.edit ? "#" : `/plan/accomodation?id=${id}`}
      className="flex min-h-36 w-full flex-1 flex-row gap-3 rounded-xl bg-card"
      asChild
    >
      <Pressable
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
              router.push(`/plan?id=${id}&t=${Date.now()}`);
            });
        }}
      >
        <Image
          source={{
            uri: props.image,
          }}
          contentFit="fill"
          className="h-full flex-1 rounded-xl"
        />

        <View className="m-auto w-1/2">
          <Text className="!font-bold text-xl">{props.name}</Text>
          <Text className="text-lg">{props.location}</Text>
          {props.price > 0 && (
            <Text className="text-lg">Price: {props.price}</Text>
          )}
          {props.rating > 0 && (
            <Text className="text-lg">Rating: {props.rating}</Text>
          )}
        </View>
      </Pressable>
    </Link>
  );
}