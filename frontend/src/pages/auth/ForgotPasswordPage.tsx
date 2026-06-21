import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema, type ForgotPasswordFormType } from "@/validation/index";
import { userAPI } from "@/services/api";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormType) => {
    try {
      setError(null);
      await userAPI.requestPasswordReset({ email: data.email });
      sessionStorage.setItem("reset_email", data.email);
      navigate("/verify-code", { state: { email: data.email } });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send reset code.");
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 text-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Forgot Password</h2>
        <p className="text-sm text-muted-foreground">
          Enter your email address to receive a verification code
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium leading-none" htmlFor="email">
            Email address
          </label>
          <Input
            id="email"
            placeholder="name@example.com"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Verification Code"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link
          to="/login"
          className="text-primary hover:underline font-medium"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
