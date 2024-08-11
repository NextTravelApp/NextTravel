import { honoClient } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { LimitScreen } from "@/components/plan/LimitScreen";
import { ErrorScreen, LoadingScreen } from "@/components/ui/Screens";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";

const formatDate = (date: string) => {
  const split = date.split("/");
  if (split[0].length === 1) split[0] = `0${split[0]}`;
  if (split[1].length === 1) split[1] = `0${split[1]}`;
  return `${split[2]}-${split[0]}-${split[1]}`;
};

const CreatePlanPage = () => {
  const { location, members, startDate, endDate, t } = useLocalSearchParams<{
    location?: string;
    members?: string;
    startDate?: string;
    endDate?: string;
    t?: string;
  }>();
  const router = useRouter();
  const { error } = useQuery({
    queryKey: ["plan", location, members, startDate, endDate, t],
    queryFn: async () => {
      if (!location || !members || !startDate || !endDate) return null;

      const res = await honoClient.plan.$post({
        json: {
          location: location as string,
          members: members.split(",").map((item) => Number.parseInt(item)),
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      });

      const data = await res.json();
      if ("error" in data)
        // biome-ignore lint/suspicious/noExplicitAny: Errors are not typed
        throw new Error((data as any).error);

      if ("t" in data) throw new Error(data.t);
      if (data.id) router.replace(`/plan/${data.id}`);

      return data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  if (error && error.message === "month_limit") return <LimitScreen />;
  if (error) return <ErrorScreen error={error.message} />;

  return <LoadingScreen title={i18n.t("plan.loading.create")} />;
};

export default CreatePlanPage;
