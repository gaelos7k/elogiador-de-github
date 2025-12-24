import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";

const font = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elogiador de GitHub",
  description:
    "Análise profissional do seu perfil GitHub com feedback construtivo.",
  openGraph: {
    title: "Elogiador de GitHub",
    description:
      "Análise profissional do seu perfil GitHub com feedback construtivo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${font.variable} pb-24 bg-[length:100%_600px] bg-no-repeat bg-linear-to-b from-emerald-50 antialiased`}
      >
        <Navbar />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
