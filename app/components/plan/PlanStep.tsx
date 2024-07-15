import { FontAwesome6 } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import { honoClient } from "../fetcher";
import { Text } from "../injector/ReactNativePaper";
import { ExternalLink } from "../ui/ExternalLink";
import { Image } from "../ui/Image";

export type PlanStepProps = {
  location: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  attractionId?: string | undefined;
};

export function PlanStep(props: PlanStepProps) {
  const { data: image } = useQuery({
    queryKey: ["image", props.location],
    queryFn: () =>
      honoClient.image.search
        .$get({
          query: { location: props.location },
        })
        .then(async (res) => await res.json()),
  });

  return (
    <View className="relative flex min-h-36 w-full flex-1 flex-row gap-3 rounded-xl bg-card last:mb-20">
      <Image
        source={{
          uri: !image || "error" in image ? undefined : image.url,
        }}
        contentFit="fill"
        className="h-full flex-1 rounded-xl"
      />

      <View className="m-auto w-1/2">
        <Text className="!font-bold text-xl">{props.title}</Text>
        <Text className="text-lg">{props.location}</Text>
        <Text className="text-lg">Duration: {props.duration}</Text>
        <Text className="text-lg">Time: {props.time}</Text>
      </View>

      {image && "author" in image && (
        <ExternalLink className="absolute bottom-3 left-3" href={image.author}>
          <FontAwesome6 name="unsplash" size={24} color="white" />
        </ExternalLink>
      )}

      <Text className="absolute right-3 bottom-3 flex flex-row justify-end gap-3">
        {props.attractionId && (
          <FontAwesome6 name="landmark" size={24} color="black" />
        )}
      </Text>
    </View>
  );
}
