import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyCodeSchema, type VerifyCodeFormType } from "@/validation/index";
import { userAPI } from "@/services/api";

export function VerifyCodePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || sessionStorage.getItem("reset_email") || "";
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VerifyCodeFormType>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: ""
    }
  });

  // Sync OTP state with form field
  useEffect(() => {
    setValue("code", otp.join(""));
  }, [otp, setValue]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // Take only the last character if user types fast or field had value
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Focus next if current is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(data)) return;

    const newOtp = [...otp];
    const digits = data.split("");
    
    digits.forEach((digit, i) => {
      if (i < 6) newOtp[i] = digit;
    });

    setOtp(newOtp);
    
    // Focus last filled or next empty
    const nextIndex = Math.min(digits.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const onSubmit = async (data: VerifyCodeFormType) => {
    try {
      setError(null);
      const resetEmail = email || sessionStorage.getItem("reset_email");
      if (!resetEmail) {
        setError("Missing reset email. Start over from Forgot Password.");
        return;
      }

      await userAPI.verifyPasswordReset({
        email: resetEmail,
        code: data.code,
      });
      sessionStorage.setItem("reset_code", data.code);
      navigate("/reset-password", { state: { email: resetEmail, code: data.code } });
    } catch (err: any) {
      setError(err.response?.data?.code?.[0] || err.response?.data?.detail || "Invalid code.");
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Verify Code</h2>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to <strong>{email || "your email"}</strong>
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <label className="text-sm font-medium leading-none text-center block">
            Verification Code
          </label>
          
          <div className="flex justify-between gap-2 sm:gap-4">
            {otp.map((digit, index) => (
              <Input
                key={index}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{1}"
                className="w-12 h-12 text-center text-xl font-bold p-0"
                value={digit}
                ref={(el) => { inputRefs.current[index] = el; }}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {errors.code && (
            <p className="text-sm text-destructive text-center">{errors.code.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify Code"}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm">
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
