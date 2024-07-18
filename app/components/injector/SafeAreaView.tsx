import { cssInterop } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "../ui/SafeAreaView";

export const SafeAreaView = cssInterop(RNSafeAreaView, {
  className: { target: "style" },
});
