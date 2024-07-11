import { useSession } from "@/components/auth/AuthContext";
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && session) {
      router.push("/");
    }
  }, [session, router, isLoading]);

  return <Slot />;
}
