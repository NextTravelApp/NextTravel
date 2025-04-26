import { zValidator } from "@hono/zod-validator";
import { hashSync, verifySync } from "@node-rs/argon2";
import type { Prisma } from "database";
import { Hono } from "hono";
import { z } from "zod";
import type { Variables } from "../constants/context";
import {
  loginSchema,
  registerSchema,
  resetSchema,
} from "../constants/requests";
import { signToken, verifyToken } from "../lib/jwt";
import prisma from "../lib/prisma";
import { authenticated } from "../middlewares/auth";
import { validatorCallback } from "../middlewares/validator";

export const authRoute = new Hono<{ Variables: Variables }>()
  .post(
    "/register",
    zValidator("json", registerSchema, validatorCallback),
    async (ctx) => {
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
    },
  )
  .post(
    "/login",
    zValidator("json", loginSchema, validatorCallback),
    async (ctx) => {
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
    },
  )
  .post(
    "/password/forgot",
    zValidator(
      "json",
      z.object({ email: z.string().email("auth.invalid_email") }),
      validatorCallback,
    ),
    async (ctx) => {
      const body = ctx.req.valid("json");
      const user = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (!user) {
        return ctx.json({
          success: true,
        });
      }

      const token = Math.random().toString(36).substring(2, 15);
      await prisma.user.update({
        where: { id: user.id },
        data: { resetCode: token },
      });

      // TODO: Send email

      return ctx.json({ success: true });
    },
  )
  .post(
    "/password/reset",
    zValidator("json", resetSchema, validatorCallback),
    async (ctx) => {
      const body = ctx.req.valid("json");
      const auth = ctx.req.header("Authorization");

      let userId: string | null = null;
      if (auth?.split(" ")[1]) {
        const token = auth.split(" ")[1];
        const decoded = await verifyToken(token);

        if (decoded) {
          userId = decoded.user;
        }
      }

      let condition: Prisma.UserWhereUniqueInput;
      if (userId) {
        condition = { id: userId };
      } else {
        condition = { resetCode: body.current };
      }

      const user = await prisma.user.findUnique({
        where: {
          ...condition,
        },
        omit: {
          password: false,
        },
      });

      if (!user) {
        return ctx.json(
          {
            t: "auth.wrong_password",
          },
          401,
        );
      }

      if (userId && !verifySync(user.password, body.current)) {
        return ctx.json(
          {
            t: "auth.wrong_password",
          },
          401,
        );
      }

      const hashedPassword = hashSync(body.password);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetCode: null,
        },
      });

      return ctx.json({ success: true });
    },
  )
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
      validatorCallback,
    ),
    async (ctx) => {
      const user = ctx.get("user");
      const body = ctx.req.valid("json");

      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          notificationTokens: true,
        },
      });

      if (!existingUser || existingUser.notificationTokens.includes(body.token))
        return ctx.json({ success: true });

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
      validatorCallback,
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
