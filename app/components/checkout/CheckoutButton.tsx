import {
  StripeProvider,
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { useEffect } from "react";
import { Button } from "../injector/ReactNativePaper";

export function CheckoutButton({
  customer,
  ephemeralKey,
  paymentIntent,
}: {
  customer: string;
  ephemeralKey: string;
  paymentIntent: string;
}) {
  useEffect(() => {
    if (!customer || !ephemeralKey || !paymentIntent) return;

    initPaymentSheet({
      merchantDisplayName: "NextTravel",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
    });
  }, [customer, ephemeralKey, paymentIntent]);

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLIC_KEY as string}
    >
      <Button
        onPress={() => presentPaymentSheet()}
        className="w-full"
        mode="contained"
      >
        Checkout
      </Button>
    </StripeProvider>
  );
}
