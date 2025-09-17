import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import I18nProvider from "./components/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lapip Store",
  description: "Turn Your Mode 180",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
