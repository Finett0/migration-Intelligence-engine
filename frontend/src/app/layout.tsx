import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NuvemShop | Simule a migração",
  description:
    "Descubra quanto você economiza migrando para a Nuvemshop. Análise gratuita e instantânea da sua loja.",
  icons: {
    icon: "/nuvemshop-logo.png",
    apple: "/nuvemshop-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
