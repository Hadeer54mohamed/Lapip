import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import I18nProvider from "./components/I18nProvider";
import DirectionProvider from "./components/DirectionProvider";

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
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Kufi+Arabic:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Changa:wght@400;600;700&family=El+Messiri:wght@400;600;700&family=Baloo+Bhaijaan+2:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          <DirectionProvider>{children}</DirectionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
