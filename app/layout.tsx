import type { Metadata } from "next";
import { Inter, Roboto, Geist_Mono } from "next/font/google";
import { ReduxProvider } from "@/lib/store";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import { DEFAULT_FAVICON } from "@/lib/brand";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "CMP CRM - Sell. Deliver. Grow.",
  description: "Modern CRM & Project Management System",
  icons: {
    icon: [{ url: DEFAULT_FAVICON, sizes: "any", type: "image/x-icon" }],
    shortcut: [{ url: DEFAULT_FAVICON, type: "image/x-icon" }],
    apple: [{ url: DEFAULT_FAVICON, sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ReduxProvider>
          <NextAuthProvider>{children}</NextAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
