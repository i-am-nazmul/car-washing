import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/dashboard", "/profile"];
const guestOnlyRoutes = ["/login", "/signup"];

function isPathMatched(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const secret = process.env.NEXTAUTH_SECRET || process.env.TOKEN_SECRET;

  const sessionToken = await getToken({ req: request, secret });
  const legacyToken = request.cookies.get("token")?.value;
  const isAuthenticated = Boolean(sessionToken || legacyToken);

  const isProtectedRoute = isPathMatched(pathname, protectedRoutes);
  const isGuestOnlyRoute = isPathMatched(pathname, guestOnlyRoutes);

  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isGuestOnlyRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/signup"],
};
