"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { signIn } from "@/lib/auth-client";
import { appToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const signInSchema = z.object({
  identifier: z.string().min(1, "Email / no.hp wajib diisi"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    const base = window.location.origin;
    const res = await fetch("/api/auth/sign-in-identifier", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: values.identifier,
        password: values.password,
        callbackURL: `${base}/`,
      }),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as
        | { message?: string }
        | null;
      appToast.error(data?.message ?? "Email/no.hp atau password salah.");
      return;
    }

    window.location.assign("/");
  };
  
  const onGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const base = window.location.origin;
    await signIn.social(
      {
        provider: "google",
        callbackURL: `${base}/`,
      },
      {
        onError: (ctx) => {
          appToast.error(ctx.error.message);
          setIsGoogleLoading(false);
        },
      },
    );
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.45fr_1fr]">
        {/* Left Image */}
        <section className="relative hidden lg:block">
          <Image
            src="/bg-rumah-amal-salman.png"
            alt="Rumah Amal Salman"
            fill
            priority
            className="object-cover"
          />
        </section>

        {/* Right Form */}
        <section className="flex min-h-screen items-center justify-center bg-white px-6 py-10">
          <div className="w-full max-w-87.5">
            <div className="mb-8 flex justify-center">
              <Image
                src="/logo.png"
                alt="Rumah Amal Salman"
                width={180}
                height={60}
                priority
                className="mb-8 h-auto w-50"
              />
            </div>

            <h1 className="text-center text-[28px] font-bold text-slate-800">
              Selamat Datang Kembali
            </h1>

            <p className="mt-2 mb-8 text-center text-sm text-slate-500">
              Masuk ke akun Anda
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email / Phone */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-600">
                  Email / No. Handphone
                </Label>

                <Input
                  placeholder="Masukkan email atau nomor HP"
                  className="h-12 rounded-2xl border-slate-200 px-4 focus-visible:ring-[#18b6c9]"
                  autoComplete="email"
                  {...register("identifier")}
                />

                {errors.identifier?.message && (
                  <p className="text-sm text-destructive">
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-600">
                  Password
                </Label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    className="h-12 rounded-2xl border-slate-200 px-4 pr-12 focus-visible:ring-[#18b6c9]"
                    autoComplete="current-password"
                    {...register("password")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password?.message && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Lupa Password?
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-2xl bg-[#18b6c9] text-base font-semibold hover:bg-[#14a6b8]"
              >
                {isSubmitting ? "Masuk..." : "Masuk"}
              </Button>

              {/* Divider */}
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>

                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-slate-400">
                    atau masuk dengan
                  </span>
                </div>
              </div>

              {/* Google */}
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full rounded-2xl"
                onClick={onGoogleSignIn}
                disabled={isGoogleLoading}
              >
                <Image
                  src="/svg.png"
                  alt="Rumah Amal Salman"
                  width={20}
                  height={20}
                  className="object-cover"
                />
                {isGoogleLoading ? "Redirecting..." : "Google"}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Belum punya akun?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-[#18b6c9] hover:underline"
              >
                Daftar di sini
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
