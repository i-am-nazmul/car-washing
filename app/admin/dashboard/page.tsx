"use client"
import React, { useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import Loader from "@/components/Loader";
import MotionButton from "@/components/MotionButton";
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

  const moveToHome = function () {
    router.push('/');
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
    <div className="min-h-screen w-full p-1">
      {isLoading && <Loader />}

      {!isLoading && (
        <>
          <div className="flex relative min-h-[calc(100vh-0.5rem)] w-full flex-col bg-white px-2 py-2 sm:px-4 sm:py-4">

            {/* this block contains the header */}
            <div className="flex justify-between ">
              <h1 className="text-4xl font-bold tracking-tight text-red-700 sm:text-5xl lg:text-7xl">Admin Dashboard</h1>

              <div className=" flex gap-2 items-center">
                <MotionButton 
                  className="bg-red-800 text-white rounded-lg cursor-pointer px-2 py-1 text-2xl sm:text-6xl sm:py-2 sm:rounded-sm active:bg-red-700 hover:bg-red-900"
                  onClick={logout}
                >
                  Logout
                </MotionButton>
              </div>
            </div>

            {/* this block contains the body  */}
            <div className="w-full flex flex-col items-center gap-4 mt-4 sm:flex-row">
              {loadError && (
                <div className="w-full rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">
                  <p className="text-lg font-semibold tracking-tight">{loadError}</p>
                  <MotionButton
                    className="mt-3 rounded-lg bg-red-800 px-4 py-1 text-white hover:bg-red-900"
                    onClick={() => void getAdminData()}
                  >
                    Retry
                  </MotionButton>
                </div>
              )}

              <div className="bg-white w-full h-full border border-red-300 rounded-xl flex flex-col items-center sm:max-w-fit sm:p-2">
                <ul className="font-mono tracking-tight px-4 mt-2 bg-red-200 w-max rounded-xl">
                  <li className="w-full text-start px-4 py-2 rounded-xs font-semibold text-gray-700 text-2xl tracking-tighter">👤 {admin}</li>
                  <li className="w-full text-start px-4 py-2 rounded-xs font-semibold text-gray-700 text-2xl tracking-tighter">📧 {email}</li>
                  <li className="w-full text-start px-4 py-2 rounded-xs font-semibold text-red-700 text-2xl tracking-tighter">🔐 Admin Access</li>
                </ul>
                <div className="mt-4 mb-4 flex items-center gap-3">
                  <MotionButton
                    className="bg-red-800 px-4 py-1 text-white font-mono tracking-tighter text-2xl sm:cursor-pointer hover:bg-red-900 rounded-lg sm:rounded-sm"
                    onClick={logout}
                  >
                    Logout
                  </MotionButton>
                  <MotionButton
                    className="bg-slate-700 px-4 py-1 text-white font-mono tracking-tighter text-2xl sm:cursor-pointer hover:bg-slate-800 rounded-lg sm:rounded-sm"
                    onClick={moveToHome}
                  >
                    Home
                  </MotionButton>
                </div>
              </div>
            </div>

          </div>

          <SiteFooter />
        </>
      )}
    </div>
  )
}
