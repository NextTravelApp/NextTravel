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

const RemappedTextInput = cssInterop(RNTextInput, {
  className: { target: "style" },
});

const RemappedText = cssInterop(RNText, {
  className: { target: "style" },
});

export function TextInput({
  className,
  ...props
}: React.ComponentProps<typeof RemappedTextInput>) {
  return (
    <RemappedTextInput
      outlineStyle={{
        borderRadius: 15,
      }}
      contentStyle={{
        paddingLeft: 10,
      }}
      className={`bg-card ${className || ""}`}
      {...props}
    />
  );
}

export function Text({
  className,
  ...props
}: React.ComponentProps<typeof RemappedText>) {
  return <RemappedText className={`text-text ${className || ""}`} {...props} />;
}
