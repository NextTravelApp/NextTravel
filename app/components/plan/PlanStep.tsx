import { FontAwesome6 } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { View } from "react-native";
import { useFetcher } from "../fetcher";
import { i18n } from "../i18n/LocalesHandler";
import { Text } from "../injector";
import { ExternalLink } from "../ui/ExternalLink";
import { Image } from "../ui/Image";

export type PlanStepProps = {
  location: string;
  title: string;
  time: string;
  duration: number;
};

export function PlanStep(props: PlanStepProps) {
  const { fetcher } = useFetcher();
  const { data: image } = useQuery({
    queryKey: ["image", props.location],
    queryFn: () =>
      fetcher.image.search
        .$get({
          query: { location: props.location },
        })
        .then(async (res) => await res.json()),
  });

  return (
    <View className="relative flex min-h-36 w-full flex-1 flex-row gap-3 rounded-xl bg-card">
      <Image
        source={{
          uri: !image || "t" in image ? undefined : image.url,
        }}
        contentFit="cover"
        className="h-full flex-1 rounded-xl"
      />

      <View className="m-auto w-1/2">
        <Text className="!font-bold text-xl">{props.title}</Text>
        <Text className="text-lg">{props.location}</Text>
        <Text className="text-lg">
          {i18n.t("plan.step.duration")}: {props.duration}
        </Text>
        <Text className="text-lg">
          {i18n.t("plan.step.time")}: {props.time}
        </Text>
      </View>

      {image && "author" in image && (
        <ExternalLink className="absolute bottom-3 left-3" href={image.author}>
          <FontAwesome6 name="unsplash" size={24} color="white" />
        </ExternalLink>
      )}
    </View>
  );
}
