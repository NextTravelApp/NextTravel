import { zValidator as validator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodType } from "zod";

export const zValidator = (target: keyof ValidationTargets, schema: ZodType) =>
  validator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          t: result.error.issues[0].message,
        },
        400,
      );
    }
  });
