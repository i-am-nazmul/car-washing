import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

const protectedRoutes = ["/user/dashboard", "/user/profile"];
const adminRoutes = ["/admin/dashboard", "/admin/profile"];
const guestOnlyRoutes = ["/user/login", "/user/signup"];

function isPathMatched(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const secret = process.env.NEXTAUTH_SECRET || process.env.TOKEN_SECRET;
  const tokenSecret = process.env.TOKEN_SECRET;

  const secureCookie = request.nextUrl.protocol === "https:";
  let sessionToken = await getToken({ req: request, secret, secureCookie });
  if (!sessionToken) {
    sessionToken = await getToken({ req: request, secret, secureCookie: !secureCookie });
  }

  const legacyToken = request.cookies.get("token")?.value;
  let hasValidLegacyToken = false;

  if (legacyToken && tokenSecret) {
    try {
      jwt.verify(legacyToken, tokenSecret);
      hasValidLegacyToken = true;
    } catch {
      hasValidLegacyToken = false;
    }
  }

  const isSessionAuthenticated = Boolean(sessionToken);
  const isLegacyAuthenticated = hasValidLegacyToken;
  const isAuthenticated = Boolean(isSessionAuthenticated || isLegacyAuthenticated);

  const isProtectedRoute = isPathMatched(pathname, protectedRoutes);
  const isAdminRoute = isPathMatched(pathname, adminRoutes);
  const isGuestOnlyRoute = isPathMatched(pathname, guestOnlyRoutes);

  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/user/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (!isSessionAuthenticated && isAdminRoute) {
    const isAdmin = pathname.startsWith("/admin");
    const loginUrl = isAdmin 
      ? new URL("/admin/login", request.url)
      : new URL("/user/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isGuestOnlyRoute) {
    if (pathname.startsWith("/admin")) {
      const isAdminRole = sessionToken?.role === "admin";
      return NextResponse.redirect(new URL(
        isAdminRole ? "/admin/dashboard" : "/user/dashboard",
        request.url
      ));
    }

    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/dashboard/:path*",
    "/user/profile/:path*",
    "/user/login",
    "/user/signup",
    "/admin/dashboard/:path*",
    "/admin/profile/:path*",
    "/admin/login",
  ],
};