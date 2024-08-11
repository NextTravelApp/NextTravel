import { useTheme } from "@/components/Theme";
import { honoClient } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { Button, SafeAreaView } from "@/components/injector";
import { LimitScreen } from "@/components/plan/LimitScreen";
import { PlanStep } from "@/components/plan/PlanStep";
import { Agenda } from "@/components/ui/Agenda";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Screens";
import { type DateType, dateEquals, parseDate } from "@/components/utils/dates";
import { useQuery } from "@tanstack/react-query";
import type { responseType } from "api";
import { Link, useLocalSearchParams } from "expo-router";
import { FlatList, View } from "react-native";

const CalendarPage = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const theme = useTheme();
  const { data, isLoading, error } = useQuery({
    queryKey: ["plan", id],
    queryFn: async () => {
      const res = await honoClient.plan[":id"].$get({
        param: {
          id: id as string,
        },
      });

      const data = await res.json();
      if ("t" in data) throw new Error(data.t);

      return {
        ...data,
        response: data.response as responseType,
      };
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  if (isLoading || !data?.response) return <LoadingScreen />;
  if (error && error.message === "month_limit") return <LimitScreen />;
  if (error) return <ErrorScreen error={error.message} />;

  return (
    <SafeAreaView className="flex flex-1 flex-col bg-background px-0">
      <Agenda
        minDate={
          parseDate(data.response.dates[0].date as DateType, true)
            .toISOString()
            .split("T")[0]
        }
        maxDate={
          parseDate(
            data.response.dates[data.response.dates.length - 1]
              .date as DateType,
            true,
          )
            .toISOString()
            .split("T")[0]
        }
        selected={
          parseDate(data.response.dates[0].date as DateType, true)
            .toISOString()
            .split("T")[0]
        }
        renderList={(list) => {
          return (
            <FlatList
              data={data.response.dates
                .filter((item) => {
                  return dateEquals(
                    parseDate(item.date as DateType),
                    new Date(list.selectedDay),
                  );
                })
                .flatMap((item) => item.steps)}
              renderItem={({ item }) => (
                <View className="my-1">
                  <PlanStep key={item.title} {...item} />
                </View>
              )}
              keyExtractor={(item) => `${item.title}-${item.time}`}
            />
          );
        }}
        markedDates={{
          ...data.response.dates.reduce((acc, item) => {
            const date = parseDate(item.date as DateType);
            const month = date.getMonth().toString().padStart(2, "0");
            const dateString = `${date.getFullYear()}-${month}-${date.getDate()}`;

            return {
              // biome-ignore lint/performance/noAccumulatingSpread: This is a small object
              ...acc,
              [dateString]: {
                marked: true,
              },
            };
          }, {}),
        }}
        theme={{
          dotColor: theme.primary,
          calendarBackground: theme.background,
          todayTextColor: theme.primary,
          selectedDayBackgroundColor: theme.primary,
          todayBackgroundColor: theme.background,
          reservationsBackgroundColor: theme.background,
          backgroundColor: theme.background,
          selectedDayTextColor: theme.text,
        }}
      />

      <Link href={`/plan/${id}/checkout`} asChild>
        <Button
          mode="contained"
          className="h-14 w-[93vw] justify-center text-center font-bold"
        >
          {i18n.t("plan.back")}
        </Button>
      </Link>
    </SafeAreaView>
  );
};

export default CalendarPage;
