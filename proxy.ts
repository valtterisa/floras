import {
  convexAuthNextjsMiddleware,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { localizedPath, routing, type Locale } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

function stripLocale(pathname: string): string {
  const stripped = pathname.replace(/^\/(en|fi)(?=\/|$)/, "") || "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

function isProtected(pathname: string): boolean {
  const path = stripLocale(pathname);
  return (
    path.startsWith("/build") ||
    path.startsWith("/dashboard") ||
    path.startsWith("/account")
  );
}

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (isProtected(pathname) && !(await convexAuth.isAuthenticated())) {
    const locale = (pathname.match(/^\/(en|fi)/)?.[1] ??
      routing.defaultLocale) as Locale;
    return nextjsMiddlewareRedirect(request, localizedPath(locale, "login"));
  }

  return intlMiddleware(request);
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
