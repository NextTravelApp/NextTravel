import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function SafeAreaView(props: View["props"]) {
  const insets = useSafeAreaInsets();

  return (
    <View
      {...props}
      style={[
        props.style,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
        },
      ]}
    />
  );
}
