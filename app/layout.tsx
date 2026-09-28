import type { Metadata } from "next";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={familjenGrotesk.variable}>
      <body>{children}</body>
    </html>
  );
}
