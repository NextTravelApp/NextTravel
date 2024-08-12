import { useTheme } from "@/components/Theme";
import { useSession } from "@/components/auth/AuthContext";
import { useFetcher } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { Button, TextInput } from "@/components/injector";
import Plane from "@/components/svg/Plane";
import { Alert } from "@/components/ui/Alert";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Login = () => {
  const theme = useTheme();
  const { login } = useSession();
  const { fetcher } = useFetcher();
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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

        <View className="m-auto flex w-5/6 flex-col items-center justify-center gap-3 pt-20">
          <TextInput
            mode="outlined"
            placeholder="Name"
            autoComplete="name"
            textContentType="name"
            value={name}
            onChangeText={setName}
            className="w-full"
          />
          <TextInput
            mode="outlined"
            placeholder="Email"
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            textContentType="username"
            value={email}
            onChangeText={setEmail}
            className="w-full"
          />
          <TextInput
            mode="outlined"
            placeholder="Password"
            autoComplete="password"
            secureTextEntry
            textContentType="password"
            value={password}
            onChangeText={setPassword}
            className="w-full"
          />
          <TextInput
            mode="outlined"
            placeholder="Confirm Password"
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
              fetcher.auth.register
                .$post({ json: { name, email, password, confirmPassword } })
                .then(async (res) => await res.json())
                .then((data) => {
                  if ("token" in data) {
                    login(data.token);
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
