import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterFormType } from "@/validation/index";
import { toast } from "react-toastify";
import api from "@/services/api";
import axios from "axios";

export function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormType) => {
    try {
      // Sending the exact fields defined in your registerSchema
      await api.post("/api/users/register/", {
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        email: data.email,
        password: data.password,
      });

      // ✅ Success toast added here
      toast.success("Account created successfully! Please log in.");

      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Backend might return specific validation errors as an object, 
        // but checking detail or a generic message is a good fallback
        const msg =
          error.response?.data?.detail || 
          error.response?.data?.email?.[0] ||
          error.response?.data?.username?.[0] ||
          "Registration failed. Please try again.";
        toast.error(msg);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 text-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Create an account</h2>
        <p className="text-sm text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium leading-none" htmlFor="first_name">
              First name
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
              Last name
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

        <div className="space-y-2 text-left">
          <label className="text-sm font-medium leading-none" htmlFor="username">
            Username
          </label>
          <Input
            id="username"
            placeholder="johndoe123"
            {...register("username")}
            aria-invalid={!!errors.username}
          />
          {errors.username && (
            <p className="text-sm text-destructive">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2 text-left">
          <label className="text-sm font-medium leading-none" htmlFor="email">
            Email address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2 text-left">
          <label className="text-sm font-medium leading-none" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            type="password"
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
        <Link
          to="/login"
          className="text-primary hover:underline font-medium"
        >
          Sign in here
        </Link>
      </div>
    </div>
  );
}