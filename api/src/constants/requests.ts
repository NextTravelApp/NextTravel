import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string(),
    email: z.string().email("invalid_email"),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/,
        "invalid_password",
      ),
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "match_passwords",
        path: ["confirmPassword"],
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().email("invalid_email"),
  password: z.string(),
});

export const searchSchema = z
  .object({
    id: z.string().optional(),
    location: z.string().optional(),
    members: z.number().optional(),
    startDate: z.string().date().optional(),
    endDate: z.string().date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.id) return z.NEVER;
    if (!data.location || !data.members || !data.startDate || !data.endDate)
      ctx.addIssue({
        code: "custom",
        message: "missing_fields",
      });

    if (data.startDate && new Date(data.startDate) < new Date())
      ctx.addIssue({
        code: "invalid_date",
        message: "invalid_start_date",
        path: ["startDate"],
      });

    if (
      data.startDate &&
      data.endDate &&
      new Date(data.startDate) > new Date(data.endDate)
    )
      ctx.addIssue({
        code: "invalid_date",
        message: "invalid_end_date",
      });

    if (data.members && data.members < 1)
      ctx.addIssue({
        code: "too_small",
        message: "invalid_members",
        minimum: 1,
        path: ["members"],
        inclusive: true,
        type: "number",
      });

    return z.NEVER;
  });
