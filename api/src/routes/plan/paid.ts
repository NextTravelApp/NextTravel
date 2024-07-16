import { Hono } from "hono";
import type { Variables } from "../../constants/context";
import prisma from "../../lib/prisma";
import { authenticated } from "../../middlewares/auth";

export const paidRoute = new Hono<{ Variables: Variables }>().get(
  "/list",
  authenticated,
  async (ctx) => {
    const user = ctx.get("user");

    const plans = await prisma.searchRequest.findMany({
      where: {
        userId: user.id,
        paid: true,
      },
    });

    return ctx.json(plans);
  },
);
