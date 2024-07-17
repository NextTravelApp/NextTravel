import { useSession } from "@/components/auth/AuthContext";
import { Text } from "@/components/injector";
import { FontAwesome } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const Account = () => {
  const { session, isLoading } = useSession();

  if (isLoading) return <ActivityIndicator className="m-auto" size="large" />;
  if (!session) return <Redirect href="/login" />;

  return (
    <View className="flex flex-1 flex-col bg-background p-4">
      <SafeAreaView>
        <View className="flex w-full items-center">
          <FontAwesome name="user-circle-o" size={80} color="gray" />
          <Text className="text-2xl">{session.name}</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Account;
