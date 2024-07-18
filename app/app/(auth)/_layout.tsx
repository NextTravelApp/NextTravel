import { useSession } from "@/components/auth/AuthContext";
import { Slot, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";

const AuthLayout = () => {
  const { session, isLoading } = useSession();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (pathName !== "/login" && pathName !== "/register") return;
    if (isLoading) return;
    if (session) router.push("/account");
  }, [session, isLoading, pathName, router]);

  return <Slot />;
};

export default AuthLayout;
