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
  login: (token: string) => Promise<void>;
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

  const fetchSession = async () => {
    setLoading(true);

    if (!token) {
      setSession(undefined);
      setLoading(false);
      return;
    }

    const data = await honoClient.auth.me
      .$get()
      .then(async (res) => await res.json());

    if (!("id" in data)) {
      setSession(undefined);
      setLoading(false);
      throw new Error("Invalid session data");
    }

    setSession(data);
    setLoading(false);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Token is used
  useEffect(() => {
    fetchSession();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        session: session || null,
        isLoading: isLoading || loading,
        login: async (token: string) => {
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

          await fetchSession();
        },
        logout: () => setToken(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
