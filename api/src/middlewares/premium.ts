import { createMiddleware } from "hono/factory";
import type { Variables } from "../constants/context";

export const premium = (...plans: string[]) =>
  createMiddleware<{ Variables: Variables }>(async (ctx, next) => {
    const user = ctx.get("user");
    if (!user?.plan || !plans.includes(user?.plan)) {
      return ctx.json(
        {
          t: "invalid_plan",
        },
        403,
      );
    }

    return next();
  });
