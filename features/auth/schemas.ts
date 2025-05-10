import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "邮箱格式不正确" }),
  password: z.string().min(1, { message: "密码不能为空" }),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    password: z.string().min(1, { message: "新密码不能为空" }),
    confirmPassword: z.string().min(1, { message: "确认密码不能为空" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "确认密码与新密码不一致",
    path: ["confirmPassword"],
  });
