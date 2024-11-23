import { useTheme } from "@/components/Theme";
import { useSession } from "@/components/auth/AuthContext";
import { useFetcher } from "@/components/fetcher";
import { Location } from "@/components/home/Location";
import { i18n } from "@/components/i18n";
import { getLocale } from "@/components/i18n/LocalesHandler";
import { Button, MapView, Text, TextInput } from "@/components/injector";
import { LimitScreen } from "@/components/plan/LimitScreen";
import { Navbar } from "@/components/ui/Navbar";
import { ErrorScreen } from "@/components/ui/Screens";
import { reverseGeocode } from "@/components/utils/maps";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
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

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};

const App = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const { fetcher } = useFetcher();
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
  const [tripTheme, setTripTheme] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { data: popular } = useQuery({
    queryKey: ["popular"],
    queryFn: () =>
      fetcher.plan.popular.$get().then(async (res) => await res.json()),
  });
  const { data: history } = useQuery({
    queryKey: ["history", session?.id],
    queryFn: () =>
      session
        ? fetcher.plan.history
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

  if (error === "month_limit")
    return <LimitScreen back={() => setError(null)} />;
  if (error) return <ErrorScreen back={() => setError(null)} error={error} />;

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
        <Navbar
          title={`${i18n.t("home.title")}${session ? `, ${session.name}` : ""}`}
        />

        <View className="flex w-full flex-1 gap-3 rounded-xl bg-card p-3">
          <MapView
            id="home"
            initialRegion={{
              latitude: 41.9028,
              longitude: 12.4964,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={{ height: 200 }}
            className="rounded-xl"
            userInterfaceStyle={theme.colorScheme}
            onPress={async (e) => {
              const coordinate = e.nativeEvent.coordinate;
              const data = await reverseGeocode(
                fetcher,
                coordinate.latitude,
                coordinate.longitude,
              );

              if (data) setLocation(data);
            }}
          />

          <TextInput
            mode="outlined"
            placeholder={i18n.t("home.destination")}
            className="w-full"
            value={location}
            onChangeText={setLocation}
            style={{ backgroundColor: theme.background }}
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
                    ? `${range.startDate.getDate()}/${range.startDate.getMonth() + 1} - ${range.endDate.getDate()}/${range.endDate.getMonth() + 1}`
                    : ""
                }
                style={{
                  backgroundColor: theme.background,
                }}
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
                style={{ backgroundColor: theme.background }}
              />
            </TouchableOpacity>
          </View>

          {session?.plan === "expert_traveler" ||
            (session?.plan === "free_spirit" && (
              <TextInput
                mode="outlined"
                placeholder={i18n.t("home.theme")}
                className="w-full"
                value={tripTheme}
                onChangeText={setTripTheme}
                style={{ backgroundColor: theme.background }}
              />
            ))}

          <Button
            onPress={async () => {
              if (
                !location ||
                !members.length ||
                !range.startDate ||
                !range.endDate
              )
                return;

              const res = await fetcher.plan.$post({
                json: {
                  location: location,
                  members: members,
                  startDate: formatDate(range.startDate),
                  endDate: formatDate(range.endDate),
                  theme: tripTheme.trim() || undefined,
                },
              });

              const data = await res.json();
              if ("t" in data) {
                setError(data.t);
                return;
              }

              router.push({
                pathname: "/plan/[id]",
                params: { id: data.id },
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
