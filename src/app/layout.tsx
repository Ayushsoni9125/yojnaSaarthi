import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToastProvider from "@/components/providers/ToastProvider";
import CompareBar from "@/components/schemes/CompareBar";
import ScrollToTop from "@/components/common/ScrollToTop";

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
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        <SessionProvider>
          <div className="flex min-h-screen flex-col bg-slate-50">
            <Header />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
          <ToastProvider />
          <CompareBar />
          <ScrollToTop />
        </SessionProvider>
      </body>
    </html>
  );
}