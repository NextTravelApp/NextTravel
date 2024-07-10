import { Location } from "@/components/home/Location";
import { Separator } from "@/components/ui/Separator";
import { Text, View, Button, Input } from "@/components/ui/Themed";
import { Image } from "expo-image";
import { ScrollView, StyleSheet } from "react-native";

const blurhash = "NlGIinWAE1Rjjsj[_4V@RPRjWBj[-;WAj@RjWBay";

export default function App() {
  return (
    <View className="flex flex-1 flex-col bg-background">
      <View className="relative mb-[15vh] h-2/5">
        <Image
          style={styles.image}
          source={require("@/assets/images/landscape.webp")}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
          blurRadius={2}
        />

        <View className="absolute top-0 left-0 flex h-3/5 w-full flex-1 items-center justify-center bg-transparent">
          <Image
            style={styles.heading}
            source={require("@/assets/images/header.svg")}
            alt=""
            contentFit="contain"
          />
        </View>

        <View className="-bottom-1 ellipse absolute flex h-2/5 w-full items-center gap-3 bg-background">
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

          <Button className="w-3/4">Start planning!</Button>
        </View>
      </View>

      <Separator />

      <View className="p-6">
        <Text className="font-extrabold text-xl">Most requested</Text>
        <ScrollView>
          <Location />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0553",
  },
  heading: {
    flex: 1,
    width: "75%",
  },
});
