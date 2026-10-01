import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ระบบจัดการสินค้า | Product Explorer",
  description: "ระบบค้นหาและจัดการสินค้าโทนฟ้าขาว สวยงาม ทันสมัย ใช้งานง่าย",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-b from-sky-50/50 via-slate-50 to-blue-50/30 text-slate-800">
        {children}
      </body>
    </html>
  );
}
