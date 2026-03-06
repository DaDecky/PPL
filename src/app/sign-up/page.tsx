"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { signUp } from "@/lib/auth-client";
import { appToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const signUpSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.email("Email tidak valid"),
    phoneNumber: z
      .string()
      .regex(/^8[0-9]{7,12}$/, "No. Handphone tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string().min(8, "Konfirmasi password minimal 8 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak sama",
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    const base = window.location.origin;
    const payload = {
      name: values.name,
      email: values.email,
      phoneNumber: `+62${values.phoneNumber}`,
      password: values.password,
      callbackURL: `${base}/`,
    } as Parameters<typeof signUp.email>[0] & { phoneNumber: string };

    await signUp.email(payload, {
      onSuccess: () => {
        appToast.success("Berhasil sign up");
        router.push("/");
      },
      onError: (ctx) => {
        appToast.error(ctx.error.message);
      },
    });
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.45fr_1fr]">
        <section className="relative hidden lg:block">
          <Image
            src="/bg-rumah-amal-salman.png"
            alt="Rumah Amal Salman"
            fill
            priority
            className="object-cover"
          />
        </section>

        <section className="flex min-h-screen items-center justify-center bg-white px-6 py-10">
          <div className="w-full max-w-[430px]">
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-8 flex justify-center">
                <Image
                  src="/logo.png"
                  alt="Rumah Amal Salman"
                  width={180}
                  height={60}
                  priority
                  className="h-auto w-[180px]"
                />
              </div>

              <h1 className="text-center text-[28px] font-bold text-slate-800">
                Daftar Akun
              </h1>
              <p className="mt-2 text-center text-sm text-slate-500">
                Isi data diri Anda untuk mendaftar
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-slate-600">
                  Nama
                </Label>
                <Input
                  id="name"
                  placeholder="Masukkan nama lengkap"
                  className="h-12 rounded-2xl border-slate-200 bg-white px-4 shadow-none placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#18b6c9]"
                  {...register("name")}
                />
                {errors.name?.message ? (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-600">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Masukkan email"
                  className="h-12 rounded-2xl border-slate-200 bg-white px-4 shadow-none placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#18b6c9]"
                  {...register("email")}
                />
                {errors.email?.message ? (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-sm font-semibold text-slate-600"
                >
                  No. Handphone
                </Label>
                
                <div className="flex h-12 items-center overflow-hidden rounded-2xl border border-slate-200 bg-white focus-within:ring-1 focus-within:ring-[#18b6c9]">
                  <span className="flex h-full items-center border-r border-slate-200 px-4 text-sm text-slate-500">
                    +62
                  </span>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    autoComplete="tel-national"
                    placeholder="81234567890"
                    className="h-full border-0 bg-transparent px-4 shadow-none focus-visible:ring-0"
                    {...register("phoneNumber", {
                      setValueAs: (value) =>
                        String(value ?? "")
                          .replace(/\D/g, "")
                          .replace(/^0+/, ""),
                    })}
                  />
                </div>

                {errors.phoneNumber?.message ? (
                  <p className="text-sm text-destructive">
                    {errors.phoneNumber.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-600"
                >
                  Password
                </Label>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Masukkan password"
                    className="h-12 rounded-2xl border-slate-200 bg-white px-4 pr-12 shadow-none placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#18b6c9]"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.password?.message ? (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-slate-600"
                >
                  Konfirmasi Password
                </Label>

                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Masukkan ulang password"
                    className="h-12 rounded-2xl border-slate-200 bg-white px-4 pr-12 shadow-none placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#18b6c9]"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.confirmPassword?.message ? (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-2xl bg-[#18b6c9] text-base font-semibold text-white hover:bg-[#14a6b8]"
              >
                {isSubmitting ? "Mendaftar..." : "Daftar"}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Sudah punya akun?{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-[#18b6c9] hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}