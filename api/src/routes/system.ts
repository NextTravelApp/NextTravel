import { WithText, render } from "email";
import { Hono } from "hono";
import type { responseType } from "../constants/ai";
import { sendEmail, sendNotification } from "../lib/notifications";
import prisma from "../lib/prisma";
import { system } from "../middlewares/system";

export const systemRoute = new Hono()
  .use("*", system)
  .post("/send-notifications", async (ctx) => {
    const plans = await prisma.searchRequest.findMany({
      where: {
        paid: true,
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
          title: "Ready for your travel?",
          body: `Your ${(plan.response as responseType)?.title} is almost here!`,
        });
      }

      await sendEmail(
        plan.user.email,
        "Ready for your travel?",
        render(
          WithText({
            preview: "Your travel is almost here!",
            heading: "Your travel is almost here!",
            text: `Your ${(plan.response as responseType)?.title} is almost here!`,
          }),
        ),
      );
    }

    return ctx.json({ success: true });
  });
