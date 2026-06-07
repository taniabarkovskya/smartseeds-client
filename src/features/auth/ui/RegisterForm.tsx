import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/shared/api/supabase";
import { registerSchema, type RegisterFormData } from "@/features/auth/model/authSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "Учень" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setServerError(null);

    // 1. Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.full_name } },
    });

    if (authError || !authData.user) {
      setIsLoading(false);
      setServerError(authError?.message ?? "Помилка реєстрації");
      return;
    }

    // 2. Get role_id
    const { data: roleData } = await supabase
      .from("roles")
      .select("id")
      .eq("name", data.role)
      .single();

    // 3. Insert into custom users table
    await supabase.from("users").insert({
      id: authData.user.id,
      role_id: roleData?.id ?? null,
      full_name: data.full_name,
      email: data.email,
      created_at: new Date().toISOString(),
    });

    // 4. Create competency vector for students
    if (data.role === "Учень") {
      await supabase.from("competency_vectors").insert({
        user_id: authData.user.id,
        pu_vector: { phonetics: 0.5, lexical: 0.5, grammar: 0.5 },
        updated_at: new Date().toISOString(),
      });
    }

    setIsLoading(false);

    if (authData.session) {
      // Email confirmation disabled — log in right away
      navigate("/");
    } else {
      // Email confirmation required
      setSuccessMessage("Перевірте пошту — ми надіслали лист для підтвердження акаунту.");
    }
  };

  if (successMessage) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="text-4xl">📬</div>
        <p className="font-heading font-bold text-foreground">Майже готово!</p>
        <p className="text-sm text-muted-foreground">{successMessage}</p>
        <Link to="/login" className="text-sm text-foreground underline underline-offset-2 hover:opacity-70">
          Повернутись до входу
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Role selector */}
      <div className="space-y-2">
        <Label>Я є...</Label>
        <div className="flex gap-2">
          {(["Учень", "Вчитель"] as const).map((role) => (
            <button
              key={role}
              type="button"
              className={cn(
                "flex-1 py-2 rounded-lg border text-sm font-medium transition-colors",
                selectedRole === role
                  ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                  : "bg-white text-foreground border-border hover:bg-muted",
              )}
              onClick={() => setValue("role", role)}
            >
              {role}
            </button>
          ))}
        </div>
        {errors.role && (
          <p className="text-xs text-red-500">{errors.role.message}</p>
        )}
      </div>

      {/* Full name */}
      <div className="space-y-2">
        <Label htmlFor="full_name">Повне ім'я</Label>
        <Input
          id="full_name"
          type="text"
          placeholder="Іван Петренко"
          {...register("full_name")}
        />
        {errors.full_name && (
          <p className="text-xs text-red-500">{errors.full_name.message}</p>
        )}
      </div>

      {/* Email */}
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

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Пароль</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Мінімум 6 символів"
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

      {/* Confirm password */}
      <div className="space-y-2">
        <Label htmlFor="confirm_password">Підтвердіть пароль</Label>
        <div className="relative">
          <Input
            id="confirm_password"
            type={showConfirm ? "text" : "password"}
            placeholder="Повторіть пароль"
            className="pr-10"
            {...register("confirm_password")}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowConfirm((v) => !v)}
          >
            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.confirm_password && (
          <p className="text-xs text-red-500">{errors.confirm_password.message}</p>
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
        {isLoading ? "Реєструємо..." : "Create Account"}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        Вже є акаунт?{" "}
        <Link
          to="/login"
          className="text-foreground underline underline-offset-2 hover:opacity-70"
        >
          Увійти
        </Link>
      </p>
    </form>
  );
}
