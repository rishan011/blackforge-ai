import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Toaster } from 'sonner';

import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "BlackForge AI - Next-Gen Intelligence",
  description: "The all-in-one platform for high-performance builders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Toaster theme="dark" position="bottom-right" className="!font-sans" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
