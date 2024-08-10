import { useTheme } from "@/components/Theme";
import { useSession } from "@/components/auth/AuthContext";
import { honoClient } from "@/components/fetcher";
import { Location } from "@/components/home/Location";
import { i18n } from "@/components/i18n";
import { getLocale } from "@/components/i18n/LocalesHandler";
import { Button, MapView, Text, TextInput } from "@/components/injector";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
        ? honoClient.plan.history
            .$get()
            .then(async (res) => await res.json())
            .then((data) => {
              if ("t" in data) throw new Error("Invalid session");
              return data;
            })
        : [],
    staleTime: 1000 * 60,
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
        <View className="flex w-full flex-row items-center justify-between">
          <Text className="font-extrabold text-3xl">
            Welcome back, {session?.name ?? "Unknown"}
          </Text>

          <Link href="/account">
            <FontAwesome name="user-circle" size={25} color={theme.text} />
          </Link>
        </View>

        <View className="flex w-full flex-1 gap-3 rounded-xl bg-card p-3">
          <MapView
            initialRegion={{
              latitude: 41.9028,
              longitude: 12.4964,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={{ height: 200 }}
            className="rounded-xl"
            userInterfaceStyle={theme.colorScheme}
            onPress={(_e) => {
              // TODO: Implement map selection
            }}
          />

          <TextInput
            mode="outlined"
            placeholder={i18n.t("home.destination")}
            className="w-full bg-white"
            value={location}
            onChangeText={setLocation}
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
                className="bg-white"
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
                className="bg-white"
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
          {history &&
            "map" in history &&
            history?.map((plan) => (
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
        <TouchableWithoutFeedback
          onPress={() => {
            if (Platform.OS !== "web") Keyboard.dismiss();
          }}
        >
          <Dialog visible={membersOpen} onDismiss={() => setMembersOpen(false)}>
            <Dialog.Title>{i18n.t("home.members.title")}</Dialog.Title>
            <Dialog.Content>
              {members.every((m) => m < 18) && (
                <Text className="mb-4">
                  {i18n.t("home.members.description")}
                </Text>
              )}

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
                      newMembers[index] = Number.parseInt(value) || 0;
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
        </TouchableWithoutFeedback>
      </Portal>
    </ScrollView>
  );
};

export default App;
