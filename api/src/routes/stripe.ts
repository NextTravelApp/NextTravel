import { Hono } from "hono";
import type { Stripe } from "stripe";
import prisma from "../lib/prisma";
import { stripe } from "../lib/stripe";

export const stripeRoute = new Hono().post("/webhook", async (ctx) => {
  const signature = ctx.req.header("stripe-signature");

  try {
    if (!signature) {
      return ctx.json({ error: true }, 400);
    }

    const body = await ctx.req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );

    if (event.type !== "checkout.session.completed")
      return ctx.json({ success: true }, 200);

    const session = event.data.object as Stripe.Checkout.Session;
    const planId = session.metadata?.id ?? "";

    await prisma.searchRequest.update({
      where: {
        id: planId,
      },
      data: {
        paid: true,
      },
    });

    return ctx.json({ success: true }, 200);
  } catch (err) {
    const errorMessage = `⚠️  Webhook signature verification failed. ${
      err instanceof Error ? err.message : "Internal server error"
    }`;

    console.log(errorMessage);
    return ctx.json({ error: true, message: errorMessage }, 400);
  }
});
