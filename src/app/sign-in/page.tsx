"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { signIn } from "@/lib/auth-client";
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

const signInSchema = z.object({
  identifier: z.string().min(1, "Email / no.hp wajib diisi"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
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

    // We use a custom sign-in endpoint, so do a full reload to sync auth state immediately.
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
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Masuk dengan email dan password akun kamu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Email / No. Handphone</Label>
              <Input
                id="identifier"
                type="text"
                autoComplete="username"
                placeholder="you@example.com / 081234567890"
                {...register("identifier")}
              />
              {errors.identifier?.message ? (
                <p className="text-sm text-destructive">
                  {errors.identifier.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="********"
                {...register("password")}
              />
              {errors.password?.message ? (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              ) : null}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="my-4 h-px bg-border" />

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onGoogleSignIn}
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
          </Button>

          <p className="mt-4 text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/sign-up" className="font-medium text-foreground underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
