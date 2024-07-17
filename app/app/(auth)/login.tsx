import { useSession } from "@/components/auth/AuthContext";
import { honoClient } from "@/components/fetcher";
import { Button, Text, TextInput } from "@/components/injector";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const { login } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex flex-1 flex-col bg-background">
      <SafeAreaView>
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button
          mode="contained"
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
          <Text>Submit</Text>
        </Button>
      </SafeAreaView>
    </View>
  );
};

export default Login;
