import NextAuth from "next-auth";
import authConfig from "@/auth.config";

import { NextResponse } from "next/server";

import {
  DEFAULT_LOGIN_REDIRECT_URL,
  apiAuthPrefix,
  checkRoutesPrefix,
  authRoutes,
  protectedRoutes,
  publicRoutes,
  protectedRoutesPrefixes,
} from "./routes";

import { env } from "@/env.mjs";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isCheckRoute = nextUrl.pathname.startsWith(checkRoutesPrefix);
  const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname) || protectedRoutesPrefixes.some((p) => nextUrl.pathname.startsWith(p));
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  const slugRoute = req.nextUrl.pathname.split("/").pop();

  // Subdomain detection:
  const host = nextUrl.host; // includes domain and subdomain
  const primaryHost = env.PRIMARY_HOST; // e.g., rout.aars.works
  let handledBySubdomain = false;

  if (host && primaryHost && host !== primaryHost && host.endsWith("." + primaryHost.split(".").slice(1).join("."))) {
    // Extract subdomain part before the primary host's root domain
    const hostParts = host.split(".");
    const primaryParts = primaryHost.split(".");
    if (hostParts.length > primaryParts.length) {
      const subdomain = hostParts.slice(0, hostParts.length - primaryParts.length).join(".");
      if (subdomain) {
        const path = nextUrl.pathname;
        const query = nextUrl.search ?? "";

        // Call API to resolve (avoid Prisma in Edge middleware)
        const resolveUrl = new URL(`/api/resolve-subdomain?subdomain=${encodeURIComponent(subdomain)}&path=${encodeURIComponent(path)}&query=${encodeURIComponent(query)}`, nextUrl);
        const res = await fetch(resolveUrl.toString(), { headers: { "x-mw": "1" } });
        const result: { notFound?: boolean; error?: boolean; message?: string; redirectUrl?: string; statusCode?: number; renderUrl?: string } = await res.json();

        handledBySubdomain = true;
        if (result.notFound) {
          return NextResponse.json({ error: "Subdomain not found" }, { status: 404 });
        }
        if (result.error) {
          return NextResponse.json({ error: result.message ?? "Error" }, { status: 500 });
        }
        if (result.redirectUrl) {
          return NextResponse.redirect(result.redirectUrl, { status: result.statusCode ?? 302 });
        }
        if (result.renderUrl) {
          const rewriteUrl = new URL(`/api/_proxy?url=${encodeURIComponent(result.renderUrl)}`, nextUrl);
          return NextResponse.rewrite(rewriteUrl);
        }
      }
    }
  }

  // If subdomain handled, stop here
  if (handledBySubdomain) {
    return;
  }

  // ⚙️ Is Api Route:
  if (isApiAuthRoute) {
    return;
  }

  // ⚙️ Is Auth Route. First, check is authenticated:
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT_URL, nextUrl),
      );
    }
    return;
  }

  // ⚙️ If Slug contains ``c``, redirect to /check/:slug:
  if (slugRoute?.endsWith("&c")) {
    return NextResponse.redirect(
      new URL(`/check/${slugRoute.replace("&c", "")}`, nextUrl),
    );
  }

  // ⚙️ Protected routes. If not authenticated, redirect to /auth:
  if (!isLoggedIn && isProtectedRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(
      new URL(`/auth?callbackUrl=${encodedCallbackUrl}`, nextUrl),
    );
  }

  // ⚙️ Redirect using slug:
  // If not public route and not protected route:
  if (!isPublicRoute && !isProtectedRoute && !isCheckRoute) {
    const apiUrl = new URL(`/api/resolve-slug?slug=${encodeURIComponent(slugRoute ?? "")}`, nextUrl);
    const res = await fetch(apiUrl.toString(), { headers: { "x-mw": "1" } });
    const data: { redirect404?: boolean; error?: boolean; message?: string; url?: string } = await res.json();

    if (data.redirect404) {
      console.log("🚧 Error - Redirect 404: ", slugRoute);
    }

    if (data.error) {
      return NextResponse.json({ error: data.message }, { status: 500 });
    }

    if (data.url) {
      return NextResponse.redirect(new URL(data.url).toString());
    }
  }
  return;
});

export const config = {
  matcher: [
    "/((?!api/|_next/|images/|docs/|_proxy/|_static|_vercel|[\\w-]+\\.\\w+).*)",
    "/s/:slug*",
  ],
};
