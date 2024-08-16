import { useTheme } from "@/components/Theme";
import { useFetcher } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { Button, TextInput } from "@/components/injector";
import Plane from "@/components/svg/Plane";
import { Alert } from "@/components/ui/Alert";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Reset = () => {
  const theme = useTheme();
  const { fetcher } = useFetcher();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (Platform.OS !== "web") Keyboard.dismiss();
      }}
    >
      <View className="flex flex-1 flex-col items-center justify-center gap-3 bg-background">
        <Link
          href="/auth"
          style={{
            position: "absolute",
            top: -300,
            right: 60,
          }}
        >
          <Plane color={theme.text} />
        </Link>

        <View className="m-auto flex w-5/6 flex-col items-center justify-center gap-3">
          <TextInput
            mode="outlined"
            placeholder={i18n.t("account.current_password")}
            secureTextEntry
            textContentType="password"
            value={current}
            onChangeText={setCurrent}
            className="w-full"
          />
          <TextInput
            mode="outlined"
            placeholder="Password"
            secureTextEntry
            textContentType="newPassword"
            value={password}
            onChangeText={setPassword}
            className="w-full"
          />
          <TextInput
            mode="outlined"
            placeholder={i18n.t("account.confirm_password")}
            secureTextEntry
            textContentType="newPassword"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            className="w-full"
          />
          <Button
            mode="contained"
            className="w-full"
            onPress={() => {
              fetcher.auth.password.reset
                .$post({ json: { current, password, confirmPassword } })
                .then(async (res) => await res.json())
                .then((data) => {
                  if ("t" in data) {
                    setError(
                      i18n.t(`errors.${data.t || "auth.invalid_email"}`),
                    );
                  } else {
                    setSuccess(i18n.t("account.password_changed"));
                  }
                });
            }}
          >
            {i18n.t("account.submit")}
          </Button>
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
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Reset;
