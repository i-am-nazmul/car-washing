import { getServerSession } from "next-auth/next";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth";

export async function hasServerAuth() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    return true;
  }

  const cookieStore = await cookies();

  const authSecret = process.env.NEXTAUTH_SECRET || process.env.TOKEN_SECRET;
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  if (cookieHeader && authSecret) {
    const tokenRequest = {
      headers: { cookie: cookieHeader },
    } as Parameters<typeof getToken>[0]["req"];

    const sessionToken = await getToken({
      req: tokenRequest,
      secret: authSecret,
      secureCookie: process.env.NODE_ENV === "production",
    });

    const fallbackSessionToken = sessionToken ?? await getToken({
      req: tokenRequest,
      secret: authSecret,
      secureCookie: process.env.NODE_ENV !== "production",
    });

    if (fallbackSessionToken?.email) {
      return true;
    }
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
