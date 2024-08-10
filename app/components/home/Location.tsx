import { SafeAreaView, Text } from "@/components/injector";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView } from "react-native";
import { ExternalLink } from "../ui/ExternalLink";
import { Image } from "../ui/Image";
import { Navbar } from "../ui/Navbar";

export type LocationProps = {
  image: string | null;
  imageAttribs?: string | null;
  name: string;
  id: string;
  restore?: boolean;
  className?: string;
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
      className={`relative h-48 w-80 ${props.className ?? ""}`}
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

export function LocationList({
  locations,
  title,
}: {
  locations: LocationProps[];
  title: string;
}) {
  return (
    <SafeAreaView className="flex flex-1 flex-col gap-3 bg-background p-4">
      <Navbar title={title} />

      <ScrollView
        contentContainerStyle={{
          rowGap: 12,
          width: "100%",
        }}
      >
        {locations.map((location) => (
          <Location
            key={location.id}
            {...location}
            restore
            className="!w-full !h-64"
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
