// src/lib/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "@/locales/ar/translation.json";
import en from "@/locales/en/translation.json";

// إعداد i18n للعمل مع Next.js 15
if (typeof window !== "undefined" && !i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    lng: "ar",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
