import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function SearchPage() {
  const { _location, _members, _startDate, _endDate } = useLocalSearchParams();

  return <View />;
}
