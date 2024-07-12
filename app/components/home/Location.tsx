import { Link } from "expo-router";
import { Pressable } from "react-native";
import { Text } from "react-native-paper";
import { Image } from "../ui/Image";

export type LocationProps = {
  image: string;
  name: string;
  id: string;
};

export function Location(props: LocationProps) {
  return (
    <Link href={`/search?destination=${props.id}`} asChild>
      <Pressable className="relative h-32 w-56">
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
