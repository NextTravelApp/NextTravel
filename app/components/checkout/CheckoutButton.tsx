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
  url: string;
  customer: string;
  ephemeralKey: string;
  paymentIntent: string;
}) {
  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLIC_KEY as string}
    >
      <ProvidedCheckoutButton
        customer={customer}
        ephemeralKey={ephemeralKey}
        paymentIntent={paymentIntent}
      />
    </StripeProvider>
  );
}

function ProvidedCheckoutButton({
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
    <Button
      onPress={() => presentPaymentSheet()}
      className="w-full"
      mode="contained"
    >
      Checkout
    </Button>
  );
}
