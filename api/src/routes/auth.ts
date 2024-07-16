import { zValidator } from "@hono/zod-validator";
import { hashSync, verifySync } from "@node-rs/argon2";
import { Hono } from "hono";
import { z } from "zod";
import type { Variables } from "../constants/context";
import { loginSchema, registerSchema } from "../constants/requests";
import prisma from "../lib/prisma";
import { signToken } from "../lib/tokens";
import { authenticated } from "../middlewares/auth";

export const authRoute = new Hono<{ Variables: Variables }>()
  .post("/register", zValidator("json", registerSchema), async (ctx) => {
    const body = ctx.req.valid("json");

    const existing = await prisma.user.findFirst({
      where: {
        email: {
          equals: body.email,
          mode: "insensitive",
        },
      },
    });

    if (existing) {
      return ctx.json(
        {
          t: "email_used",
        },
        400,
      );
    }

    const hashedPassword = hashSync(body.password);
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
      },
    });

    const token = await signToken(user.id);

    return ctx.json({
      token,
    });
  })
  .post("/login", zValidator("json", loginSchema), async (ctx) => {
    const body = ctx.req.valid("json");
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      return ctx.json(
        {
          t: "invalid_password",
        },
        401,
      );
    }

    const passwordMatch = verifySync(user.password, body.password);

    if (!passwordMatch) {
      return ctx.json(
        {
          t: "invalid_password",
        },
        401,
      );
    }

    const token = await signToken(user.id);

    return ctx.json({
      token,
    });
  })
  .get("/me", authenticated, async (ctx) => {
    const user = ctx.get("user");
    return ctx.json(user);
  })
  .post(
    "/notification",
    authenticated,
    zValidator(
      "json",
      z.object({
        token: z.string(),
      }),
    ),
    async (ctx) => {
      const user = ctx.get("user");
      const body = ctx.req.valid("json");

      await prisma.notificationToken.create({
        data: {
          token: body.token,
          userId: user.id,
        },
      });

      return ctx.json({ success: true });
    },
  );
