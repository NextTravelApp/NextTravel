import { useSession } from "@/components/auth/AuthContext";
import { honoClient } from "@/components/fetcher";
import { Location } from "@/components/home/Location";
import { Button, SafeAreaView, Text, TextInput } from "@/components/injector";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Keyboard, ScrollView, TouchableOpacity, View } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { DatePickerModal } from "react-native-paper-dates";

const App = () => {
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
  const [keyboard, setKeyboard] = useState(false);
  const { data: popular } = useQuery({
    queryKey: ["popular"],
    queryFn: () =>
      honoClient.plan.popular.$get().then(async (res) => await res.json()),
  });
  const { data: history } = useQuery({
    queryKey: ["history", session?.id],
    queryFn: () =>
      session
        ? honoClient.plan.history.$get().then(async (res) => await res.json())
        : [],
  });

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => setKeyboard(true));
    Keyboard.addListener("keyboardDidHide", () => setKeyboard(false));
  }, []);

  return (
    <SafeAreaView className="flex flex-1 flex-col bg-background">
      <ScrollView>
        <View className="flex w-full items-center gap-3">
          <Text className="font-extrabold text-2xl">
            Ready for your next travel?
          </Text>

          <View className="flex w-5/6 gap-3">
            <Autocomplete
              data={["Paris"].filter((item) =>
                item.toLowerCase().includes(location.toLowerCase()),
              )}
              value={location}
              onChangeText={setLocation}
              flatListProps={{
                keyExtractor: (item) => item,
                renderItem: ({ item }) => <Text>{item}</Text>,
              }}
              renderResultList={(results) => (
                <ScrollView className="w-full rounded-b-xl bg-card">
                  {(results.data as string[]).map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => setLocation(item)}
                      className="z-10 w-full p-2"
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              // hideResults={!location || !keyboard}
              renderTextInput={(props) => (
                // @ts-expect-error Input doesn't accept same props
                <TextInput
                  mode="outlined"
                  placeholder="Type your destination!"
                  className="w-full"
                  {...props}
                  style={{}}
                />
              )}
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
              />
            </View>

            <Button
              onPress={() => {
                router.push(
                  `/plan?location=${location}&members=${members}&startDate=${range.startDate?.toLocaleDateString("en-US")}&endDate=${range.endDate?.toLocaleDateString("en-US")}`,
                );
              }}
              mode="contained"
              className="w-full"
            >
              Start planning!
            </Button>
          </View>
        </View>

        <View className="mt-6 flex gap-2 p-6 pt-0">
          <Text className="font-extrabold text-xl">Most requested</Text>
          <ScrollView
            horizontal
            contentContainerStyle={{
              columnGap: 12,
            }}
          >
            {popular?.map((plan) => (
              <Location
                key={plan.id}
                image={plan.image}
                imageAttribs={plan.imageAttributes}
                name={plan.name}
                id={plan.id}
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
            {history?.map((plan) => (
              <Location
                key={plan.id}
                image={plan.image}
                imageAttribs={plan.imageAttributes}
                name={plan.title}
                id={plan.id}
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
    </SafeAreaView>
  );
};

export default App;
