import { hashSync, verifySync } from "@node-rs/argon2";
import { Hono } from "hono";
import { z } from "zod";
import type { Variables } from "../constants/context";
import { loginSchema, registerSchema } from "../constants/requests";
import { signToken } from "../lib/jwt";
import prisma from "../lib/prisma";
import { authenticated } from "../middlewares/auth";
import { zValidator } from "../middlewares/validator";

export const authRoute = new Hono<{ Variables: Variables }>()
  .post("/register", zValidator("json", registerSchema), async (ctx) => {
    const body = ctx.req.valid("json");

    try {
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
    } catch (_) {
      return ctx.json(
        {
          t: "email_used",
        },
        400,
      );
    }
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
          t: "auth.wrong_password",
        },
        401,
      );
    }

    const passwordMatch = verifySync(user.password, body.password);

    if (!passwordMatch) {
      return ctx.json(
        {
          t: "auth.wrong_password",
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
  .get("/me/bookmarks", authenticated, async (ctx) => {
    const user = ctx.get("user");
    const bookmarks = await prisma.searchRequest.findMany({
      where: {
        userId: user.id,
        bookmark: true,
      },
    });

    return ctx.json(bookmarks);
  })
  .get("/me/public", authenticated, async (ctx) => {
    const user = ctx.get("user");
    const requests = await prisma.searchRequest.findMany({
      where: {
        userId: user.id,
        public: true,
      },
    });

    return ctx.json(requests);
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

      await prisma.user.update({
        where: { id: user.id },
        data: {
          notificationTokens: {
            push: body.token,
          },
        },
      });

      return ctx.json({ success: true });
    },
  )
  .patch(
    "/language",
    authenticated,
    zValidator(
      "json",
      z.object({
        language: z.string(),
      }),
    ),
    async (ctx) => {
      const user = ctx.get("user");
      const body = ctx.req.valid("json");

      if (user.language !== body.language)
        await prisma.user.update({
          where: { id: user.id },
          data: {
            language: body.language,
          },
        });

      return ctx.json({ success: true });
    },
  );
