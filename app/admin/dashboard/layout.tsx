import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { hasServerAuth } from "@/lib/serverAuth";
import { connect } from "@/dbconfig/dbconfig";
import Users from "@/models/users.models";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const isAuthenticated = await hasServerAuth();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.trim().toLowerCase();

  if (!email) {
    redirect("/admin/login");
  }

  // Check if user has admin role
  await connect();

  // Query database for user with admin check
  const user = await Users.findOne({
    email,
  }).select("role");

  const normalizedRole = String(user?.role || "").toLowerCase();

  if (!user || normalizedRole !== "admin") {
    // redirect non-admins back to admin login and show unauthorized message
    redirect("/admin/login?unauthorized=1");
  }

  return <>{children}</>;
}
