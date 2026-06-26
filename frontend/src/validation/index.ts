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
  first_name: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^01[0125]\d{8}$/, "Must be a valid Egyptian number (e.g. 01012345678)"),
});

export type RegisterFormType = z.infer<typeof registerSchema>;
// ==========================================
// 3. Member Schemas
// ==========================================

// Used when ADDING a new member — password required
export const memberSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  role: z.enum(["admin", "member", "manager"]),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^01[0125]\d{8}$/, "Phone must be a valid Egyptian number"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type MemberFormType = z.infer<typeof memberSchema>;

// Used when EDITING a member — password optional
export const memberEditSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  role: z.enum(["admin", "member", "manager"]),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^01[0125]\d{8}$/, "Phone must be a valid Egyptian number"),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters",
    }),
});

export type MemberEditFormType = z.infer<typeof memberEditSchema>;

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
export const projectSchema = z
  .object({
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
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.end_date) >= new Date(data.start_date);
      }
      return true;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["end_date"],
    }
  );

export type ProjectFormType = z.infer<typeof projectSchema>;