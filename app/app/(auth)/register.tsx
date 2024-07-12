import { useSession } from "@/components/auth/AuthContext";
import { honoClient } from "@/components/fetcher";
import { Button, Input, Text, View } from "@/components/ui/Themed";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

export default function Register() {
  const { login } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View className="flex flex-1 flex-col bg-background">
      <Input
        placeholder="Name"
        autoComplete="name"
        value={name}
        onChangeText={setName}
      />
      <Input
        placeholder="Email"
        keyboardType="email-address"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Input
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button
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
