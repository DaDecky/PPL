"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { signUp } from "@/lib/auth-client";
import { appToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

    await signUp.email(
      payload,
      {
        onSuccess: () => {
          appToast.success("Berhasil sign up");
          router.push("/");
        },
        onError: (ctx) => {
          appToast.error(ctx.error.message);
        },
      },
    );
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>
            Buat akun baru dengan email dan password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" placeholder="Nama kamu" {...register("name")} />
              {errors.name?.message ? (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email?.message ? (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">No. Handphone</Label>
              <div className="flex items-center rounded-md border border-input bg-background">
                <span className="border-r border-input px-3 py-2 text-sm text-muted-foreground">
                  +62
                </span>
                <Input
                  id="phoneNumber"
                  type="tel"
                  autoComplete="tel-national"
                  placeholder="81234567890"
                  className="border-0 shadow-none focus-visible:ring-0"
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="********"
                {...register("password")}
              />
              {errors.password?.message ? (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="********"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword?.message ? (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              ) : null}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing up..." : "Sign up"}
            </Button>
          </form>

          <p className="mt-4 text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/sign-in" className="font-medium text-foreground underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
