import { z } from "zod";

// ==========================================
// 1. Login Schema
// ==========================================
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormType = z.infer<typeof loginSchema>;

// ==========================================
// 2. Register Schema
// ==========================================
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type RegisterFormType = z.infer<typeof registerSchema>;

// ==========================================
// 3. Member Schema
// ==========================================
export const memberSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  role: z.enum(["Admin", "Developer", "Designer", "Manager"]),

  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^01[0125]\d{8}$/, "Phone must be a valid Egyptian number"),
});

export type MemberFormType = z.infer<typeof memberSchema>;

// ==========================================
// 4. Task Schema
// ==========================================
export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
  status: z.enum(["todo", "in_progress", "review", "done"]),
  assigneeId: z.string().min(1, "Please assign this task to someone"),
});

export type TaskFormType = z.infer<typeof taskSchema>;

// ==========================================
// 5. Auth / Password Recovery Schemas
// ==========================================
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});
export type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;

export const verifyCodeSchema = z.object({
  code: z
    .string()
    .min(1, "Verification code is required")
    .length(6, "Code must be exactly 6 characters"),
});
export type VerifyCodeFormType = z.infer<typeof verifyCodeSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>;

// ==========================================
// 6. Project Schema
// ==========================================
export const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Project title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  status: z.enum(["in_progress", "planning", "completed"]),
  progress: z
    .number()
    .min(0, "Progress must be at least 0")
    .max(100, "Progress must not exceed 100"),
  team: z.number().optional().nullable(),

  // ➕ إضافة حقول التواريخ الجديدة هنا:
  start_date: z.string().optional().nullable().or(z.literal("")),
  end_date: z.string().optional().nullable().or(z.literal("")),
});

export type ProjectFormType = z.infer<typeof projectSchema>;
