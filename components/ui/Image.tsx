import { Image as DefaultImage } from "expo-image";
import { cssInterop } from "nativewind";

export function Image(props: DefaultImage["props"]) {
  cssInterop(DefaultImage, {
    className: {
      target: "style",
    },
  });

  const { className, ...rest } = props;

  return <DefaultImage className={`flex-1 ${className || ""}`} {...rest} />;
}
