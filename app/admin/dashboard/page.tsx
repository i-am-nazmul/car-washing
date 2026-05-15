"use client"
import React, { useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import Loader from "@/components/Loader";
import MotionButton from "@/components/MotionButton";
import PremiumUsersPanel from "@/components/admin/PremiumUsersPanel";
import AdminMessages from "@/components/admin/AdminMessages";
import { useIsLoading } from "@/store/store";
import { signOut } from "next-auth/react";

export default function AdminDashboardPage() {
  const [admin, setAdmin] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [loadError, setLoadError] = React.useState('');
  const { isLoading, setIsLoading } = useIsLoading();
  const router = useRouter();

  const logout = async function () {
    setIsLoading(true);
    try {
      await axios.post('/api/logout');
      await signOut({ redirect: false });
      setIsLoading(false);
      router.push('/admin/login');
    } catch {
      setIsLoading(false);
    }
  }

  const getAdminData = useCallback(async function () {
    setLoadError('');
    setIsLoading(true);
    try {
      const userData = await axios.get('/api/profile', { timeout: 8000 });
      
      // Verify admin role
      if (userData.data?.role !== "admin") {
        setIsLoading(false);
        router.push('/user/dashboard');
        return;
      }
      
      setAdmin(userData.data?.username || "Admin");
      setEmail(userData.data?.email || "");
      setIsLoading(false);
    } catch (error: unknown) {
      console.error("Admin profile API error:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          setIsLoading(false);
          router.push('/admin/login');
          return;
        }
      }

      setLoadError('Unable to load admin data right now. Please retry.');
      setIsLoading(false);
    }
  }, [router, setIsLoading])

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void getAdminData();
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [getAdminData])

  return (
    <div className="min-h-screen w-full p-1" style={{fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"}}>
      {isLoading && <Loader />}

      {!isLoading && (
        <>
          <div className="flex relative min-h-[calc(100vh-0.5rem)] w-full flex-col bg-white px-2 py-2 sm:px-4 sm:py-4">

            {/* this block contains the header */}
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-700 sm:text-5xl lg:text-7xl">Admin Dashboard</h1>

              <div className="flex items-center gap-3">
                <AdminMessages />
                <MotionButton 
                  className="bg-gray-700 text-white rounded-lg cursor-pointer px-3 py-2 text-sm sm:text-base active:bg-gray-600 hover:bg-gray-800"
                  onClick={logout}
                >
                  Logout
                </MotionButton>
              </div>
            </div>

            {/* this block contains the body  */}
            <div className="w-full flex flex-col lg:flex-row gap-4 mt-4">
              {/* Left side - Admin Info */}
              <div className="w-full lg:w-auto lg:flex-shrink-0">
                {loadError && (
                  <div className="w-full rounded-xl border border-gray-300 bg-gray-50 p-4 text-gray-800 mb-4">
                    <p className="text-lg font-semibold tracking-tight">{loadError}</p>
                    <MotionButton
                      className="mt-3 rounded-lg bg-gray-700 px-4 py-1 text-white cursor-pointer hover:bg-gray-800"
                      onClick={() => void getAdminData()}
                    >
                      Retry
                    </MotionButton>
                  </div>
                )}

                <div className="bg-white border border-gray-300 rounded-xl flex flex-col items-center p-4">
                  <ul className="px-4 bg-gray-100 w-max rounded-xl">
                    <li className="w-full text-start px-4 py-2 rounded-xs font-semibold text-gray-700 text-lg">👤 {admin}</li>
                    <li className="w-full text-start px-4 py-2 rounded-xs font-semibold text-gray-700 text-lg">📧 {email}</li>
                    <li className="w-full text-start px-4 py-2 rounded-xs font-semibold text-gray-700 text-lg">🔐 Admin Access</li>
                  </ul>
                </div>
              </div>

              {/* Right side - Users Panel */}
              <div className="w-full lg:w-1/3 h-[500px] overflow-hidden ml-auto\">
                <PremiumUsersPanel />
              </div>
            </div>

          </div>

          <SiteFooter />
        </>
      )}
    </div>
  )
}
