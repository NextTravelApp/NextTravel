import { cssInterop } from "nativewind";
import {
  Button as RNButton,
  Text as RNText,
  TextInput as RNTextInput,
} from "react-native-paper";
import { useTheme } from "../Theme";

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
  style,
  outlineStyle,
  contentStyle,
  ...props
}: React.ComponentProps<typeof RemappedTextInput>) {
  const theme = useTheme();

  return (
    <RemappedTextInput
      outlineStyle={[
        {
          borderRadius: 15,
          borderColor: "transparent",
        },
        outlineStyle,
      ]}
      contentStyle={[
        {
          paddingLeft: 10,
        },
        contentStyle,
      ]}
      style={[
        {
          backgroundColor: theme.card,
        },
        style,
      ]}
      className={className}
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
