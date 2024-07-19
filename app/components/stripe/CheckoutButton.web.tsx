import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Dialog, Portal } from "react-native-paper";
import { useSession } from "../auth/AuthContext";
import { honoClient } from "../fetcher";
import { i18n } from "../i18n";
import { Button } from "../injector";
import type { CheckoutButtonProps } from "./CheckoutButton";

const stripePromise = loadStripe(process.env.EXPO_PUBLIC_STRIPE as string);

export function CheckoutButton(props: CheckoutButtonProps) {
  const { session } = useSession();
  const [open, setOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | undefined>();

  const fetchClientSecret = async () => {
    const res = await honoClient.premium.subscribe.$post({
      json: { plan: props.plan },
    });

    const data = await res.json();
    if ("success" in data || "error" in data) return "";

    return data.clientSecret || "";
  };

  return (
    <View>
      <Button
        disabled={(session?.plan || "random_traveler") === props.plan}
        mode="contained"
        onPress={() => {
          fetchClientSecret().then(setClientSecret);
          setOpen(true);
        }}
      >
        {(session?.plan || "random_traveler") === props.plan
          ? i18n.t("account.premium.current")
          : i18n.t("account.premium.buy")}
      </Button>

      {open && (
        <Portal>
          <Dialog visible={open} onDismiss={() => setOpen(false)}>
            <Dialog.Content>
              {!clientSecret && (
                <ActivityIndicator size="large" className="m-auto" />
              )}
              {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentElement />
                  <Button mode="contained">Pay</Button>
                </Elements>
              )}
            </Dialog.Content>
          </Dialog>
        </Portal>
      )}
    </View>
  );
}
