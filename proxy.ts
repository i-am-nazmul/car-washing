import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/user/dashboard", "/user/profile"];
const guestOnlyRoutes = ["/user/login", "/user/signup"];

function isPathMatched(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const secret = process.env.NEXTAUTH_SECRET || process.env.TOKEN_SECRET;

  const secureCookie = request.nextUrl.protocol === "https:";
  const sessionToken = await getToken({ req: request, secret, secureCookie });
  const legacyToken = request.cookies.get("token")?.value;
  const isAuthenticated = Boolean(sessionToken || legacyToken);

  const isProtectedRoute = isPathMatched(pathname, protectedRoutes);
  const isGuestOnlyRoute = isPathMatched(pathname, guestOnlyRoutes);

  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/user/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isGuestOnlyRoute) {
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
  ],
};