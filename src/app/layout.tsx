import { ReactQueryProvider } from "@/providers/react-query";
import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import { ProgressBarProvider } from "@/components/providers/progress-bar";

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
			<body className={`${googleFont.variable} font-sans antialiased`}>
				<ReactQueryProvider>
					<NuqsAdapter>
						<ProgressBarProvider>{children}</ProgressBarProvider>
					</NuqsAdapter>
				</ReactQueryProvider>
				<Toaster position="top-right" theme="light" />
			</body>
		</html>
	);
}
