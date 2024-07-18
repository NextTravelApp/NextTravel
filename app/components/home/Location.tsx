import { Text } from "@/components/injector";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { ExternalLink } from "../ui/ExternalLink";
import { Image } from "../ui/Image";

export type LocationProps = {
  image: string | null;
  imageAttribs?: string | null;
  name: string;
  id: string;
  restore?: boolean;
};

export function Location(props: LocationProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        router.push(
          props.restore ? `/plan/${props.id}` : `/?location=${props.name}`,
        );
      }}
      className="relative h-48 w-80"
    >
      <Image
        source={props.image}
        contentFit="cover"
        className="h-full w-full rounded-xl"
        data-image
      />

      <Text className="!text-white !font-bold !text-lg absolute top-3 left-3">
        {props.name}
      </Text>

      {props.imageAttribs && (
        <ExternalLink asChild href={props.imageAttribs}>
          <FontAwesome6
            className="absolute right-3 bottom-3"
            name="unsplash"
            size={24}
            color="white"
          />
        </ExternalLink>
      )}
    </Pressable>
  );
}
