import { createMiddleware } from "hono/factory";

export const system = createMiddleware(async (ctx, next) => {
  const header = ctx.req.header("Authorization");
  if (!header) return ctx.json({ error: "Unauthorized" }, 401);

  const split = header.split(" ");
  if (split[1] !== process.env.SYSTEM_TOKEN)
    return ctx.json({ error: "Unauthorized" }, 401);

  return next();
});
