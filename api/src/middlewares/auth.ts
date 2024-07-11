import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";

export const authenticated = createMiddleware(async (ctx, next) => {
  const jwtMiddleware = jwt({
    secret: ctx.env.JWT_SECRET,
  });

  return jwtMiddleware(ctx, next);
});
