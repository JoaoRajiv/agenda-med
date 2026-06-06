import "./globals.css";

import type { Metadata } from "next";
import { Geist_Mono, Inter, Nunito_Sans } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agenda - MED",
  description: "Agende suas consultas médicas de forma fácil e rápida.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} ${nunito.variable} antialiased`}
      >
        {children}
        <Toaster position="top-right" theme="light" />
      </body>
    </html>
  );
}
