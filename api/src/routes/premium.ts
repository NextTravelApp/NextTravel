import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { Stripe } from "stripe";
import { z } from "zod";
import type { Variables } from "../constants/context";
import { getPlan, plans } from "../constants/premium";
import prisma from "../lib/prisma";
import { stripe } from "../lib/stripe";
import { authenticated } from "../middlewares/auth";
import { validatorCallback } from "../middlewares/validator";

export const premiumRoute = new Hono<{ Variables: Variables }>()
  .get("/plans", async (ctx) => {
    return ctx.json(plans);
  })
  .post(
    "/subscribe",
    authenticated,
    zValidator(
      "json",
      z.object({
        plan: z.string(),
      }),
      validatorCallback,
    ),
    async (ctx) => {
      const user = ctx.get("user");
      const body = ctx.req.valid("json");
      const plan = getPlan(body.plan);

      if (!process.env.EXPO_PUBLIC_ENABLE_STRIPE)
        return ctx.json({ error: "Stripe is not enabled" }, 400);

      if (user.plan === plan.id)
        return ctx.json(
          {
            error: "You are already subscribed to this plan",
          },
          400,
        );

      let stripeId = user.stripeId;
      if (!stripeId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
        });

        stripeId = customer.id;
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeId },
        });
      }

      if (plan.price === 0) {
        const customer = await stripe.customers.retrieve(stripeId);
        if (!customer.deleted) {
          for (const item of customer.subscriptions?.data ?? []) {
            if (item.status !== "active") continue;

            await stripe.subscriptions.cancel(item.id);
          }
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { plan: plan.id },
        });

        return ctx.json({ success: true });
      }

      const items = await stripe.products.search({
        query: `metadata["id"]:"${plan.id}"`,
      });
      const item = items.data.find((item) =>
        process.env.NODE_ENV === "production" ? item.livemode : !item.livemode,
      );

      if (!item) return ctx.json({ error: "Plan not found" }, 400);

      const subscription = await stripe.subscriptions.create({
        customer: stripeId,
        items: [
          {
            price: item.default_price as string,
          },
        ],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          user: user.id,
          plan: plan.id,
        },
      });

      return ctx.json({
        subscriptionId: subscription.id,
        clientSecret: (
          (subscription.latest_invoice as Stripe.Invoice)
            ?.payment_intent as Stripe.PaymentIntent
        )?.client_secret,
      });
    },
  );
