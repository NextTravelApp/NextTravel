import { useTheme } from "@/components/Theme";
import { honoClient } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { Button, Text, TextInput } from "@/components/injector";
import Banner from "@/components/svg/Banner";
import { Alert } from "@/components/ui/Alert";
import { ExtraStyles } from "@/components/ui/ExtraStyles";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TextInput as RNTextInput } from "react-native-paper";

const Forgot = () => {
  const theme = useTheme();
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
                style={ExtraStyles.icons}
              />
            }
          />
          <Button
            mode="contained"
            className="w-full"
            onPress={() => {
              honoClient.auth.password.forgot
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
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Forgot;
