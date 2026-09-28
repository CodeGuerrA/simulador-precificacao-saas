import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Familjen_Grotesk } from "next/font/google";
import "./globals.css";

const familjenGrotesk = Familjen_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Simulador de precificação SaaS",
  description:
    "Calcula receita, tributos, resultado, margem e clientes de equilíbrio de um serviço por assinatura mensal. Trabalho de Engenharia Econômica — Faculdade SENAI FATESG.",
};

// Tipo declarado aqui (e não LayoutProps) para o TypeScript funcionar num clone limpo, antes do primeiro build.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={familjenGrotesk.variable}>
      <body>{children}</body>
    </html>
  );
}
