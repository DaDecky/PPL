import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type LearnMoreLink = {
  label: string;
  href: string;
  highlighted?: boolean;
};

const LEARN_MORE_LINKS: readonly LearnMoreLink[] = [
  { label: "Tentang", href: "#" },
  { label: "Apa itu Qardhul Hasan?", href: "#", highlighted: true },
  { label: "Privacy Policy", href: "#" },
  { label: "Syarat dan Ketentuan", href: "#" },
  { label: "Berita", href: "#" },
  { label: "Refund Policy", href: "#" },
];

const CONTACT_ITEMS = [
  "Jl. Gelap Nyawang No. 4 Bandung",
  "Kode Pos 40132",
  "Call Center : 0811 222 8333",
] as const;

const CONTACT_EMAIL = "info@rumahamalsalman.org";

const MAP_CONFIG = {
  embedUrl:
    "https://maps.google.com/maps?q=Jl.%20Gelap%20Nyawang%20No.%204%20Bandung%2040132&t=&z=15&ie=UTF8&iwloc=&output=embed",
  linkUrl:
    "https://www.google.com/maps/search/?api=1&query=Jl+Gelap+Nyawang+No.+4+Bandung+40132",
  title: "Peta Rumah Amal Salman",
} as const;

type FooterProps = {
  className?: string;
};

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn("border-t border-border bg-muted/30", className)}
    >
      <div className="mx-auto max-w-[1056px] px-6 pt-4 sm:px-8 lg:px-0">
        <div className="grid gap-10 py-8 md:grid-cols-2 xl:grid-cols-[224px_122px_194px_356px] xl:justify-between xl:gap-20 xl:py-10">
          <FooterBrand />
          <FooterLinks />
          <FooterContact />
          <FooterMap />
        </div>
      </div>
      <FooterCopyright />
    </footer>
  );
}

function FooterBrand() {
  return (
    <section className="space-y-4">
      <Image
        src="/images/rumah-amal-salman-logo.png"
        alt="Rumah Amal Salman"
        width={224}
        height={56}
        className="h-auto w-56 max-w-full"
      />
      <p className="max-w-[213px] text-sm leading-relaxed text-muted-foreground">
        rumahamal.org adalah website untuk berzakat, infaq, wakaf dan menggalang
        dana secara online terpopuler di Indonesia.
      </p>
    </section>
  );
}

function FooterLinks() {
  return (
    <nav aria-label="Learn More" className="space-y-3">
      <h2 className="text-base font-semibold text-foreground">Learn More</h2>
      <ul className="space-y-2 text-sm leading-relaxed">
        {LEARN_MORE_LINKS.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className={cn(
                "transition-colors hover:text-brand-hover",
                link.highlighted ? "text-brand" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FooterContact() {
  return (
    <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
      <h2 className="text-base font-semibold text-foreground">Kontak</h2>
      <div className="space-y-2">
        {CONTACT_ITEMS.map((item) => (
          <p key={item}>{item}</p>
        ))}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="block text-brand transition-colors hover:text-brand-hover"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </section>
  );
}

function FooterMap() {
  return (
    <section className="space-y-2 xl:justify-self-end">
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <iframe
          title={MAP_CONFIG.title}
          src={MAP_CONFIG.embedUrl}
          className="h-40 w-full min-w-0 bg-muted md:max-w-sm lg:w-[356px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a
        href={MAP_CONFIG.linkUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-xs text-brand transition-colors hover:text-brand-hover"
      >
        Lihat peta lebih besar
        <ArrowUpRight className="size-3" strokeWidth={2.25} />
      </a>
    </section>
  );
}

function FooterCopyright() {
  return (
    <div className="border-t border-border px-6 py-4 sm:px-8 lg:px-0">
      <p className="text-center text-xs text-muted-foreground">
        Copyright © 2016 · RUMAH AMAL · All Right Reserved
      </p>
    </div>
  );
}