import type { Metadata } from "next";
import { Roboto, Noto_Serif } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ["latin", "vietnamese"],
  variable: "--font-roboto",
  display: 'swap',
});

const notoSerif = Noto_Serif({
  weight: ['400', '500', '600', '700'],
  variable: "--font-noto-serif",
  subsets: ["latin", "vietnamese"],
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
        className={`${roboto.variable} ${notoSerif.variable} antialiased min-h-screen flex flex-col font-sans`}
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
