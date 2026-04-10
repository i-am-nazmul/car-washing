"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { useIsLoading } from "@/store/store";
import Loader from "@/components/Loader";
import MotionButton from "@/components/MotionButton";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
 



export default function LoginPage(){
      const router = useRouter();
      const [email,setEmail]=React.useState('');
      const [password,setPassword]=React.useState('');
      const {isLoading,setIsLoading}=useIsLoading();

      const getSafeNextPath = () => {
            if (typeof window === "undefined") {
                  return "/dashboard";
            }
            const value = new URLSearchParams(window.location.search).get("next");
            return value && value.startsWith("/") ? value : "/dashboard";
      };

      const Login = async () => {
            if(!email || !password){
                  toast.error("Please enter valid credentials!");

                  return;

            }
            try {
                  setIsLoading(true);
            const safeNextPath = getSafeNextPath();
            const result = await signIn("credentials", {
                  redirect: false,
                  email,
                  password,
                  callbackUrl: safeNextPath,
            });
            if (!result?.error) {
                  toast.success("Login successful!");
                  router.push(safeNextPath);
                  router.refresh();
                  return;
                  
            }
      
            toast.error("Invalid credentials!");
            setIsLoading(false);
            } catch {
                  toast.error("Something went wrong. Please try again.");
                  setIsLoading(false);
            }
      };

      const SignUp = () =>{
            router.push("/signup");
      }

      const LoginWithGoogle = () => {
            setIsLoading(true);
            const safeNextPath = getSafeNextPath();
            void signIn("google", { callbackUrl: safeNextPath });
      }


      return(
            <div className="h-screen w-full p-1">
                  <div className="w-full h-full rounded-sm border border-gray-400 flex flex-col px-4 py-2 items-center">
                        <div className="w-full">
                              <h1 className="text-7xl font-bold text-gray-700 tracking-tighter">
                                    Login
                              </h1>
                        </div>
                        {isLoading ?<Loader message={"Wait"}/>:<div className="flex flex-col gap-2 font-mono justify-center items-center w-full h-full ">

                              

                              <input type="text" placeholder="Enter the email" className="tracking-tighter outline-none text-2xl px-4 py-2 bg-amber-200 rounded-sm text-black border border-gray-400"
                              onChange={(e)=>{setEmail(e.target.value)}}/>


                              <input type="password" 
                              placeholder="Enter the password" className="outline-none tracking-tighter text-2xl px-4 py-2 bg-amber-200 rounded-sm text-black border border-gray-400"
                              onChange={(e)=>{setPassword(e.target.value)}}/>

                              <MotionButton className="bg-emerald-900 px-4 py-1 text-white font-semibold tracking-tighter text-2xl cursor-pointer hover:bg-emerald-950 rounded-lg sm:font-normal
                              sm:text-4xl
                              sm:py-2"
                              onClick={Login}>Login</MotionButton>


                              <MotionButton className="bg-emerald-900 text-white px-3 py-1 mt-2 cursor-pointer 
                              font-medium hover:bg-emerald-950 rounded-lg 
                              sm:py-2 sm:font-medium sm:text-2xl" onClick={SignUp}>Signup Instead</MotionButton>

                              <MotionButton className="bg-purple-800 px-6  text-white font-semibold mt-20 tracking-tighter text-4xl cursor-pointer hover:bg-purple-950 rounded-lg border border-gray-400 sm:font-normal
                              sm:text-2xl
                              sm:py-2"
                              onClick={LoginWithGoogle}>Login with Google</MotionButton>
                        </div>}
                  </div>
            </div>
      )

}