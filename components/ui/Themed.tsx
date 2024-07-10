import {
  Text as DefaultText,
  View as DefaultView,
  TextInput,
  TouchableOpacity,
} from "react-native";

export function View(props: DefaultView["props"]) {
  return <DefaultView {...props} className={`${props.className || ""}`} />;
}

export function Text(props: DefaultText["props"]) {
  return (
    <DefaultText {...props} className={`text-text ${props.className || ""}`} />
  );
}

export function Input(props: TextInput["props"]) {
  return (
    <TextInput
      {...props}
      className={`rounded-lg bg-card p-2 ${props.className || ""}`}
    />
  );
}

export function Button(props: TouchableOpacity["props"]) {
  return (
    <TouchableOpacity
      {...props}
      className={`rounded-lg bg-primary p-2 text-center text-white ${
        props.className || ""
      }`}
    />
  );
}
