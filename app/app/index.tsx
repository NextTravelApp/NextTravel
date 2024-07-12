import { Location } from "@/components/home/Location";
import { Button, TextInput } from "@/components/injector/ReactNativePaper";
import { Image } from "@/components/ui/Image";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Divider, Text } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

const blurhash = "NlGIinWAE1Rjjsj[_4V@RPRjWBj[-;WAj@RjWBay";

export default function App() {
  const [dateOpen, setDateOpen] = useState(false);
  const [range, setRange] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({
    startDate: undefined,
    endDate: undefined,
  });

  return (
    <ScrollView className="flex flex-1 flex-col bg-background">
      <View className="relative mb-[24vh] h-2/5">
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

          <View className="flex w-3/4 gap-3">
            <TextInput
              mode="outlined"
              placeholder="Type your destination!"
              className="w-full"
            />
            <View className="flex w-full flex-row gap-4">
              <Button
                labelClassName="!text-black"
                mode="outlined"
                className="!rounded-md flex items-center justify-center"
                onPress={() => setDateOpen(true)}
              >
                Choose Period
              </Button>
              <TextInput
                mode="outlined"
                keyboardType="number-pad"
                placeholder="1 adult(s)"
                className="w-1/2"
              />
            </View>

            <Button mode="contained" className="w-full">
              Start planning!
            </Button>
          </View>
        </View>
      </View>

      <Divider />

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

      <DatePickerModal
        locale="en"
        mode="range"
        visible={dateOpen}
        onDismiss={() => {
          setDateOpen(false);
        }}
        startDate={range.startDate}
        endDate={range.endDate}
        onConfirm={({ startDate, endDate }) => {
          setRange({ startDate, endDate });
          setDateOpen(false);
        }}
      />
    </ScrollView>
  );
}
