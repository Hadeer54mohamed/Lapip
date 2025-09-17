"use client";
import { useEffect, useState } from "react";
import "@/lib/i18n";

export default function I18nProvider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // تهيئة i18n في المتصفح فقط
    if (typeof window !== "undefined") {
      import("@/lib/i18n").then(() => {
        setMounted(true);
      });
    }
  }, []);

  // عرض loading حتى يتم تحميل i18n
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
