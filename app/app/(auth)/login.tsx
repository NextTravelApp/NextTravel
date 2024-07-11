import { useSession } from "@/components/auth/AuthContext";
import { axiosClient } from "@/components/fetcher";
import { Button, Input, View, Text } from "@/components/ui/Themed";
import { useState } from "react";

export default function App() {
  const { login } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex flex-1 flex-col bg-background">
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
      <Button
        onPress={() => {
          axiosClient
            .post("/auth/login", { email, password })
            .then((res) => res.data)
            .then(({ token }) => login(token))
            .catch(console.error);
        }}
      >
        <Text>Submit</Text>
      </Button>
    </View>
  );
}
