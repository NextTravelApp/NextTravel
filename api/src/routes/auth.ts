import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import prisma from "../lib/prisma";
import { loginSchema, registerSchema } from "../lib/schemas";
import { signToken } from "../lib/tokens";
import { authenticated } from "../middlewares/auth";

const hono = new Hono();
hono.post("/register", zValidator("json", registerSchema), async (ctx) => {
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
        error: "User already exists",
      },
      400
    );
  }

  const hashedPassword = Bun.password.hashSync(body.password);
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
});

hono.post("/login", zValidator("json", loginSchema), async (ctx) => {
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
      401
    );
  }

  const passwordMatch = Bun.password.verifySync(body.password, user.password);

  if (!passwordMatch) {
    return ctx.json(
      {
        t: "invalid_password",
      },
      401
    );
  }

  const token = await signToken(user.id);

  return ctx.json({
    token,
  });
});

hono.get("/me", authenticated, async (ctx) => {
  const payload = ctx.get("jwtPayload");
  const user = await prisma.user.findUnique({
    where: {
      id: payload.user,
    },
  });

  return ctx.json(user);
});

export default hono;
