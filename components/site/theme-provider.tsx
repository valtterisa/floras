"use client";

import { ThemeProvider } from "next-themes";
import { useServerInsertedHTML } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import {
  THEME_STORAGE_KEY,
  themeCookieScript,
  type AppTheme,
} from "@/lib/theme";

export function ThemeProviderWrapper({
  children,
  defaultTheme,
}: {
  children: ReactNode;
  defaultTheme: AppTheme;
}) {
  const themeScriptInserted = useRef(false);

  useServerInsertedHTML(() => {
    if (themeScriptInserted.current) return null;
    themeScriptInserted.current = true;
    return (
      <script
        id="theme-cookie-sync"
        dangerouslySetInnerHTML={{ __html: themeCookieScript() }}
      />
    );
  });

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={false}
      storageKey={THEME_STORAGE_KEY}
      disableTransitionOnChange
      scriptProps={{ type: "application/json" }}
    >
      {children}
    </ThemeProvider>
  );
}

export function ReactGrabScript() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const existing = document.querySelector(
      'script[data-react-grab="true"]'
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = "//unpkg.com/react-grab/dist/index.global.js";
    script.crossOrigin = "anonymous";
    script.dataset.reactGrab = "true";
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
