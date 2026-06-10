import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VIA Health Austria — Gesundheit verstehen. Den nächsten Schritt finden.",
  description:
    "VIA Health Austria hilft dir, Gesundheitsfragen besser zu verstehen, passende Fachrichtungen zu erkennen und geeignete Anlaufstellen in Österreich zu finden.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
