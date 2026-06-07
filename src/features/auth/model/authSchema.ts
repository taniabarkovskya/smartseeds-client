import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Minimum 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    full_name: z.string().min(2, "Minimum 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Minimum 6 characters"),
    confirm_password: z.string(),
    role: z.enum(["Учень", "Вчитель"]),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
