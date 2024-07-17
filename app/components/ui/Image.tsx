import { Image as DefaultImage } from "expo-image";
import { cssInterop } from "nativewind";

const RemappedImage = cssInterop(DefaultImage, {
  className: {
    target: "style",
  },
});

export function Image(props: DefaultImage["props"]) {
  const { className, ...rest } = props;

  return <RemappedImage {...rest} className={`flex-1 ${className || ""}`} />;
}
