import { useMutation, useQueryClient } from "@tanstack/react-query";
import { View } from "react-native";
import { Switch } from "react-native-paper";
import { useFetcher } from "../fetcher";
import { i18n } from "../i18n/LocalesHandler";
import { Text } from "../injector";

export function PlanSettings({
  id,
  public: isPublic,
  bookmark: isBookmarked,
}: {
  id: string;
  public: boolean;
  bookmark: boolean;
}) {
  const queryClient = useQueryClient();
  const { fetcher } = useFetcher();
  const bookmark = useMutation({
    mutationFn: (bookmark: boolean) =>
      fetcher.plan[":id"].$patch({
        param: {
          id: id as string,
        },
        json: {
          bookmark,
        },
      }),
    onSettled: async () =>
      await queryClient.invalidateQueries({ queryKey: ["plan", id] }),
  });
  const publishPost = useMutation({
    mutationFn: (publicPost: boolean) =>
      fetcher.plan[":id"].$patch({
        param: {
          id: id as string,
        },
        json: {
          public: publicPost,
        },
      }),
    onSettled: async () =>
      await queryClient.invalidateQueries({ queryKey: ["plan", id] }),
  });

  return (
    <View>
      <Text className="!font-bold mt-3 text-2xl">
        {i18n.t("settings.title")}
      </Text>
      <View className="flex flex-row items-center justify-between">
        <Text>{i18n.t("plan.checkout.public")}</Text>
        <Switch
          value={publishPost.isPending ? publishPost.variables : isPublic}
          onValueChange={() => {
            publishPost.mutate(!isPublic);
          }}
        />
      </View>
      <View className="mt-2 flex flex-row items-center justify-between">
        <Text>{i18n.t("plan.checkout.bookmark")}</Text>
        <Switch
          value={bookmark.isPending ? bookmark.variables : isBookmarked}
          onValueChange={() => {
            bookmark.mutate(!isBookmarked);
          }}
        />
      </View>
    </View>
  );
}
