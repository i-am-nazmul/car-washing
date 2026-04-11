"use client"
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useIsLoading } from "@/store/store";
import Loader from "@/components/Loader";
import MotionButton from "@/components/MotionButton";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";



export default function SignupPage(){
      const [username,setUsername]=React.useState('');
      const [email,setEmail]=React.useState('');
      const [password,setPassword]=React.useState('');
      const {isLoading,setIsLoading}=useIsLoading();
      const router = useRouter();

      React.useEffect(() => {
            setIsLoading(false);
      }, [setIsLoading]);

      const getSafeNextPath = () => {
            if (typeof window === "undefined") {
                  return "/dashboard";
            }
            const value = new URLSearchParams(window.location.search).get("next");
            return value && value.startsWith("/") ? value : "/dashboard";
      };

      const Signup = async () => {
            if(!username || !email || !password){
                  toast.error("Please enter all the fields!");
                  return ;

            }
            setIsLoading(true);
            try {
            const safeNextPath = getSafeNextPath();
            const request = await axios.post('/api/signup', {
                  username,
                  email,
                  password
            });
            if(request.status === 201){
                  const loginResult = await signIn("credentials", {
                        redirect: false,
                        email,
                        password,
                        callbackUrl: safeNextPath,
                  });
                  if (loginResult?.error) {
                        toast.error("Signup succeeded, but login failed. Please login manually.");
                        setIsLoading(false);
                        router.push("/login");
                        return;
                  }
                  toast.success("Signup successful!");
                  router.push(safeNextPath);
                  router.refresh();
            }
      
            } catch (error:unknown) {
                  if (axios.isAxiosError(error)) {
                        const message = (error.response?.data as { message?: string })?.message;
                        toast.error(message || "Signup failed. Please try again.");
                  } else {
                        toast.error("Unexpected error occurred. Please try again.");
                  }
                  setIsLoading(false);
            }
                  
      };
      const Login = () =>{
            router.push('/login');
            
      }

      const SignupWithGoogle = () => {
            setIsLoading(true);
            const safeNextPath = getSafeNextPath();
            void signIn("google", { callbackUrl: safeNextPath });
      }



      return(
            <div className="h-screen w-full p-1">
                  {isLoading ? <Loader message={"Wait"}/>:<div className="w-full h-full rounded-sm border border-gray-400 flex flex-col px-4 py-2 items-center">
                        <div className="w-full">
                              <h1 className="text-7xl font-bold text-gray-700 tracking-tighter ">
                                    SignUp
                              </h1>
                        </div>
                        <div className="flex flex-col gap-2 font-mono justify-center items-center w-full h-full ">

                              <input type="text" 
                              placeholder="Enter your name" 
                              className="outline-none text-2xl px-4 py-2 bg-amber-200 rounded-sm text-black border border-gray-400 tracking-tighter"
                              onChange={(e)=>{setUsername(e.target.value)}} />

                              <input type="text" placeholder="Enter your email" className="outline-none text-2xl px-4 py-2 bg-amber-200 rounded-sm text-black border tracking-tighter border-gray-400"
                              onChange={(e)=>{setEmail(e.target.value)}}/>


                              <input type="password" 
                              placeholder="Enter your password" className="outline-none tracking-tighter text-2xl px-4 py-2 bg-amber-200 rounded-sm text-black border border-gray-400"
                              onChange={(e)=>{setPassword(e.target.value)}}/>

                              <MotionButton className="bg-emerald-900 px-4 py-1 text-white font-semibold tracking-tighter text-2xl cursor-pointer hover:bg-emerald-950 rounded-lg sm:font-normal
                              sm:text-4xl
                              sm:py-2"
                              onClick={Signup}>Signup</MotionButton>


                              <MotionButton className="bg-emerald-900 text-white px-3 py-1 mt-2 cursor-pointer 
                              font-medium hover:bg-emerald-950 rounded-lg 
                              sm:py-2 sm:font-medium sm:text-2xl" onClick={Login}>Already have an account ? Login Instead</MotionButton>

                              <MotionButton className="bg-purple-800 px-4 py-1 text-white font-semibold mt-20 tracking-tighter text-2xl cursor-pointer hover:bg-purple-950 rounded-lg border border-gray-400 sm:font-normal
                              sm:text-2xl
                              sm:py-2"
                              onClick={SignupWithGoogle}>Signup with Google</MotionButton>
                        </div>
                  </div>}
            </div>
      )

}