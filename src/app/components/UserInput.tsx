"use client";

import { LoaderCircle } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";

export default function UserInput({ isLoading }: { isLoading?: boolean }) {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (!value || /^(?!-)[A-Za-z0-9-]+(?!-)$/.test(value)) {
      setUsername(value);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-emerald-100 p-8 border border-emerald-100/50 backdrop-blur-sm">
      <label className="block text-sm font-semibold text-zinc-700 mb-3 select-none" htmlFor="username">
        {t("label")}
      </label>
      
      <div className="flex items-center gap-2 px-5 py-4 bg-gradient-to-r from-zinc-50 to-zinc-100/50 border-2 border-zinc-200 rounded-xl text-lg focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100 transition-all duration-300 hover:shadow-md">
        <label className="text-zinc-500 font-medium select-none whitespace-nowrap" htmlFor="username">
          github.com/
        </label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          minLength={2}
          maxLength={39}
          onChange={handleInput}
          pattern="^(?!-)[A-Za-z0-9\-]+(?!-)$"
          className="w-full bg-transparent outline-none text-zinc-800 placeholder:text-zinc-400 font-medium"
          placeholder={t("placeholder")}
          disabled={isLoading}
        />
      </div>

      {isLoading ? (
        <button
          disabled
          className="mt-6 flex gap-3 w-full py-4 items-center justify-center rounded-xl font-semibold bg-gradient-to-r from-zinc-600 to-zinc-700 text-white shadow-lg text-lg"
        >
          <LoaderCircle className="size-6 animate-spin" />
          {t("analyzing")}
        </button>
      ) : (
        <button
          type="submit"
          className="mt-6 w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
        >
          {t("analyze")}
        </button>
      )}
    </div>
  );
}
