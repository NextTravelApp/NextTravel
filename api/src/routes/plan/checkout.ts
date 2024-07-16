import { Hono } from "hono";
import type { responseType } from "../../constants/ai";
import type { Variables } from "../../constants/context";
import prisma from "../../lib/prisma";
import { getAccomodation } from "../../lib/retriever/accomodations";
import { getAttraction } from "../../lib/retriever/attractions";
import { stripe } from "../../lib/stripe";
import { authenticated } from "../../middlewares/auth";

export type CheckoutItem = {
  type: "attraction" | "accomodation" | "fee";
  name: string;
  provider: string;
  price: number;
  url?: string;
};

export type CheckoutResponse = {
  items: CheckoutItem[];
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
  publishableKey: string;
};

export const checkoutRoute = new Hono<{ Variables: Variables }>().post(
  "/:id",
  authenticated,
  async (ctx) => {
    const id = ctx.req.param("id");
    const user = ctx.get("user");

    const plan = await prisma.searchRequest.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!plan)
      return ctx.json(
        {
          t: "not_found",
        },
        {
          status: 404,
        },
      );

    const data = plan.response as responseType;
    const items: CheckoutItem[] = [];

    for (const step of data.plan) {
      if (step.attractionId) {
        const attraction = await getAttraction(step.attractionId);

        if (attraction)
          items.push({
            type: "attraction",
            name: attraction.name,
            provider: step.attractionId.split("_")[0],
            price: attraction.price,
            url: attraction.checkoutUrl,
          });
      }
    }

    if (data.accomodationId) {
      const accomodation = await getAccomodation(data.accomodationId);

      if (accomodation)
        items.push({
          type: "accomodation",
          name: accomodation.name,
          provider: data.accomodationId.split("_")[0],
          price: accomodation.price,
        });
    }

    const total = items.reduce((acc, item) => acc + item.price, 0);
    const fees = total * 0.1;
    items.push({
      type: "fee",
      name: "NextTravel Fees",
      provider: "nexttravel",
      price: fees,
    });

    let customer = user.stripeId;
    if (!customer)
      customer = (
        await stripe.customers.create({
          name: user.name,
          email: user.email,
        })
      ).id;

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer },
      {
        apiVersion: "2024-06-20",
      },
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(fees * 100),
      currency: "eur",
      customer,
      description: "NextTravel Payment",
      metadata: { id },
    });

    return ctx.json({
      items,
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer,
      publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLIC_KEY as string,
    } as CheckoutResponse);
  },
);
