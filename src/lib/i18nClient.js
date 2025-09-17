// src/lib/i18nClient.js
"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// مكون wrapper لضمان أن i18n يعمل فقط في المتصفح
export function useI18nClient() {
  const [mounted, setMounted] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setMounted(true);
    
    // تحميل اللغة المحفوظة
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("lang");
      if (savedLang && savedLang !== i18n.language) {
        i18n.changeLanguage(savedLang);
      }
    }
  }, [i18n]);

  return {
    t,
    i18n,
    mounted,
  };
}
