"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Program", href: "/program" },
  { label: "Donasi", href: "/donasi" },
  { label: "Tentang", href: "/tentang" },
] as const;

type NavbarProps = {
  className?: string;
};

export function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "w-full border-b border-gray-200 bg-white px-4 py-4 sm:px-6",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6">
        <Link href="/" aria-label="Beranda Rumah Amal Salman" className="shrink-0 transition-opacity hover:opacity-90">
          <Image
            src="/images/rumah-amal-salman-logo.png"
            alt="Logo Rumah Amal Salman"
            width={133}
            height={40}
            className="h-auto w-28 sm:w-32"
            priority
          />
        </Link>

        <div className="flex min-w-0 items-center gap-5 sm:gap-8">
          <nav
            aria-label="Navigasi utama"
            className="flex min-w-0 items-center gap-4 overflow-x-auto text-sm sm:gap-6"
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "whitespace-nowrap leading-5 transition-colors",
                    isActive
                      ? "font-medium text-brand underline underline-offset-4"
                      : "text-gray-500 hover:text-brand"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/sign-in"
            className="rounded bg-[#0698ad] px-3 py-1 text-sm font-medium leading-5 text-white transition-colors hover:bg-[#05889b]"
          >
            Masuk
          </Link>
        </div>
      </div>
    </header>
  );
}
