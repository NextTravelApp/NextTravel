import { useSession } from "@/components/auth/AuthContext";
import { honoClient } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { Button, SafeAreaView, TextInput } from "@/components/injector";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

const Login = () => {
  const { login } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView className="flex flex-1 flex-col items-center justify-center gap-3 bg-background">
      <TextInput
        mode="outlined"
        placeholder="Email"
        keyboardType="email-address"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
        className="w-full"
      />
      <TextInput
        mode="outlined"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="w-full"
      />
      <Button
        mode="contained"
        className="w-full"
        onPress={() => {
          honoClient.auth.login
            .$post({ json: { email, password } })
            .then(async (res) => await res.json())
            .then((data) => {
              if ("token" in data) {
                login(data.token);
                router.push("/");
              } else {
                Alert.alert(data.t);
              }
            });
        }}
      >
        {i18n.t("account.submit")}
      </Button>
    </SafeAreaView>
  );
};

export default Login;
