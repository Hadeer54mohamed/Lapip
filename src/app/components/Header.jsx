"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiHome, FiInfo, FiPhone } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="header-bg  top-0   text-white z-50">
  

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="overlay-bg fixed inset-0 z-40"
              onClick={closeMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className={`mobile-menu fixed top-0 h-full w-72 z-50 rounded-2xl overflow-hidden ${
                locale === "ar" ? "right-0" : "left-0"
              }`}
              initial={{ x: locale === "ar" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: locale === "ar" ? "100%" : "-100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <div className="mobile-header p-4 flex justify-between items-center border-b border-orange-300">
                <h2 className="text-lg font-bold">{t("header")}</h2>
                <button onClick={closeMenu} aria-label="Close menu">
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="logo">
        <Image
          src="/images/hi.gif"
          alt="Logo"
          width={100} // حطي العرض المناسب
          height={100} // حطي الطول المناسب
          className="logo-img mr-3"
        />
      </div>
    </header>
  );
}
