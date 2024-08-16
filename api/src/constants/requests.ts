import { z } from "zod";

const passwordSchema = {
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/,
      "auth.invalid_password",
    ),
  confirmPassword: z.string(),
};

export const registerSchema = z
  .object({
    name: z.string(),
    email: z.string().email("auth.invalid_email"),
    ...passwordSchema,
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "auth.match_passwords",
        path: ["confirmPassword"],
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().email("auth.invalid_email"),
  password: z.string(),
});

export const resetSchema = z
  .object({
    current: z.string(),
    ...passwordSchema,
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "auth.match_passwords",
        path: ["confirmPassword"],
      });
    }
  });

export const searchSchema = z
  .object({
    location: z.string(),
    members: z.array(z.number().min(1, "min_age")).min(1, "plan.min_members"),
    startDate: z.string().date(),
    endDate: z.string().date(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && new Date(data.startDate) < new Date())
      ctx.addIssue({
        code: "invalid_date",
        message: "plan.invalid_start_date",
        path: ["startDate"],
      });

    if (
      data.startDate &&
      data.endDate &&
      new Date(data.startDate) > new Date(data.endDate)
    )
      ctx.addIssue({
        code: "invalid_date",
        message: "plan.invalid_end_date",
      });

    return z.NEVER;
  });
export type searchSchemaType = z.infer<typeof searchSchema>;

export const searchUpdateSchema = z.object({
  accomodationId: z.string().optional(),
  attractionId: z.string().optional(),
  bookmark: z.boolean().optional(),
  public: z.boolean().optional(),
});
