import { Pressable, View } from "react-native";
import { Text } from "../injector/ReactNativePaper";
import { Image } from "../ui/Image";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { honoClient } from "../fetcher";
import { useQueryClient } from "@tanstack/react-query";

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
      href={props.edit ? "#" : `/search/accomodation?id=${id}`}
      className="flex min-h-36 w-full flex-1 flex-row gap-3 rounded-xl bg-card"
      asChild
    >
      <Pressable
        onPress={() => {
          if (!props.edit) return;

          honoClient.search[":id"]
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
                queryKey: ["search", id],
              });
              router.push(`/search?id=${id}`);
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
          <Text className="text-lg">Price: {props.price}</Text>
          <Text className="text-lg">Rating: {props.rating}</Text>
        </View>
      </Pressable>
    </Link>
  );
}
