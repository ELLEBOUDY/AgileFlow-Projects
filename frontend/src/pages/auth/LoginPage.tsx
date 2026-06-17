import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormType } from "@/validation/index";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";
import api from "@/services/api";
import axios from "axios";

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormType) => {
    try {
      const response = await api.post("/api/users/login/", {
        email: data.email,
        password: data.password,
      });

      dispatch(
        login({
          user: response.data.user,
          accessToken: response.data.access,
        }),
      );

      // ✅ Add your success toast here!
      toast.success("Welcome back! Logged in successfully.");

      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.detail || "Invalid email or password.";
        toast.error(msg);
      }
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 text-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

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

        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <label
              className="text-sm font-medium leading-none"
              htmlFor="password"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link
          to="/register"
          className="text-primary hover:underline font-medium"
        >
          Register here
        </Link>
      </div>
    </div>
  );
}