import type { Metadata } from "next";
import Script from "next/script";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { AutumnWrapper } from "./AutumnWrapper";
import { ThemeProviderWrapper } from "@/components/site/theme-provider";
import {
  THEME_COOKIE,
  parseTheme,
  themeCookieScript,
} from "@/lib/theme";
import { getSiteUrl, siteConfig } from "@/lib/seo";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const theme = parseTheme(cookieStore.get(THEME_COOKIE)?.value);

  return (
    <ConvexAuthNextjsServerProvider>
      <html
        lang="en"
        className={cn(
          geist.variable,
          geistMono.variable,
          theme === "dark" && "dark"
        )}
        style={{ colorScheme: theme }}
        suppressHydrationWarning
      >
        <head>
          <Script
            id="theme-cookie-sync"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: themeCookieScript() }}
          />
          {process.env.NODE_ENV === "development" && (
            <Script
              src="//unpkg.com/react-grab/dist/index.global.js"
              crossOrigin="anonymous"
              strategy="beforeInteractive"
            />
          )}
        </head>
        <body className="min-h-[100dvh] bg-background font-sans text-foreground antialiased">
          <ThemeProviderWrapper defaultTheme={theme}>
            <ConvexClientProvider>
              <AutumnWrapper>
                <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
                <Toaster position="top-center" richColors />
              </AutumnWrapper>
            </ConvexClientProvider>
          </ThemeProviderWrapper>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
