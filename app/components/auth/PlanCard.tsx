import type { Plan } from "api";
import { View } from "react-native";
import { i18n } from "../i18n";
import { Text } from "../injector";
import { CheckoutButton } from "../stripe/CheckoutButton";

export type PlanCardProps = {
  plan: Plan;
};

type Features = {
  title: string;
  active: boolean;
}[];

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <View className="flex flex-row justify-between rounded-xl bg-card p-6">
      <View>
        <View className="h-2 w-10 rounded-xl bg-primary" />
        <Text className="font-extrabold text-2xl">
          {i18n.t(`account.premium.${plan.id}.title`)}
        </Text>

        {(
          i18n.t<Features>(`account.premium.${plan.id}.features`) as Features
        ).map((item) => (
          <Text
            key={`${plan.id}-${item.title}`}
            className="flex flex-row items-center gap-2 text-lg"
            style={{
              opacity: item.active ? 1 : 0.5,
              textDecorationLine: item.active ? "none" : "line-through",
            }}
          >
            <View className="block h-2 w-2 rounded-full bg-text" /> {item.title}
          </Text>
        ))}
      </View>

      <View className="mt-auto gap-1">
        <Text className="ml-auto text-end font-extrabold text-3xl">
          €{plan.price}
        </Text>

        <CheckoutButton plan={plan.id} />
      </View>
    </View>
  );
}
