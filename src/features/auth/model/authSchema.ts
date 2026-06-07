import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Некоректний формат email"),
  password: z.string().min(6, "Мінімум 6 символів"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    full_name: z.string().min(2, "Мінімум 2 символи"),
    email: z.string().email("Некоректний формат email"),
    password: z.string().min(6, "Мінімум 6 символів"),
    confirm_password: z.string(),
    role: z.enum(["Учень", "Вчитель"]),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Паролі не збігаються",
    path: ["confirm_password"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
