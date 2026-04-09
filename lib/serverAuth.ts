import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth";

export async function hasServerAuth() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    return true;
  }

  const token = (await cookies()).get("token")?.value;
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
