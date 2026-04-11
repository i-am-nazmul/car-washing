"use client"
import React, { useCallback, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useIsLoading } from "@/store/store";
import Loader from "@/components/Loader";
import MotionButton from "@/components/MotionButton";
import SiteFooter from "@/components/SiteFooter";
import { signOut } from "next-auth/react";


export default function ProfilePage(){
      const [user,setUser] = React.useState('');
      const [email,setEmail] = React.useState('');
      const [loaderMessage, setLoaderMessage] = React.useState("Fetching your details");
      const {isLoading,setIsLoading}=useIsLoading();
      const router = useRouter();

      const moveToDashboard = function (){
            router.push('/dashboard');
      }

      const logout = async function () {
            setLoaderMessage("Logging you out");
            setIsLoading(true);
            try {
                  await axios.post('/api/logout');
                  await signOut({ redirect: false });
                  setIsLoading(false);
                  router.push('/login');
            } catch {
                  setIsLoading(false);
            }
      }

      const getUserData = useCallback(async function (){
            setLoaderMessage("Fetching your details");
            setIsLoading(true);
            try {
                  const userData = await axios.get('/api/profile');
                  setUser(userData.data?.username || "User");
                  setEmail(userData.data?.email || "");
                  setIsLoading(false);
            } catch (error: unknown) {
                  console.error("Profile API error:", error);

                  if (axios.isAxiosError(error)) {
                        const status = error.response?.status;
                        if (status === 401 || status === 403) {
                              setIsLoading(false);
                              router.push('/login');
                              return;
                        }
                  }

                  setIsLoading(false);
            }

            },[router, setIsLoading])

      useEffect(()=>{
            const timerId = window.setTimeout(() => {
                  void getUserData();
            }, 0);

            return () => {
                  window.clearTimeout(timerId);
            };
      },[getUserData])



      return (
<div className="min-h-screen w-full p-1">
      {isLoading && <Loader message={loaderMessage} />}

      {!isLoading && (
      <>
      <div className="flex relative min-h-[calc(100vh-0.5rem)] w-full flex-col bg-white px-2 py-2 sm:px-4 sm:py-4">

            
            {/* this block contains the header */}
            <div className="flex justify-between ">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-700 sm:text-5xl lg:text-7xl">Profile</h1>

                  <div className=" flex gap-2 items-center">
                        
                        <MotionButton className="bg-emerald-800 text-white rounded-lg cursor-pointer px-2 py-1 text-2xl sm:text-6xl 
                        sm:py-2 
                        sm:rounded-sm active:bg-emerald-700"
                        onClick={moveToDashboard}
                        >Dashboard</MotionButton>                                   
                  </div>
            </div>
            

            {/* this block contains the body  */}
            <div className="w-full flex flex-col items-center gap-4 mt-4
            sm:flex-row">
                  <div className="bg-white w-full h-full border border-gray-200 rounded-xl flex flex-col items-center
                  sm:max-w-fit
                  sm:p-2">
                        <ul className="font-mono tracking-tight px-4 mt-2 bg-amber-200 w-max rounded-xl">
                              <li className="w-full text-start px-4 py-2 rounded-xs font-semibold text-gray-700 text-2xl tracking-tighter">{user}</li>
                              <li className="w-full text-start px-4 py-2 rounded-xs font-semibold text-gray-700 text-2xl tracking-tighter">{email}</li>
                        </ul>
                        <MotionButton className="bg-emerald-800 px-4 py-1 text-white font-mono tracking-tighter text-2xl mt-4 mb-4 sm:cursor-pointer hover:bg-emerald-900 rounded-lg
                        sm:rounded-sm"
                  onClick={logout}>Logout</MotionButton>
                  </div>
            </div>

	</div>

      <SiteFooter />
      </>
      )}
</div>
            
      )
}

