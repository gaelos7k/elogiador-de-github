"use client";

import i18n, { type Resource } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";

const resources: Resource = {
  pt: {
    translation: {
      title: "Elogiador de GitHub",
      description: "Descubra o potencial do seu perfil profissional",
      support: "Apoiar",
      label: "Insira seu perfil para análise profissional",
      analyze: "Analisar",
      analyzing: "Analisando",
      placeholder: "usuario",
      errors: {
        title: "Falha ao realizar uma análise",
        try: "Tente novamente mais tarde.",
        noUser: "Você não inseriu um usuário para ser analisado!",
        notFound: "O usuário não foi encontrado.",
        timeout: "A API demorou demais para processar.",
        github: "A API do GitHub está instavél. Aguarde até que se estabilize.",
        unknown: "Um erro desconhecido ocorreu. Por favor, tente novamente.",
      },
      donation: {
        title: "Gostou? Então apoie!",
        content: [
          "O Elogiador de GitHub é um projeto gratuito e de código aberto, mas que exige investimentos — a IA não é de graça!",
          "Ajude o projeto com qualquer valor no Pix e permita que outras pessoas também tenham a oportunidade de receberem feedback profissional.",
        ],
      },
    },
  },
  en: {
    translation: {
      title: "GitHub Praiser",
      description: "Discover your professional profile potential",
      support: "Donate",
      label: "Insert your profile for professional analysis",
      analyze: "Analyze",
      analyzing: "Analyzing",
      placeholder: "user",
      errors: {
        title: "Failed to analyze",
        try: "Try again later.",
        noUser: "You didn't provide a user to be analyzed!",
        notFound: "The user was not found.",
        timeout: "API took too long to process.",
        github: "GitHub API is unstable. Please wait until it stabilizes.",
        unknown: "An unknown error occurred. Please try again.",
      },
      donation: {
        title: "Did you like it? So donate!",
        content: [
          "GitHub Praiser is a free and open-source project, but it needs investments — the AI is not free!",
          "Help the project with any value and let other people also receive professional feedback.",
        ],
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "pt",
  fallbackLng: "pt",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
