"use client";
import Image from "next/image";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18nClient } from "@/lib/i18nClient";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n, mounted } = useI18nClient();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const isRTL = mounted && i18n.language === "ar";

  return (
    <header className="header-bg top-0 text-white relative">
      <div className={`absolute top-4 z-10 ${isRTL ? "left-4" : "right-4"}`}>
        <LanguageSwitcher />
      </div>
      <video
        src="/video.mp4"
        autoPlay
        muted
        playsInline
        loop
        poster="/fallback.jpg"
        className="video w-full h-auto"
      />
    </header>
  );
}
