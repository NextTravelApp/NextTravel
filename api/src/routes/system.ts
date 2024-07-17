import { Hono } from "hono";
import type { responseType } from "../constants/ai";
import { sendNotification } from "../lib/notifications";
import prisma from "../lib/prisma";
import { system } from "../middlewares/system";

export const systemRoute = new Hono()
  .use("*", system)
  .post("/send-notifications", async (ctx) => {
    const plans = await prisma.searchRequest.findMany({
      where: {
        bookmark: true,
        date: {
          gte: new Date(),
        },
      },
      select: {
        response: true,
        user: {
          select: {
            email: true,
            notificationTokens: {
              select: {
                token: true,
              },
            },
          },
        },
      },
    });

    for (const plan of plans) {
      for (const token of plan.user.notificationTokens) {
        await sendNotification(token.token, {
          title: "Don't forget your travel plan!",
          body: `Your ${(plan.response as responseType)?.title} is ready in your app. What are you waiting for?`,
        });
      }
    }

    return ctx.json({ success: true });
  });
