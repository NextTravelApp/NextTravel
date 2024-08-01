import { useTheme } from "@/components/Theme";
import { useSession } from "@/components/auth/AuthContext";
import { honoClient } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { Button, Text, TextInput } from "@/components/injector";
import Banner from "@/components/svg/Banner";
import { Alert } from "@/components/ui/Alert";
import { FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { TextInput as RNTextInput } from "react-native-paper";

const Login = () => {
  const theme = useTheme();
  const { session, login } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (session) router.push("/");
  }, [session, router]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex flex-1 flex-col items-center justify-center gap-3 bg-background">
        <Banner
          style={{
            position: "absolute",
            top: 50,
          }}
          color={theme.text}
        />

        <View className="m-auto flex w-5/6 flex-col items-center justify-center gap-3">
          <TextInput
            mode="outlined"
            placeholder="Email"
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            className="w-full"
            left={
              <RNTextInput.Icon
                icon={(props) => <FontAwesome name="at" {...props} />}
                size={25}
              />
            }
          />
          <TextInput
            mode="outlined"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="w-full"
            left={
              <RNTextInput.Icon
                icon={(props) => <FontAwesome name="lock" {...props} />}
                size={25}
              />
            }
          />
          <Button
            mode="contained"
            className="w-full"
            onPress={() => {
              honoClient.auth.login
                .$post({ json: { email, password } })
                .then(async (res) => await res.json())
                .then(async (data) => {
                  if ("token" in data) {
                    await login(data.token);
                    router.push("/");
                  } else {
                    setError(
                      i18n.t(`errors.${data.t || "auth.invalid_email"}`),
                    );
                  }
                });
            }}
          >
            {i18n.t("account.submit")}
          </Button>
          <View className="flex w-full flex-row justify-between">
            <Text>
              {`${i18n.t("account.new_member")} `}
              <Link href="/register" className="text-primary">
                {`${i18n.t("account.register")} `}
              </Link>
            </Text>

            <Link href="/forgot" className="text-primary">
              {i18n.t("account.forgot_password")}
            </Link>
          </View>
        </View>

        <Alert
          title={i18n.t("errors.screen.title")}
          message={error}
          onDismiss={() => {
            setError(undefined);
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
