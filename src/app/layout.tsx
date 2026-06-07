import { ReactQueryProvider } from "@/providers/react-query";
import "./globals.css";

import type { Metadata } from "next";
import { Geist_Mono, Nunito_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";

const googleFlex = localFont({
  src: "./_fonts/GoogleSansFlex-VariableFont_GRAD,ROND,opsz,slnt,wdth,wght.ttf",
  display: "swap",
  variable: "--font-google-flex",
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
        className={`${googleFlex.variable} ${geistMono.variable} ${nunito.variable} antialiased`}
      >
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster position="top-right" theme="light" />
      </body>
    </html>
  );
}
