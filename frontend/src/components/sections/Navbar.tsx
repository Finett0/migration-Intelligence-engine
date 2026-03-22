"use client";

import Image from "next/image";

const NAV_LINKS = [
  { label: "Migre sua loja", href: "#hero" },
  { label: "Clientes", href: "#clientes" },
  { label: "Compare", href: "#compare" },
];

interface NavbarProps {
  onGoHome?: () => void;
}

export function Navbar({ onGoHome }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 px-4 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between rounded-full bg-white px-5 shadow-lg ring-1 ring-black/[0.04] sm:h-[60px] sm:px-7">
        {/* Logo */}
        <a href="#hero" onClick={(e) => { if (onGoHome) { e.preventDefault(); onGoHome(); } }} className="flex shrink-0 items-center">
          <Image
            src="/nuvemshop-brand.png"
            alt="nuvemshop"
            width={180}
            height={36}
            className="h-5 w-auto sm:h-6"
            priority
          />
        </a>

        {/* Nav links — hidden on mobile */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-4 py-2 text-[14px] font-medium text-neutral-500 transition-colors hover:bg-surface-alt hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#"
          className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-white transition-all hover:bg-white hover:text-accent hover:ring-2 hover:ring-accent sm:px-5 sm:py-2.5 sm:text-sm"
        >
          <span className="sm:hidden">Fale conosco</span>
          <span className="hidden sm:inline">Fale com um especialista</span>
        </a>
      </div>
    </nav>
  );
}
