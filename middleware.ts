import { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./routes";
import { SHORTEN_DOMAIN } from "./lib/utils";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const sessionCookie = getSessionCookie(req);
  const isLoggedIn = !!sessionCookie;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  const isRedirectionDomain = nextUrl.hostname == SHORTEN_DOMAIN();

  if (isRedirectionDomain) {
    return Response.redirect(
      new URL(`/r/${nextUrl.pathname.split("/").pop() || ""}`, nextUrl),
      302
    );
  }

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    if (nextUrl.pathname === "/auth/logout") {
      return Response.redirect(new URL(`/auth?callbackUrl=%2F`, nextUrl));
    }

    return Response.redirect(
      new URL(`/auth?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
