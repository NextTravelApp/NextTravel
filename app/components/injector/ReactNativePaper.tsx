import { cssInterop } from "nativewind";
import {
  Button as RNButton,
  Text as RNText,
  TextInput as RNTextInput,
} from "react-native-paper";

export const Button = cssInterop(RNButton, {
  className: { target: "style" },
  labelClassName: { target: "labelStyle" },
});

export const TextInput = cssInterop(RNTextInput, {
  className: { target: "style" },
});

export const Text = cssInterop(RNText, {
  className: { target: "style" },
});
