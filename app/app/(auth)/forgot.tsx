import { useTheme } from "@/components/Theme";
import { useFetcher } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { Button, TextInput } from "@/components/injector";
import Plane from "@/components/svg/Plane";
import { Alert } from "@/components/ui/Alert";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Forgot = () => {
  const theme = useTheme();
  const router = useRouter();
  const { fetcher } = useFetcher();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [email, setEmail] = useState("");

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (Platform.OS !== "web") Keyboard.dismiss();
      }}
    >
      <View className="flex flex-1 flex-col items-center justify-center gap-3 bg-background">
        <Plane
          color={theme.text}
          style={{
            position: "absolute",
            top: -300,
          }}
          onPress={() => router.push("/auth")}
        />

        <View className="m-auto flex w-5/6 flex-col items-center justify-center gap-3">
          <TextInput
            mode="outlined"
            placeholder="Email"
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
            className="w-full"
          />
          <Button
            mode="contained"
            className="w-full"
            onPress={() => {
              fetcher.auth.password.forgot
                .$post({ json: { email } })
                .then(async (res) => await res.json())
                .then((data) => {
                  if ("t" in data) {
                    setError(
                      i18n.t(`errors.${data.t || "auth.invalid_email"}`),
                    );
                  } else {
                    setSuccess(i18n.t("account.password_reset"));
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

export default Forgot;
