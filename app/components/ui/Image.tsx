import { Image as DefaultImage } from "expo-image";
import { remapProps } from "nativewind";

const RemappedImage = remapProps(DefaultImage, {
  className: "style",
});

export function Image(props: DefaultImage["props"]) {
  const { className, ...rest } = props;

  return <RemappedImage className={`flex-1 ${className || ""}`} {...rest} />;
}
