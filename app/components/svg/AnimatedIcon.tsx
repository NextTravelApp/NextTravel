import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import Plane from "./Plane";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const radius = 100;
const circumference = radius * Math.PI * 2;
const duration = 3000;

const SvgCircle = () => {
  const angle = useSharedValue(0);

  const percentage = useDerivedValue(() => {
    const number = (angle.value / (2 * Math.PI)) * 100;
    return withTiming(number, { duration: duration });
  });

  const strokeColor = useDerivedValue(() => {
    return interpolateColor(
      percentage.value,
      [0, 50, 100],
      ["rgb(246, 79, 89)", "rgb(246, 246, 89)", "rgb(79, 246, 89)"],
    );
  });

  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: withTiming(
        circumference - (angle.value / (2 * Math.PI)) * circumference,
        { duration: duration },
      ),
      stroke: strokeColor.value,
    };
  });

  const animatedPlaneStyle = useAnimatedStyle(() => {
    const x = 50 + radius * Math.cos(angle.value);
    const y = 50 + radius * Math.sin(angle.value);
    const rotation = angle.value * (180 / Math.PI); // Convert radians to degrees

    return {
      position: "absolute",
      transform: [
        { translateX: x - 10 }, // Adjust the position to center the plane
        { translateY: y - 10 }, // Adjust the position to center the plane
        { rotate: `${rotation}deg` }, // Rotate the plane
      ],
    };
  });

  useEffect(() => {
    angle.value = withRepeat(
      withTiming(2 * Math.PI, { duration: duration, easing: Easing.linear }),
      -1, // -1 for infinite repeat
      false, // Set to false to ensure it doesn't reverse
    );
  }, [angle]);

  return (
    <View style={{ flex: 1 }}>
      <Svg height="50%" width="50%" viewBox="0 0 100 100">
        <AnimatedCircle
          animatedProps={animatedCircleProps}
          cx="50"
          cy="50"
          r="45"
          stroke="rgb(246, 79, 89)"
          strokeWidth="5"
          fill="rgba(255,255,255,0.2)"
          strokeDasharray={`${radius * Math.PI * 2}`}
        />
      </Svg>
      <Animated.View style={animatedPlaneStyle}>
        <Plane color="blue" />
      </Animated.View>
    </View>
  );
};

export default SvgCircle;
