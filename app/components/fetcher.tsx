import { useQueryClient } from "@tanstack/react-query";
import type { AppType } from "api";
import { nativeApplicationVersion } from "expo-application";
import Constants from "expo-constants";
// @ts-expect-error Metro seems to not be able to find the package
import { hc } from "hono/dist/client/client";
import type { Client } from "hono/dist/types/client/types";
import type { UnionToIntersection } from "hono/utils/types";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useStorageState } from "./useStorageState";

export type ClientType = UnionToIntersection<Client<AppType>>;
export const authenticatedfetcher = (token: string | null) => {
  const headers: {
    [key: string]: string;
  } = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  return hc<AppType>(process.env.EXPO_PUBLIC_API_URL as string, {
    headers: {
      ...headers,
      "User-Agent": `NextTravel/${
        Constants.appOwnership === "expo" ? "expo-go" : nativeApplicationVersion
      }`,
    },
  }) as ClientType;
};

export type FetcherContextType = {
  fetcher: ClientType;
};

export const FetcherContext = createContext<FetcherContextType | null>(null);

export function useFetcher() {
  const value = useContext(FetcherContext);
  if (!value)
    throw new Error("useFetcher must be used within a FetcherProvider");

  return value;
}

export function FetcherProvider({ children }: PropsWithChildren) {
  const [[_, token]] = useStorageState("token");
  const queryClient = useQueryClient();
  const hono = useMemo(() => {
    return authenticatedfetcher(token);
  }, [token]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    queryClient.clear();
  }, [hono]);

  return (
    <FetcherContext.Provider
      value={{
        fetcher: hono,
      }}
    >
      {children}
    </FetcherContext.Provider>
  );
}
