import type React from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import { PostHogProvider } from "@/components/PostHogProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://builddrr.com"),
  title: "Builddrr - Make websites with AI",
  description:
    "Generate a professional website with AI. No coding required.",
  openGraph: {
    title: "Builddrr - Make websites with AI",
    description: "Generate a professional website with AI. No coding required.",
    url: "https://builddrr.com",
    siteName: "Builddrr",
    images: "/og-image.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Builddrr - Make websites with AI",
    description: "Generate a professional one-page website with AI. No coding required.",
    images: "/og-image.png",
  },
};

const geist = Geist({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className}`}>
        <PostHogProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster />
        </PostHogProvider>
      </body>
    </html>
  );
}
