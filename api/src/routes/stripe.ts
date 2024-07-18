import { Hono } from "hono";
import { stripe } from "../lib/stripe";

export const stripeRoute = new Hono().post("/webhook", async (ctx) => {
  const signature = ctx.req.header("stripe-signature");

  try {
    if (!signature) {
      return ctx.json({ error: true }, 400);
    }

    const body = await ctx.req.text();
    const _event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );

    // TODO

    return ctx.json({ success: true }, 200);
  } catch (err) {
    const errorMessage = `⚠️  Webhook signature verification failed. ${
      err instanceof Error ? err.message : "Internal server error"
    }`;

    console.warn("[Stripe] [Webhook] Error:", errorMessage);
    return ctx.json({ error: true, message: errorMessage }, 400);
  }
});
