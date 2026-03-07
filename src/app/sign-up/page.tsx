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
    name: z.string().min(2, "Nama lengkap minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
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

        <section className="flex min-h-screen items-start justify-center bg-white px-8 py-10 lg:px-12">
          <div className="w-full max-w-87.5 pt-8 lg:pt-10">
            <div className="mb-10 flex flex-col items-center">
              <Image
                src="/logo.png"
                alt="Rumah Amal Salman"
                width={220}
                height={76}
                priority
                className="mb-8 h-auto w-50"
              />

              <h1 className="text-center text-[28px] font-bold leading-tight text-slate-800">
                Buat Akun Baru
              </h1>
              <p className="mt-3 text-center text-[15px] text-slate-500">
                Isi data diri Anda untuk mendaftar
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-[15px] font-semibold text-slate-600"
                >
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  placeholder="Masukkan nama lengkap"
                  className="h-11.5 rounded-2xl border border-slate-200 bg-white px-4 text-[15px] shadow-none placeholder:text-[#b6bdc7] focus-visible:ring-1 focus-visible:ring-[#18b6c9]"
                  {...register("name")}
                />
                {errors.name?.message ? (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[15px] font-semibold text-slate-600"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Masukkan alamat email"
                  className="h-11.5 rounded-2xl border border-slate-200 bg-white px-4 text-[15px] shadow-none placeholder:text-[#b6bdc7] focus-visible:ring-1 focus-visible:ring-[#18b6c9]"
                  {...register("email")}
                />
                {errors.email?.message ? (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-[15px] font-semibold text-slate-600"
                >
                  No. Handphone
                </Label>

                <div className="flex h-11.5 items-center gap-2">
                  <div className="flex h-full w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[15px] font-medium text-[#6b7280]">
                    +62
                  </div>

                  <Input
                    id="phoneNumber"
                    type="tel"
                    autoComplete="tel-national"
                    placeholder="8xx-xxxx-xxxx"
                    className="h-full flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-[15px] shadow-none placeholder:text-[#b6bdc7] focus-visible:ring-1 focus-visible:ring-[#18b6c9]"
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
                  className="text-[15px] font-semibold text-slate-600"
                >
                  Password
                </Label>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Buat password"
                    className="h-11.5 rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-[15px] shadow-none placeholder:text-[#b6bdc7] focus-visible:ring-1 focus-visible:ring-[#18b6c9]"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
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
                  className="text-[15px] font-semibold text-slate-600"
                >
                  Konfirmasi Password
                </Label>

                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Ulangi password"
                    className="h-11.5 rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-[15px] shadow-none placeholder:text-[#b6bdc7] focus-visible:ring-1 focus-visible:ring-[#18b6c9]"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    aria-label={
                      showConfirmPassword
                        ? "Sembunyikan konfirmasi password"
                        : "Lihat konfirmasi password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>

                {errors.confirmPassword?.message ? (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                ) : null}
              </div>

              <p className="pt-1 text-center text-[12px] leading-5 text-[#a3aab5]">
                Dengan mendaftar, Anda menyetujui{" "}
                <Link href="/syarat-ketentuan" className="font-semibold text-[#18b6c9]">
                  Syarat & Ketentuan
                </Link>{" "}
                serta{" "}
                <Link href="/kebijakan-privasi" className="font-semibold text-[#18b6c9]">
                  Kebijakan Privasi
                </Link>{" "}
                kami.
              </p>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-12 w-full rounded-2xl bg-[#18b6c9] text-[15px] font-semibold text-white shadow-none hover:bg-[#17a9bc]"
              >
                {isSubmitting ? "Mendaftar..." : "Daftar Sekarang"}
              </Button>
            </form>

            <p className="mt-8 text-center text-[15px] text-[#8f96a3]">
              Sudah punya akun?{" "}
              <Link href="/sign-in" className="font-semibold text-[#18b6c9]">
                Masuk
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
