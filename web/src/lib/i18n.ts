import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../i18n/en.json";
import fr from "../i18n/fr.json";

import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: import.meta.env.DEV,

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
