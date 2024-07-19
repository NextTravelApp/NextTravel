import type { ReactElement } from "react";

export function StripeProvider({
  children,
}: { children: ReactElement | ReactElement[] }) {
  return children;
}
