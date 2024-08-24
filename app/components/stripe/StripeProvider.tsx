import { StripeProvider as RNStripeProvider } from "@stripe/stripe-react-native";
import type { ReactElement } from "react";

export function StripeProvider({
  children,
}: { children: ReactElement | ReactElement[] }) {
  return (
    <RNStripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE as string}
      urlScheme="nexttravel"
      merchantIdentifier="app.nexttravel.app"
    >
      {children}
    </RNStripeProvider>
  );
}
