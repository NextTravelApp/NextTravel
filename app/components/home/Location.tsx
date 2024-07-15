import { Text } from "@/components/injector/ReactNativePaper";
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
      onPress={(e) => {
        if ("nodeName" in e.target && e.target.nodeName === "IMG")
          router.push(
            props.restore ? `/plan?id=${props.id}` : `/?location=${props.id}`,
          );
      }}
      className="relative h-32 w-56"
    >
      <Image
        source={props.image}
        contentFit="cover"
        className="w-full rounded-xl"
        data-image
      />

      <Text className="!text-white !font-bold !text-lg absolute top-3 left-3">
        {props.name}
      </Text>

      {props.imageAttribs && (
        <ExternalLink href={props.imageAttribs}>
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
