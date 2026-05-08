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
      const [phoneNumber,setPhoneNumber] = React.useState('');
      const [isEditingPhone,setIsEditingPhone] = React.useState(false);
      const [newPhoneNumber,setNewPhoneNumber] = React.useState('');
      const {isLoading,setIsLoading}=useIsLoading();
      const router = useRouter();

      const moveToDashboard = function (){
            router.push('/user/dashboard');
      }

      const logout = async function () {
            setIsLoading(true);
            try {
                  await axios.post('/api/logout');
                  await signOut({ redirect: false });
                  setIsLoading(false);
                  router.push('/user/login');
            } catch {
                  setIsLoading(false);
            }
      }

      const updatePhoneNumber = async function () {
            if (!newPhoneNumber.trim()) {
                  setIsEditingPhone(false);
                  return;
            }

            const phoneDigitsOnly = newPhoneNumber.replace(/\D/g, '');
            if (phoneDigitsOnly.length < 10 || phoneDigitsOnly.length > 15) {
                  alert('Please enter a valid phone number (10-15 digits)');
                  return;
            }

            setIsLoading(true);
            try {
                  const response = await axios.post('/api/profile/update-phone', {
                        phoneNumber: phoneDigitsOnly,
                  });

                  if (response.status === 200) {
                        setPhoneNumber(phoneDigitsOnly);
                        setNewPhoneNumber(phoneDigitsOnly);
                        setIsEditingPhone(false);
                  }
            } catch (error: unknown) {
                  if (axios.isAxiosError(error)) {
                        const message = (error.response?.data as { message?: string })?.message;
                        alert(message || 'Failed to update phone number');
                  }
            } finally {
                  setIsLoading(false);
            }
      }

      const moveToHome = function () {
            router.push('/');
      }

      const getUserData = useCallback(async function (){
            setIsLoading(true);
            try {
                  const userData = await axios.get('/api/profile');
                  setUser(userData.data?.username || "User");
                  setEmail(userData.data?.email || "");
                  setPhoneNumber(userData.data?.phoneNumber || "");
                  setNewPhoneNumber(userData.data?.phoneNumber || "");
                  setIsLoading(false);
            } catch (error: unknown) {
                  console.error("Profile API error:", error);

                  if (axios.isAxiosError(error)) {
                        const status = error.response?.status;
                        if (status === 401 || status === 403) {
                              setIsLoading(false);
                              router.push('/user/login');
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
      {isLoading && <Loader />}

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
                              <li className="w-full text-start px-4 py-2 rounded-xs font-semibold text-gray-700 text-2xl tracking-tighter">
                                    {phoneNumber ? phoneNumber : "No phone number"}
                              </li>
                        </ul>

                        {!isEditingPhone ? (
                              <MotionButton
                                    className="mt-3 mb-2 bg-blue-600 px-4 py-1 text-white font-mono tracking-tighter text-lg sm:cursor-pointer hover:bg-blue-700 rounded-lg sm:rounded-sm"
                                    onClick={() => setIsEditingPhone(true)}
                              >
                                    Edit Phone
                              </MotionButton>
                        ) : (
                              <div className="mt-3 mb-2 flex gap-2 flex-col w-full px-4">
                                    <input
                                          type="tel"
                                          placeholder="Enter phone number"
                                          value={newPhoneNumber}
                                          onChange={(e) => setNewPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                          className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 font-mono"
                                    />
                                    <div className="flex gap-2">
                                          <MotionButton
                                                className="flex-1 bg-green-600 px-3 py-1 text-white font-mono tracking-tighter text-sm sm:cursor-pointer hover:bg-green-700 rounded-lg sm:rounded-sm"
                                                onClick={updatePhoneNumber}
                                          >
                                                Save
                                          </MotionButton>
                                          <MotionButton
                                                className="flex-1 bg-gray-600 px-3 py-1 text-white font-mono tracking-tighter text-sm sm:cursor-pointer hover:bg-gray-700 rounded-lg sm:rounded-sm"
                                                onClick={() => {
                                                      setIsEditingPhone(false);
                                                      setNewPhoneNumber(phoneNumber);
                                                }}
                                          >
                                                Cancel
                                          </MotionButton>
                                    </div>
                              </div>
                        )}

                        <div className="mt-4 mb-4 flex items-center gap-3">
                              <MotionButton
                                    className="bg-emerald-800 px-4 py-1 text-white font-mono tracking-tighter text-2xl sm:cursor-pointer hover:bg-emerald-900 rounded-lg sm:rounded-sm"
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

