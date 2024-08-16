import { useTheme } from "@/components/Theme";
import { useSession } from "@/components/auth/AuthContext";
import { i18n } from "@/components/i18n";
import { Button, SafeAreaView, Text } from "@/components/injector";
import Plane from "@/components/svg/Plane";
import { Link, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

const Auth = () => {
  const theme = useTheme();
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/");
  }, [session, router]);

  if (isLoading) return null;

  return (
    <SafeAreaView className="flex flex-1 flex-col items-center gap-3 bg-background">
      <Text className="mt-10 font-extrabold text-4xl">Welcome!</Text>
      <Text className="-mt-2 text-3xl">Ready to fly?</Text>

      <View className="mt-32 flex w-5/6 flex-col items-center justify-center gap-3">
        <Link href="/login" asChild>
          <Button mode="contained" className="w-full">
            {i18n.t("account.login")}
          </Button>
        </Link>
        <Link href="/register" asChild>
          <Button mode="contained" className="!bg-card w-full">
            <Text className="text-text">{i18n.t("account.register")}</Text>
          </Button>
        </Link>
      </View>

      <Plane
        color={theme.text}
        style={{
          position: "absolute",
          bottom: -200,
        }}
      />
    </SafeAreaView>
  );
};

export default Auth;
