import type { AppType } from "api";
import * as SecureStore from "expo-secure-store";
import { hc } from "hono/client";
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

export const honoClient = hc<AppType>(
  process.env.EXPO_PUBLIC_API_URL as string,
  { headers },
);
