import { FontAwesome } from "@expo/vector-icons";
import { Link, usePathname, useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { useTheme } from "../Theme";
import { Text } from "../injector";

export type NavbarProps = {
  title: string;
  back?: boolean;
};

export function Navbar(props: NavbarProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathName = usePathname();

  return (
    <View className="flex w-full flex-row items-center justify-between">
      <View className="flex flex-row items-center gap-6">
        {props.back && (
          <Pressable onPress={() => router.back()}>
            <FontAwesome name="angle-left" size={25} color={theme.text} />
          </Pressable>
        )}

        <Text className="font-extrabold text-3xl">{props.title}</Text>
      </View>

      <Link href="/account">
        <FontAwesome
          name="user-circle"
          size={25}
          color={pathName === "/account" ? theme.primary : theme.text}
        />
      </Link>
    </View>
  );
}
