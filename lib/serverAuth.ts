import { getServerSession } from "next-auth/next";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";

export async function hasServerAuth() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    return true;
  }

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const nextAuthSessionCookieNames = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
  ];

  const hasNextAuthSessionCookie = allCookies.some((cookie) =>
    nextAuthSessionCookieNames.some(
      (name) => cookie.name === name || cookie.name.startsWith(`${name}.`)
    )
  );

  if (hasNextAuthSessionCookie) {
    return true;
  }

  const token = cookieStore.get("token")?.value;
  if (!token) {
    return false;
  }

  const secret = process.env.TOKEN_SECRET;
  if (!secret) {
    return false;
  }

  try {
    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
}
