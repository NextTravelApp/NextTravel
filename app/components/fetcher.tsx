import type { AppType } from "api";
import { nativeApplicationVersion } from "expo-application";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
// @ts-expect-error Metro seems to not be able to find the package
import { hc } from "hono/dist/client/client";
import type { Client } from "hono/dist/types/client/types";
import type { UnionToIntersection } from "hono/utils/types";
import { Platform } from "react-native";

const token =
  Platform.OS === "web"
    ? typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null
    : SecureStore.getItem("token");

let headers = {};
if (token) {
  headers = {
    Authorization: `Bearer ${token}`,
  };
}

export const honoClient: UnionToIntersection<Client<AppType>> = hc<AppType>(
  process.env.EXPO_PUBLIC_API_URL as string,
  {
    headers: {
      ...headers,
      "User-Agent": `NextTravel/${
        Constants.appOwnership === "expo" ? "expo-go" : nativeApplicationVersion
      }`,
    },
  },
);
