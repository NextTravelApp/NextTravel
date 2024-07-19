import { useSession } from "@/components/auth/AuthContext";
import { PlanCard } from "@/components/auth/PlanCard";
import { honoClient } from "@/components/fetcher";
import { i18n } from "@/components/i18n";
import { SafeAreaView, Text } from "@/components/injector";
import { LoadingScreen } from "@/components/ui/Screens";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useQuery } from "@tanstack/react-query";

const Premium = () => {
  const { session, isLoading } = useSession();
  const { data: plans, isLoading: isPlansLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: () =>
      session
        ? honoClient.premium.plans.$get().then(async (res) => await res.json())
        : [],
  });

  if (isLoading || isPlansLoading) return <LoadingScreen />;
  if (!session) return null;

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE as string}
      urlScheme="nexttravel"
      merchantIdentifier="app.nexttravel"
    >
      <SafeAreaView className="flex flex-1 flex-col gap-3 bg-background p-4">
        <Text className="font-extrabold text-4xl">
          {i18n.t("account.premium.title")}
        </Text>

        {plans?.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </SafeAreaView>
    </StripeProvider>
  );
};

export default Premium;
