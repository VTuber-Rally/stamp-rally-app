import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { isDev } from "@/lib/consts.ts";

import en from "../i18n/en.json";
import fr from "../i18n/fr.json";

await i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: isDev,

    resources: {
      en: {
        translation: en,
      },
      fr: {
        translation: fr,
      },
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
