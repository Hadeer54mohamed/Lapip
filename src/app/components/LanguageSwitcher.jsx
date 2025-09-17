"use client";
import { useI18nClient } from "@/lib/i18nClient";

export default function LanguageSwitcher() {
  const { i18n, mounted } = useI18nClient();

  const toggleLang = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", newLang);
    }
  };

  if (!mounted) return null;

  return (
    <button onClick={toggleLang} className="lang-switcher">
      {i18n.language === "ar" ? "EN" : "AR"}
    </button>
  );
}
