import { remapProps } from "nativewind";
import {
  Button as RNButton,
  TextInput as RNTextInput,
  Text as RNText,
} from "react-native-paper";

export const Button = remapProps(RNButton, {
  className: "style",
  labelClassName: "labelStyle",
});

export const TextInput = remapProps(RNTextInput, {
  className: "style",
});

export const Text = remapProps(RNText, {
  className: "style",
});
