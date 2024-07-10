import { Image } from "expo-image";
import { View } from "../ui/Themed";

export function Location() {
  return (
    <View className="relative w-44 h-28">
      <Image
        source={require("@/assets/images/landscape.webp")}
        className="w-full"
        contentFit="cover"
      />
    </View>
  );
}
