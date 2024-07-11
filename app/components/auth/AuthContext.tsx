import { useQuery } from "@tanstack/react-query";
import type { User } from "database";
import { type PropsWithChildren, createContext, useContext } from "react";
import { axiosClient } from "../fetcher";
import { useStorageState } from "../useStorageState";

export type AuthContextType = {
  session: User | null;
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
  const { data: session } = useQuery<User | null>({
    queryKey: ["session", token],
    queryFn: () =>
      token ? axiosClient.get<User>("/auth/me").then((res) => res.data) : null,
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
