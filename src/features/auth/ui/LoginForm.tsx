import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/shared/api/supabase";
import { loginSchema, type LoginFormData } from "@/features/auth/model/authSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ForgotPasswordDialog } from "@/features/auth/ui/ForgotPasswordDialog";

export function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setIsLoading(false);
    if (error) {
      setServerError("Invalid email or password");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@gmail.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {serverError && (
          <p className="text-sm text-red-500 text-center">{serverError}</p>
        )}

        <Button
          type="submit"
          variant="dark"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        <div className="text-center space-y-2">
          <button
            type="button"
            className="text-sm text-foreground underline underline-offset-2 hover:opacity-70"
            onClick={() => setForgotOpen(true)}
          >
            Forgot password?
          </button>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-foreground underline underline-offset-2 hover:opacity-70"
            >
              Register
            </Link>
          </p>
        </div>
      </form>

      <ForgotPasswordDialog open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </>
  );
}
