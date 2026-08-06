import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { hasLocale } from "next-intl";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "../ConvexClientProvider";
import { AutumnWrapper } from "../AutumnWrapper";
import { ThemeProviderWrapper } from "@/components/site/theme-provider";
import {
  THEME_COOKIE,
  parseTheme,
  themeCookieScript,
} from "@/lib/theme";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();
  const cookieStore = await cookies();
  const theme = parseTheme(cookieStore.get(THEME_COOKIE)?.value);

  return (
    <ConvexAuthNextjsServerProvider>
      <html
        lang={locale}
        className={cn(
          geist.variable,
          geistMono.variable,
          theme === "dark" && "dark"
        )}
        style={{ colorScheme: theme }}
        suppressHydrationWarning
      >
        <head>
          <script
            id="theme-cookie-sync"
            dangerouslySetInnerHTML={{ __html: themeCookieScript() }}
          />
          {process.env.NODE_ENV === "development" ? (
            <script
              src="//unpkg.com/react-grab/dist/index.global.js"
              crossOrigin="anonymous"
            />
          ) : null}
        </head>
        <body className="min-h-[100dvh] bg-background font-sans text-foreground antialiased">
          <NextIntlClientProvider messages={messages}>
            <ThemeProviderWrapper defaultTheme={theme}>
              <ConvexClientProvider>
                <AutumnWrapper>
                  <TooltipProvider delayDuration={200}>
                    {children}
                  </TooltipProvider>
                  <Toaster position="top-center" richColors />
                </AutumnWrapper>
              </ConvexClientProvider>
            </ThemeProviderWrapper>
          </NextIntlClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
