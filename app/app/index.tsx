import { Location } from "@/components/home/Location";
import { Image } from "@/components/ui/Image";
import { Separator } from "@/components/ui/Separator";
import { Button, Input, Text, View } from "@/components/ui/Themed";
import { ScrollView } from "react-native";

const blurhash = "NlGIinWAE1Rjjsj[_4V@RPRjWBj[-;WAj@RjWBay";

export default function App() {
  return (
    <ScrollView className="flex flex-1 flex-col bg-background">
      <View className="relative mb-[20vh] h-2/5">
        <Image
          className="w-full bg-[#0553]"
          source={require("@/assets/images/landscape.webp")}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
          blurRadius={2}
        />

        <View className="absolute top-0 left-0 flex h-3/5 w-full flex-1 items-center justify-center bg-transparent">
          <Image
            className="w-3/4"
            source={require("@/assets/images/header.svg")}
            alt=""
            contentFit="contain"
          />
        </View>

        <View className="-bottom-16 ellipse absolute h-2/3 w-full bg-background" />

        <View className="-bottom-20 absolute flex h-2/3 w-full items-center gap-3">
          <Text className="mt-14 font-extrabold text-2xl">
            Ready for your next travel?
          </Text>

          <Input placeholder="Type your destination!" className="w-3/4" />
          <View className="flex w-3/4 flex-row gap-5">
            <Input placeholder="dd/mm/yyyy" className="w-full" />
            <Input
              keyboardType="number-pad"
              placeholder="1 adult(s)"
              className="w-full"
            />
          </View>

          <Button className="w-3/4">
            <Text className="text-center">Start planning!</Text>
          </Button>
        </View>
      </View>

      <Separator />

      <View className="flex gap-2 p-6">
        <Text className="font-extrabold text-xl">Most requested</Text>
        <ScrollView
          horizontal
          contentContainerStyle={{
            columnGap: 12,
          }}
        >
          <Location
            image={require("@/assets/images/landscape.webp")}
            name="Paris"
            id="paris"
          />
          <Location
            image={require("@/assets/images/landscape.webp")}
            name="Paris"
            id="paris"
          />
          <Location
            image={require("@/assets/images/landscape.webp")}
            name="Paris"
            id="paris"
          />
          <Location
            image={require("@/assets/images/landscape.webp")}
            name="Paris"
            id="paris"
          />
        </ScrollView>
      </View>

      <View className="flex gap-2 p-6 pt-0">
        <Text className="font-extrabold text-xl">Last searches</Text>
        <ScrollView
          horizontal
          contentContainerStyle={{
            columnGap: 12,
          }}
        >
          <Location
            image={require("@/assets/images/landscape.webp")}
            name="Paris"
            id="paris"
          />
          <Location
            image={require("@/assets/images/landscape.webp")}
            name="Paris"
            id="paris"
          />
          <Location
            image={require("@/assets/images/landscape.webp")}
            name="Paris"
            id="paris"
          />
          <Location
            image={require("@/assets/images/landscape.webp")}
            name="Paris"
            id="paris"
          />
        </ScrollView>
      </View>
    </ScrollView>
  );
}
