import { useSession } from "@/components/auth/AuthContext";
import { honoClient } from "@/components/fetcher";
import { Location } from "@/components/home/Location";
import {
  Button,
  Text,
  TextInput,
} from "@/components/injector/ReactNativePaper";
import { Image } from "@/components/ui/Image";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Divider, TextInput as RNTextInput } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

export default function App() {
  const { session } = useSession();
  const router = useRouter();
  const { location: defaultLocation } = useLocalSearchParams();
  const [dateOpen, setDateOpen] = useState(false);
  const [location, setLocation] = useState((defaultLocation as string) ?? "");
  const [members, setMembers] = useState(0);
  const [range, setRange] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({
    startDate: undefined,
    endDate: undefined,
  });
  const { data: popular } = useQuery({
    queryKey: ["popular"],
    queryFn: () =>
      honoClient.search.popular.$get().then(async (res) => await res.json()),
  });
  const { data: history } = useQuery({
    queryKey: ["history", session?.id],
    queryFn: () =>
      session
        ? honoClient.search.history.$get().then(async (res) => await res.json())
        : [],
  });

  return (
    <ScrollView className="flex flex-1 flex-col bg-background">
      <View className="relative mb-[24vh] h-2/5">
        <Image
          className="w-full bg-[#0553]"
          source={require("@/assets/images/landscape.webp")}
          contentFit="cover"
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

          <View className="flex w-5/6 gap-3">
            <TextInput
              mode="outlined"
              placeholder="Type your destination!"
              className="w-full"
              value={location}
              onChangeText={setLocation}
              left={
                <RNTextInput.Icon
                  className="m-auto"
                  icon={(props) => (
                    <FontAwesome
                      className="m-auto"
                      name="location-arrow"
                      {...props}
                    />
                  )}
                  color="black"
                  size={25}
                />
              }
            />
            <View className="flex w-full max-w-full flex-1 flex-row justify-between">
              <TouchableOpacity
                className="w-[49%]"
                onPress={() => setDateOpen(true)}
              >
                <TextInput
                  mode="outlined"
                  readOnly
                  placeholder={
                    range.startDate && range.endDate
                      ? `${range.startDate.toLocaleDateString()} - ${range.endDate.toLocaleDateString()}`
                      : "Period"
                  }
                  left={
                    <RNTextInput.Icon
                      className="m-auto"
                      icon={(props) => (
                        <FontAwesome
                          className="m-auto"
                          name="calendar"
                          {...props}
                        />
                      )}
                      color="black"
                      size={25}
                    />
                  }
                />
              </TouchableOpacity>

              <TextInput
                mode="outlined"
                keyboardType="number-pad"
                placeholder="1 adult(s)"
                className="w-[49%]"
                value={members.toString()}
                onChangeText={(text) => {
                  setMembers(Number.parseInt(text) || 0);
                }}
                left={
                  <RNTextInput.Icon
                    className="m-auto"
                    icon={(props) => (
                      <FontAwesome className="m-auto" name="user" {...props} />
                    )}
                    color="black"
                    size={25}
                  />
                }
              />
            </View>

            <Button
              onPress={() => {
                router.push(
                  `/search?location=${location}&members=${members}&startDate=${range.startDate?.toLocaleDateString("en-US")}&endDate=${range.endDate?.toLocaleDateString("en-US")}`,
                );
              }}
              mode="contained"
              className="w-full"
            >
              Start planning!
            </Button>
          </View>
        </View>
      </View>

      <Divider />

      <View className="mt-6 flex gap-2 p-6 pt-0">
        <Text className="font-extrabold text-xl">Most requested</Text>
        <ScrollView
          horizontal
          contentContainerStyle={{
            columnGap: 12,
          }}
        >
          {popular?.map((search) => (
            <Location
              key={search.id}
              image={search.image}
              imageAttribs={search.imageAttributes}
              name={search.name}
              id={search.id}
            />
          ))}
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
          {history?.map((search) => (
            <Location
              key={search.id}
              image={search.image}
              imageAttribs={search.imageAttributes}
              name={search.title}
              id={search.id}
              restore
            />
          ))}
        </ScrollView>
      </View>

      <DatePickerModal
        locale="en"
        label="Select the range"
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
