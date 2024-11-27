import { useSession } from "@/components/auth/AuthContext";
import { useFetcher } from "@/components/fetcher";
import { LocationList } from "@/components/home/Location";
import { i18n } from "@/components/i18n/LocalesHandler";
import { useQuery } from "@tanstack/react-query";

const History = () => {
  const { session } = useSession();
  const { fetcher } = useFetcher();
  const history = useQuery({
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

  return (
    <LocationList
      locations={
        (history.data &&
          "map" in history.data &&
          history.data?.map((item) => ({
            image: item.image,
            imageAttribs: item.imageAttributes,
            name: item.title,
            id: item.id,
          }))) ||
        []
      }
      title={i18n.t("account.history")}
    />
  );
};

export default History;
