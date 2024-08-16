import { useSession } from "@/components/auth/AuthContext";
import { useFetcher } from "@/components/fetcher";
import { LocationList } from "@/components/home/Location";
import { i18n } from "@/components/i18n";
import { useQuery } from "@tanstack/react-query";

const Bookmarks = () => {
  const { session } = useSession();
  const { fetcher } = useFetcher();
  const bookmarks = useQuery({
    queryKey: ["bookmarks", session?.id],
    queryFn: () =>
      session
        ? fetcher.auth.me.bookmarks.$get().then(async (res) => await res.json())
        : [],
  });

  return (
    <LocationList
      locations={
        (bookmarks.data &&
          "map" in bookmarks.data &&
          bookmarks.data?.map((bookmark) => ({
            image: bookmark.image,
            imageAttribs: bookmark.imageAttributes,
            name: bookmark.title,
            id: bookmark.id,
          }))) ||
        []
      }
      title={i18n.t("account.bookmarks")}
    />
  );
};

export default Bookmarks;
