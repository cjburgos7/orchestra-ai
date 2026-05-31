import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import DevStaleStateGuard from "./components/DevStaleStateGuard";
import "./globals.css";

const CAMERA_FONT_URL = "/fonts/CameraPlainVariable.woff2";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Orchestra AI — Launch your AI startup",
  description: "Build, preview, and launch AI startups without writing code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" href={CAMERA_FONT_URL} as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col">
        <DevStaleStateGuard />
        {children}
      </body>
    </html>
  );
}
