import { cssInterop } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

export const SafeAreaView = cssInterop(RNSafeAreaView, {
  className: { target: "style" },
});
