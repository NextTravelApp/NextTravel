import { Text as DefaultText, View as DefaultView } from "react-native";

export function View(props: DefaultView["props"]) {
  return <DefaultView {...props} className={`${props.className || ""}`} />;
}

export function Text(props: DefaultText["props"]) {
  return (
    <DefaultText {...props} className={`text-text ${props.className || ""}`} />
  );
}
