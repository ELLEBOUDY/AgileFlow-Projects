import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterFormType } from "@/validation/index";
import { userAPI } from "@/services/api";
import { useState } from "react";

export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormType) => {
    try {
      setError(null);

      const fullName = `${data.first_name.trim()} ${data.last_name.trim()}`;

      const response = await userAPI.register({
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        name: fullName,
        username: fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: "member",
      });

      const loginResponse = await userAPI.login({
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("access_token", loginResponse.data.access);
      localStorage.setItem("refresh_token", loginResponse.data.refresh);
      localStorage.setItem("isAuthenticated", "true");
      if (response.data.role) {
        localStorage.setItem("user_role", response.data.role);
      }

      navigate("/");
    } catch (err: unknown) {
      const axiosError = err as any;
      const backendMessage =
        axiosError?.response?.data?.detail ||
        axiosError?.response?.data?.email?.[0] ||
        axiosError?.response?.data?.phone?.[0] ||
        axiosError?.response?.data?.password?.[0] ||
        "Registration failed. Please try again.";
      setError(backendMessage);
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 text-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your details to join AgileFlow
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium leading-none" htmlFor="first_name">
              First Name
            </label>
            <Input
              id="first_name"
              placeholder="John"
              {...register("first_name")}
              aria-invalid={!!errors.first_name}
            />
            {errors.first_name && (
              <p className="text-sm text-destructive">{errors.first_name.message}</p>
            )}
          </div>

          <div className="space-y-2 text-left">
            <label className="text-sm font-medium leading-none" htmlFor="last_name">
              Last Name
            </label>
            <Input
              id="last_name"
              placeholder="Doe"
              {...register("last_name")}
              aria-invalid={!!errors.last_name}
            />
            {errors.last_name && (
              <p className="text-sm text-destructive">{errors.last_name.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
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

        {/* Phone */}
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium leading-none" htmlFor="phone">
            Phone Number
          </label>
          <Input
            id="phone"
            placeholder="01012345678"
            maxLength={11}
            {...register("phone")}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium leading-none" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Min. 6 characters"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create Account"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link to="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </div>
    </div>
  );
}