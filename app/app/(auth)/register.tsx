import { useSession } from "@/components/auth/AuthContext";
import { axiosClient } from "@/components/fetcher";
import { Button, Input, Text, View } from "@/components/ui/Themed";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function App() {
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
          axiosClient
            .post("/auth/register", {
              name,
              email,
              password,
              confirmPassword,
            })
            .then((res) => res.data)
            .then(({ token }) => {
              login(token);
              router.push("/");
            })
            .catch(console.error);
        }}
      >
        <Text>Submit</Text>
      </Button>
    </View>
  );
}
