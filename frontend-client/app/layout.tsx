import type { Metadata } from "next";
import { Be_Vietnam_Pro, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const beVietnam = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  display: 'swap',
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ACME Store | Elevate Your Style",
  description: "Discover the latest trends in fashion and accessories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${beVietnam.variable} ${inter.variable} ${jetBrainsMono.variable} antialiased min-h-screen flex flex-col font-inter`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
