import { Link } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import type { ComponentProps } from "react";
import { Platform } from "react-native";

export function ExternalLink(
  props: Omit<ComponentProps<typeof Link>, "href"> & { href: string },
) {
  if (props.href.startsWith("/") || props.href.startsWith("#")) {
    return (
      // @ts-ignore
      <Link {...props} />
    );
  }

  return (
    <Link
      target="_blank"
      {...props}
      // @ts-ignore
      href={props.href}
      onPress={(e) => {
        if (Platform.OS !== "web") {
          e.preventDefault();
          openBrowserAsync(props.href as string);
        }
      }}
    />
  );
}
