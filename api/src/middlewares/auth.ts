import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";
import prisma from "../lib/prisma";

export const authenticated = createMiddleware(async (ctx, next) => {
  const jwtMiddleware = jwt({
    secret: process.env.JWT_SECRET as string,
  });

  try {
    await new Promise((resolve, reject) => {
      jwtMiddleware(ctx, async () => resolve(null)).catch(reject);
    });
  } catch (_) {
    return ctx.json(
      {
        error: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const payload = ctx.get("jwtPayload");
  const user = await prisma.user.findUnique({ where: { id: payload.user } });
  if (!user) return ctx.json({ error: "Unauthorized" }, { status: 401 });

  ctx.set("user", user);

  return next();
});
