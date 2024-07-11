import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";

export const authenticated = createMiddleware(async (ctx, next) => {
  const jwtMiddleware = jwt({
    secret: process.env.JWT_SECRET as string,
  });

  return jwtMiddleware(ctx, next);
});
