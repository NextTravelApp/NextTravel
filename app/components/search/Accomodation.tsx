import { Text } from "../injector/ReactNativePaper";
import { View } from "react-native";
import { Image } from "../ui/Image";

export type AccomodationProps = {
  id: string;
  name: string;
  location: string;
  image: string;
  price: number;
  rating: number;
  link?: string;
};

export function Accomodation(props: AccomodationProps) {
  return (
    <View className="flex h-56 w-full flex-1 flex-row rounded-lg bg-card">
      <Image
        source={props.image}
        contentFit="cover"
        className="h-full flex-1 rounded-lg"
      />

      <View>
        <Text className="!font-bold text-lg">{props.name}</Text>
        <Text className="text-sm">{props.location}</Text>
        <Text className="text-sm">Price: {props.price}</Text>
        <Text className="text-sm">Rating: {props.rating}</Text>
      </View>
    </View>
  );
}
