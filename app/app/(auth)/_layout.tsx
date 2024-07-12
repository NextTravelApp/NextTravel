import { useSession } from "@/components/auth/AuthContext";
import { Slot, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  const { session, isLoading } = useSession();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (
      !isLoading &&
      session &&
      (pathName === "/login" || pathName === "/register")
    ) {
      router.push("/account");
    }
  }, [session, router, pathName, isLoading]);

  return <Slot />;
}
