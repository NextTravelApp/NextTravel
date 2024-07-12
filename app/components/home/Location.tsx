import { Link } from "expo-router";
import { Pressable } from "react-native";
import { Text } from "@/components/injector/ReactNativePaper";
import { Image } from "../ui/Image";

export type LocationProps = {
  image: string;
  name: string;
  id: string;
};

export function Location(props: LocationProps) {
  return (
    <Link href={`/search?location=${props.id}`} asChild>
      <Pressable className="relative h-32 w-56">
        <Image
          source={props.image}
          contentFit="cover"
          className="w-full rounded-xl"
        />

        <Text className="!text-white !font-bold !text-lg absolute top-3 left-3">
          {props.name}
        </Text>
      </Pressable>
    </Link>
  );
}
