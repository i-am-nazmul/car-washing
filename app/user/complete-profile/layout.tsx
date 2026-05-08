import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { hasServerAuth } from "@/lib/serverAuth";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function CompleteProfileLayout({ children }: ProtectedLayoutProps) {
  const isAuthenticated = await hasServerAuth();

  if (!isAuthenticated) {
    redirect("/user/login");
  }

  return <>{children}</>;
}
