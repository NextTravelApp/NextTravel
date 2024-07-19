import type { Context } from "hono";
import type { ZodError } from "zod";

export const validatorCallback = (
  result: {
    success: boolean;
    error?: ZodError;
  },
  ctx: Context,
) => {
  if (!result.success) {
    return ctx.json(
      {
        t: result.error?.issues[0].message,
      },
      400,
    );
  }
};
