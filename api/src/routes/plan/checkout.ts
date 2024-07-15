import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { responseType } from "../../constants/ai";
import type { Variables } from "../../constants/context";
import prisma from "../../lib/prisma";
import { authenticated } from "../../middlewares/auth";

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
    const payments = [];

    for (const step of data.plan) {
      if (step.attractionId) {
        payments.push({
          type: "attraction",
        });
      }

      if (step.transportId) {
        payments.push({
          type: "transport",
        });
      }
    }

    payments.push({
      type: "accomodation",
    });

    return ctx.json({
      payments,
    });
  },
);
