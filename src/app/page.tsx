"use client";

import UserSection from "./components/UserSection";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 pt-16 pb-20">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent select-none mb-4 drop-shadow-sm">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 font-medium max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <UserSection />
        </div>
      </div>
    </main>
  );
}
