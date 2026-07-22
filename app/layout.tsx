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
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Builddrr - Astro sites, generated",
  description:
    "Describe your idea. Builddrr generates a production-ready Astro site with a live preview in seconds.",
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
