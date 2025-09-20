"use client";

import { useI18nClient } from "@/lib/i18nClient";

export default function Footer() {
  const { i18n, t, mounted } = useI18nClient();
  const currentLang = i18n.language;

  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-subtitle">
            {currentLang === "ar"
              ? "تحول مودك 180° بشكل أفضل"
              : "Turn Your Mode 180° Better"}
          </p>
          <p className="footer-title">
            © 2025 Lapip -{" "}
            {currentLang === "ar" ? "تم التطوير بواسطة" : "Developed by"}{" "}
            <a
              href="https://www.facebook.com/ENSEGYPTEG"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              ENS
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
