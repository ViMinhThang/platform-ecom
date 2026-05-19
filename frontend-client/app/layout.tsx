import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["latin", "vietnamese"],
  variable: "--font-plus-jakarta",
  display: 'swap',
});

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ACME Store | Nâng Tầm Phong Cách",
  description: "Khám phá xu hướng mới nhất về thời trang, công nghệ và đồ gia dụng tinh xảo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${inter.variable} antialiased min-h-screen flex flex-col font-sans`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
