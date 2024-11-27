import { Hono } from "hono";
import { localesToObject } from "locales";
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
            notificationTokens: true,
            language: true,
          },
        },
      },
    });

    for (const plan of plans) {
      for (const token of plan.user.notificationTokens) {
        const notification =
          localesToObject()[plan.user.language ?? "en"].notifications
            .resume_plan;

        await sendNotification(token, {
          title: notification.title,
          body: notification.body.replace(
            "{{title}}",
            (plan.response as responseType)?.title,
          ),
        });
      }
    }

    return ctx.json({ success: true });
  })
  .post("/reset-month", async (ctx) => {
    await prisma.user.updateMany({
      data: {
        searches: 0,
      },
    });

    return ctx.json({ success: true });
  });
