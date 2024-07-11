import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const token =
  Platform.OS === "web"
    ? typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null
    : SecureStore.getItem("token");

export const axiosClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : undefined,
  },
});
