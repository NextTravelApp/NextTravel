import { useSession } from "@/components/auth/AuthContext";
import { Redirect, Slot, usePathname } from "expo-router";

const AuthLayout = () => {
  const { session, isLoading } = useSession();
  const pathName = usePathname();

  if (
    !isLoading &&
    session &&
    (pathName === "/login" || pathName === "/register")
  )
    return <Redirect href="/account" />;

  return <Slot />;
};

export default AuthLayout;
