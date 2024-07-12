import { useSession } from "@/components/auth/AuthContext";
import { honoClient } from "@/components/fetcher";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";
import {
  Button,
  Text,
  TextInput,
} from "@/components/injector/ReactNativePaper";

export default function Register() {
  const { login } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View className="flex flex-1 flex-col bg-background">
      <TextInput
        placeholder="Name"
        autoComplete="name"
        value={name}
        onChangeText={setName}
      />
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
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button
        mode="contained"
        onPress={() => {
          honoClient.auth.register
            .$post({
              json: {
                name,
                email,
                password,
                confirmPassword,
              },
            })
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
    </View>
  );
}
