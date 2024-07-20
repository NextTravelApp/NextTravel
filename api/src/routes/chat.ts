import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { Variables } from "../constants/context";
import { chat } from "../lib/ai/chat";
import prisma from "../lib/prisma";
import { authenticated } from "../middlewares/auth";
import { validatorCallback } from "../middlewares/validator";

export const chatRoute = new Hono<{ Variables: Variables }>()
  .post(
    "/",
    authenticated,
    zValidator(
      "json",
      z.object({
        message: z.string(),
      }),
      validatorCallback,
    ),
    async (ctx) => {
      const user = ctx.get("user");
      const body = ctx.req.valid("json");
      const response = await chat(user.id, body.message);

      return ctx.json(response);
    },
  )
  .get("/", authenticated, async (ctx) => {
    const user = ctx.get("user");
    const chat = await prisma.chatMessage.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return ctx.json(chat);
  });
