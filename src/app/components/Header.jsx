"use client";
import Image from "next/image";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "./LanguageSwitcher"; 

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="header-bg top-0 flex justify-between items-center px-4 py-2 text-white z-50">
      <div className="logo flex items-center">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="logo-img mr-3"
        />
      </div>

      <LanguageSwitcher />

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
              className="mobile-menu fixed top-0 h-full w-72 z-50 rounded-2xl overflow-hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <div className="mobile-header p-4 flex justify-between items-center border-b border-orange-300">
                <h2 className="text-lg font-bold">Menu</h2>
                <button onClick={closeMenu} aria-label="Close menu">
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
