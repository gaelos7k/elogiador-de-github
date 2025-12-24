"use client";

import { Github } from "lucide-react";
import Link from "next/link";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-emerald-100 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <LanguageSelector />
        </div>

        <ul className="flex gap-6 items-center">
          <li>
            <Link
              href="https://github.com/gaelos7k/elogiador-de-github"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-zinc-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 group"
            >
              <Github className="group-hover:scale-110 transition-transform duration-300" /> 
              <span>GitHub</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
