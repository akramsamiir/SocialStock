import { z } from "zod"

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .max(20, "Username must be at most 20 characters.")
      .regex(/^\w+$/, "Username can only contain letters, numbers, and underscores."),
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
