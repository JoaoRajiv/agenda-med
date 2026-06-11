import { ReactQueryProvider } from "@/providers/react-query";
import "./globals.css";

import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

const manrope = Manrope({
	variable: "--font-manrope-sans",
	subsets: ["latin"],
});

const googleFont = localFont({
	src: "./_fonts/GoogleSansFlex-VariableFont_GRAD,ROND,opsz,slnt,wdth,wght.ttf",
	variable: "--font-google-sans",
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
				className={`${manrope.variable} ${googleFont.variable} font-sans antialiased`}
			>
				<ReactQueryProvider>
					<NuqsAdapter>{children}</NuqsAdapter>
				</ReactQueryProvider>
				<Toaster position="top-right" theme="light" />
			</body>
		</html>
	);
}
