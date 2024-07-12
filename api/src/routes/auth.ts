import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import prisma from "../lib/prisma";
import { loginSchema, registerSchema } from "../constants/requests";
import { signToken } from "../lib/tokens";
import { authenticated } from "../middlewares/auth";
import { hashSync, verifySync } from "@node-rs/argon2";

export const authRoute = new Hono()
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
    const payload = ctx.get("jwtPayload");
    const user = await prisma.user.findUnique({
      where: {
        id: payload.user,
      },
    });

    return ctx.json(user);
  });
