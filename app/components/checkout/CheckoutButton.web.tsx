import { Button } from "../injector/ReactNativePaper";
import { ExternalLink } from "../ui/ExternalLink";

export function CheckoutButton({
  url,
}: {
  url: string;
  customer: string;
  ephemeralKey: string;
  paymentIntent: string;
}) {
  return (
    <ExternalLink href={url} asChild>
      <Button className="w-full" mode="contained">
        Checkout
      </Button>
    </ExternalLink>
  );
}
