import { Pressable } from "react-native";
import { Image } from "../ui/Image";
import { Text } from "../ui/Themed";
import { Link } from "expo-router";

export type LocationProps = {
  image: string;
  name: string;
  id: string;
};

export function Location(props: LocationProps) {
  return (
    <Link href={`/search?destination=${props.id}`} asChild>
      <Pressable className="relative h-28 w-44">
        <Image
          source={props.image}
          contentFit="cover"
          transition={1000}
          className="w-full rounded-xl"
        />

        <Text className="absolute top-3 left-3 font-bold text-lg text-white">
          {props.name}
        </Text>
      </Pressable>
    </Link>
  );
}
