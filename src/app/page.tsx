"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { signOut, useSession } from "@/lib/auth-client";
import { appToast } from "@/lib/toast";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          appToast.success("Berhasil log out");
          router.refresh();
        },
        onError: (ctx) => {
          appToast.error(ctx.error.message);
        },
      },
    });
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <div className="w-full space-y-4 rounded-lg border border-border bg-card p-6">
        <h1 className="text-xl font-semibold">Auth Demo</h1>
        {isPending ? (
          <p className="text-sm text-muted-foreground">Checking session...</p>
        ) : session?.user ? (
          <>
            <p className="text-sm text-muted-foreground">
              Login sebagai <span className="font-medium">{session.user.email}</span>
            </p>
            <Button onClick={handleSignOut}>Log out</Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Pilih halaman autentikasi yang ingin kamu coba.
            </p>
            <div className="flex gap-3">
              <Link
                href="/sign-in"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-md border border-border px-4 py-2 text-sm font-medium"
              >
                Sign up
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
