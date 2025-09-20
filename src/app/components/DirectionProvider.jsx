"use client";
import { useEffect } from "react";
import { useI18nClient } from "@/lib/i18nClient";

export default function DirectionProvider({ children }) {
  const { i18n, mounted } = useI18nClient();

  useEffect(() => {
    if (mounted && typeof document !== "undefined") {
      const html = document.documentElement;
      const isRTL = i18n.language === "ar";

      // Set language attribute
      html.setAttribute("lang", i18n.language);

      // Set direction attribute
      html.setAttribute("dir", isRTL ? "rtl" : "ltr");

      // Add/remove RTL class for additional styling
      if (isRTL) {
        html.classList.add("rtl");
        html.classList.remove("ltr");
      } else {
        html.classList.add("ltr");
        html.classList.remove("rtl");
      }
    }
  }, [i18n.language, mounted]);

  return <>{children}</>;
}
