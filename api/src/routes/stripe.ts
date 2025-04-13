import { Hono } from "hono";
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

    if (
      event.type !== "customer.subscription.created" &&
      event.type !== "customer.subscription.updated" &&
      event.type !== "customer.subscription.deleted"
    )
      return ctx.json({ success: true }, 200);

    const metadata = event.data.object.metadata as {
      user: string;
      plan: string;
    };

    switch (event.type) {
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        if (event.data.object.status !== "active")
          return ctx.json({ success: true }, 200);

        await prisma.user.update({
          where: {
            id: metadata.user,
          },
          data: {
            plan: metadata.plan,
          },
        });

        break;
      }
      case "customer.subscription.deleted": {
        await prisma.user.update({
          where: {
            id: metadata.user,
          },
          data: {
            plan: null,
          },
        });

        break;
      }
      default:
        break;
    }

    return ctx.json({ success: true }, 200);
  } catch (err) {
    const errorMessage = `⚠️  Webhook signature verification failed. ${
      err instanceof Error ? err.message : "Internal server error"
    }`;

    console.warn("[Stripe] [Webhook] Error:", errorMessage);
    return ctx.json({ error: true, message: errorMessage }, 400);
  }
});
