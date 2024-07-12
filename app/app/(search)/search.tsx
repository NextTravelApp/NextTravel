import { honoClient } from "@/components/fetcher";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function SearchPage() {
  const { location, members, startDate, endDate } = useLocalSearchParams();
  const query = useQuery({
    queryKey: ["search", location, members, startDate, endDate],
    queryFn: async () => {
      if (!location || !members || !startDate || !endDate) return null;

      const parsedStart = format(startDate as string, "yyyy-MM-dd");
      const parsedEnd = format(endDate as string, "yyyy-MM-dd");

      const res = await honoClient.search
        .$post({
          json: {
            location: location as string,
            members: Number.parseInt(members as string),
            startDate: parsedStart,
            endDate: parsedEnd,
          },
        })
        .then(async (res) => await res.json());

      console.log(res);

      return res;
    },
  });

  console.log(query);
  return <View />;
}
