import { useTheme } from "@/components/Theme";
import { honoClient } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { Button, SafeAreaView, Text, TextInput } from "@/components/injector";
import Banner from "@/components/svg/Banner";
import { Alert } from "@/components/ui/Alert";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { TextInput as RNTextInput } from "react-native-paper";

const Reset = () => {
  const theme = useTheme();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <SafeAreaView className="flex flex-1 flex-col items-center justify-center gap-3 bg-background">
      <View className="m-auto flex w-5/6 flex-col items-center justify-center gap-3">
        <Banner
          style={{
            marginBottom: 100,
          }}
          color={theme.text}
        />

        <TextInput
          mode="outlined"
          placeholder={i18n.t("account.current_password")}
          secureTextEntry
          value={current}
          onChangeText={setCurrent}
          className="w-full"
          left={
            <RNTextInput.Icon
              icon={(props) => <FontAwesome name="key" {...props} />}
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
        <TextInput
          mode="outlined"
          placeholder={i18n.t("account.confirm_password")}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
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
            honoClient.auth.password.reset
              .$post({ json: { current, password, confirmPassword } })
              .then(async (res) => await res.json())
              .then((data) => {
                if ("t" in data) {
                  setError(i18n.t(`errors.${data.t || "auth.invalid_email"}`));
                } else {
                  setSuccess(i18n.t("account.password_changed"));
                }
              });
          }}
        >
          {i18n.t("account.submit")}
        </Button>
        <View className="flex w-full flex-row justify-between">
          <Text>
            {`${i18n.t("account.remember_password")} `}
            <Link href="/login" className="text-primary">
              {i18n.t("account.login")}
            </Link>
          </Text>
        </View>
      </View>

      <Alert
        title={
          error ? i18n.t("errors.screen.title") : i18n.t("account.success")
        }
        message={error || success}
        onDismiss={() => {
          setError(undefined);
          setSuccess(undefined);
        }}
      />
    </SafeAreaView>
  );
};

export default Reset;