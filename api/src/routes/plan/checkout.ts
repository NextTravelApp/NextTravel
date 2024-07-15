import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { responseType } from "../../constants/ai";
import type { Variables } from "../../constants/context";
import prisma from "../../lib/prisma";
import { getAccomodation } from "../../lib/retriever/accomodations";
import { getAttraction } from "../../lib/retriever/attractions";
import { getTransport } from "../../lib/retriever/transports";
import { authenticated } from "../../middlewares/auth";

export type CheckoutItem = {
  type: "attraction" | "accomodation" | "transport";
  name: string;
  provider: string;
  price: number;
};

export type CheckoutResponse = {
  items: CheckoutItem[];
};

export const checkoutRoute = new Hono<{ Variables: Variables }>().post(
  "/",
  authenticated,
  zValidator(
    "json",
    z.object({
      id: z.string(),
    }),
  ),
  async (ctx) => {
    const body = ctx.req.valid("json");
    const user = ctx.get("user");

    const plan = await prisma.searchRequest.findUnique({
      where: {
        id: body.id,
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
          });
      }

      if (step.transportId) {
        const transport = await getTransport(step.transportId);

        if (transport)
          items.push({
            type: "transport",
            name: `${transport.from} - ${transport.to}`,
            provider: step.transportId.split("_")[0],
            price: transport.price,
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

    return ctx.json({
      items,
    } as CheckoutResponse);
  },
);
