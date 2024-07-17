import { useSession } from "@/components/auth/AuthContext";
import { honoClient } from "@/components/fetcher";
import { Button, SafeAreaView, TextInput } from "@/components/injector";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

const Register = () => {
  const { login } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <SafeAreaView className="flex flex-1 flex-col items-center justify-center gap-3 bg-background">
      <TextInput
        className="w-full"
        mode="outlined"
        placeholder="Name"
        autoComplete="name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="w-full"
        mode="outlined"
        placeholder="Email"
        keyboardType="email-address"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="w-full"
        mode="outlined"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        className="w-full"
        mode="outlined"
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button
        className="w-full"
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
        Submit
      </Button>
    </SafeAreaView>
  );
};

export default Register;
