import LottieView from "lottie-react-native";

export function AnimatedLogo({
  height = 306,
  width = 306,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <LottieView
      autoPlay
      loop
      style={{
        width,
        height,
      }}
      webStyle={{
        width,
        height,
      }}
      source={require("@/assets/animations/logo.json")}
    />
  );
}
