import { useQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";
import { type PropsWithChildren, createContext, useContext } from "react";
import { honoClient } from "../fetcher";
import { useStorageState } from "../useStorageState";

export type AuthContextType = {
  session: InferResponseType<typeof honoClient.auth.me.$get> | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function useSession() {
  const value = useContext(AuthContext);
  if (!value)
    throw new Error("useSession must be used within a SessionProvider");

  return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [[isLoading, token], setToken] = useStorageState("token");
  const { data: session } = useQuery({
    queryKey: ["session", token],
    queryFn: () =>
      token
        ? honoClient.auth.me.$get().then(async (res) => await res.json())
        : null,
  });

  return (
    <AuthContext.Provider
      value={{
        session: session || null,
        isLoading,
        login: (token: string) => setToken(token),
        logout: () => setToken(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
