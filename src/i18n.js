import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import mn from "./locales/mn.json";

i18n
  .use(LanguageDetector) // detect browser language
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      mn: { translation: mn },
    },
    fallbackLng: "en", // fallback if no language detected
    interpolation: { escapeValue: false },
  });

export default i18n;
