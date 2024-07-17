import { useSession } from "@/components/auth/AuthContext";
import { SafeAreaView, Text } from "@/components/injector";
import { FontAwesome } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const Account = () => {
  const { session, isLoading } = useSession();

  if (isLoading) return <ActivityIndicator className="m-auto" size="large" />;
  if (!session) return <Redirect href="/login" />;

  return (
    <SafeAreaView className="flex flex-1 flex-col bg-background p-4">
      <View className="flex w-full items-center">
        <FontAwesome name="user-circle-o" size={80} color="gray" />
        <Text className="text-2xl">{session.name}</Text>
      </View>
    </SafeAreaView>
  );
};

export default Account;
