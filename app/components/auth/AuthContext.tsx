import type { InferResponseType } from "hono/client";
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { registerForPushNotificationsAsync } from "../NotificationHandler";
import { authenticatedHonoClient, honoClient } from "../fetcher";
import { getLocale } from "../i18n/LocalesHandler";
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
  const [loading, setLoading] = useState(true);
  const [session, setSession] =
    useState<InferResponseType<typeof honoClient.auth.me.$get>>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Refresh with token
  useEffect(() => {
    setLoading(true);

    honoClient.auth.me
      .$get()
      .then(async (res) => await res.json())
      .then((data) => {
        setLoading(false);

        if (!("id" in data)) throw new Error("Invalid session data");
        setSession(data);
      });
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        session: session || null,
        isLoading: isLoading || loading,
        login: (token: string) => {
          setToken(token);

          const honoClient = authenticatedHonoClient(token);

          registerForPushNotificationsAsync();

          honoClient.auth.language
            .$patch({
              json: { language: getLocale() },
            })
            .then(async (res) =>
              console.log(
                `[Locale] Locale updated successfully (${JSON.stringify(await res.json())})`,
              ),
            );
        },
        logout: () => setToken(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
