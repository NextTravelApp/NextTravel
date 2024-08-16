import { useStripe } from "@stripe/stripe-react-native";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "../auth/AuthContext";
import { useFetcher } from "../fetcher";
import { i18n } from "../i18n";
import { Button } from "../injector";

export type CheckoutButtonProps = {
  plan: string;
};

export function CheckoutButton(props: CheckoutButtonProps) {
  const { session } = useSession();
  const { fetcher } = useFetcher();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const subscribe = useMutation({
    mutationFn: async () => {
      const res = await fetcher.premium.subscribe.$post({
        json: { plan: props.plan },
      });

      const data = await res.json();
      if ("success" in data || "error" in data) return data;

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret as string,
        merchantDisplayName: "NextTravel",
        returnURL: process.env.EXPO_PUBLIC_APP_URL,
      });

      if (error) return;
      await presentPaymentSheet();
    },
  });

  return (
    <Button
      disabled={
        !process.env.EXPO_PUBLIC_ENABLE_STRIPE ||
        (session?.plan || "random_traveler") === props.plan
      }
      loading={subscribe.isPending}
      mode="contained"
      onPress={() => subscribe.mutate()}
    >
      {!process.env.EXPO_PUBLIC_ENABLE_STRIPE
        ? i18n.t("account.premium.soon")
        : (session?.plan || "random_traveler") === props.plan
          ? i18n.t("account.premium.current")
          : i18n.t("account.premium.buy")}
    </Button>
  );
}
