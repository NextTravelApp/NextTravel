import { useTheme } from "@/components/Theme";
import { useSession } from "@/components/auth/AuthContext";
import { honoClient } from "@/components/fetcher";
import { Location } from "@/components/home/Location";
import { i18n } from "@/components/i18n";
import { getLocale } from "@/components/i18n/LocalesHandler";
import { Button, Text, TextInput } from "@/components/injector";
import Banner from "@/components/svg/Banner";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Dialog, Portal, TextInput as RNTextInput } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const App = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const router = useRouter();
  const { location: defaultLocation } = useLocalSearchParams<{
    location?: string;
  }>();
  const [dateOpen, setDateOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [location, setLocation] = useState((defaultLocation as string) ?? "");
  const [members, setMembers] = useState<number[]>([]);
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
      honoClient.plan.popular.$get().then(async (res) => await res.json()),
  });
  const { data: history } = useQuery({
    queryKey: ["history", session?.id],
    queryFn: () =>
      session
        ? honoClient.plan.history.$get().then(async (res) => await res.json())
        : [],
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (defaultLocation) setLocation(defaultLocation);
  }, [defaultLocation]);

  return (
    <ScrollView
      className="flex flex-1 flex-col bg-background"
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left + 16,
        paddingRight: insets.right + 16,
      }}
    >
      <View className="flex w-full flex-1 items-center gap-3">
        <Banner
          style={{
            marginBottom: 40,
          }}
          color={theme.text}
        />

        <TextInput
          mode="outlined"
          placeholder={i18n.t("home.destination")}
          className="w-full"
          value={location}
          onChangeText={setLocation}
          left={
            <RNTextInput.Icon
              icon={(props) => <FontAwesome name="location-arrow" {...props} />}
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
              onPress={() => setDateOpen(true)}
              mode="outlined"
              readOnly
              placeholder={i18n.t("home.period")}
              value={
                range.startDate && range.endDate
                  ? `${range.startDate.toLocaleDateString()} - ${range.endDate.toLocaleDateString()}`
                  : ""
              }
              left={
                <RNTextInput.Icon
                  icon={(props) => <FontAwesome name="calendar" {...props} />}
                  size={25}
                />
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[49%]"
            onPress={() => setMembersOpen(true)}
          >
            <TextInput
              onPress={() => setMembersOpen(true)}
              mode="outlined"
              readOnly
              placeholder={i18n.t("home.members_placeholder")}
              value={members.join(", ")}
              left={
                <RNTextInput.Icon
                  icon={(props) => <FontAwesome name="users" {...props} />}
                  size={25}
                />
              }
            />
          </TouchableOpacity>
        </View>

        <Button
          onPress={() => {
            if (
              !location ||
              !members.length ||
              !range.startDate ||
              !range.endDate
            )
              return;

            router.push({
              pathname: "/plan/create",
              params: {
                location,
                members,
                startDate: range.startDate?.toLocaleDateString("en-US"),
                endDate: range.endDate?.toLocaleDateString("en-US"),
                t: Date.now(),
              },
            });
          }}
          mode="contained"
          className="w-full"
        >
          {i18n.t("home.submit")}
        </Button>
      </View>

      <View className="mt-6 flex gap-2">
        <Text className="font-extrabold text-xl">
          {i18n.t("home.most_requested")}
        </Text>
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

      <View className="mt-6 flex gap-2 pb-20">
        <Text className="font-extrabold text-xl">
          {i18n.t("home.last_searches")}
        </Text>
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
        locale={getLocale()}
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

      <Portal>
        <Dialog visible={membersOpen} onDismiss={() => setMembersOpen(false)}>
          <Dialog.Title>{i18n.t("home.members.title")}</Dialog.Title>
          <Dialog.Content>
            <Text>{i18n.t("home.members.description")}</Text>

            <ScrollView>
              {members.map((member, index) => (
                <TextInput
                  // biome-ignore lint/suspicious/noArrayIndexKey: This is a unique key
                  key={index}
                  mode="outlined"
                  keyboardType="numeric"
                  value={member.toString()}
                  onChangeText={(value) => {
                    const newMembers = members.slice();
                    newMembers[index] = Number.parseInt(value);
                    setMembers(newMembers);
                  }}
                  className="!bg-transparent mb-4"
                  right={
                    <RNTextInput.Icon
                      className="m-auto"
                      icon={(props) => (
                        <FontAwesome
                          className="m-auto"
                          name="trash"
                          {...props}
                        />
                      )}
                      size={25}
                      onPress={() => {
                        const newMembers = members.slice();
                        newMembers.splice(index, 1);
                        setMembers(newMembers);
                      }}
                    />
                  }
                />
              ))}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              className="px-4"
              mode="contained-tonal"
              onPress={() => {
                setMembers([...members, 18]);
              }}
            >
              {i18n.t("home.members.add")}
            </Button>
            <Button
              className="px-4"
              mode="contained"
              onPress={() => setMembersOpen(false)}
            >
              {i18n.t("home.members.done")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

export default App;
