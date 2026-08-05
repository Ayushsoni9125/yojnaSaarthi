import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";

import ToastProvider from "@/components/providers/ToastProvider";
import CompareBar from "@/components/schemes/CompareBar";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "YojanaSaarthi",
  description: "Your AI Guide to Government Schemes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable)}
    >
      <body>
        <SessionProvider>
          {children}
          <ToastProvider />
          <CompareBar />
        </SessionProvider>
      </body>
    </html>
  );
}