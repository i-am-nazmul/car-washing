"use client"
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import * as motion from "motion/react-client";
import { useIsLoading } from "@/store/store";
import Loader from "@/components/Loader";
import MotionButton from "@/components/MotionButton";
import SiteFooter from "@/components/SiteFooter";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";



export default function SignupPage(){
      const backgroundVideos = React.useMemo(() => ["/washing.mp4", "/washing2.mp4"], []);
      const [activeBackgroundVideoIndex, setActiveBackgroundVideoIndex] = React.useState(0);
      const backgroundVideoRef = React.useRef<HTMLVideoElement | null>(null);
      const [username,setUsername]=React.useState('');
      const [email,setEmail]=React.useState('');
      const [password,setPassword]=React.useState('');
      const {isLoading,setIsLoading}=useIsLoading();
      const router = useRouter();

      React.useEffect(() => {
            setIsLoading(false);
      }, [setIsLoading]);

      React.useEffect(() => {
            const videoElement = backgroundVideoRef.current;
            if (!videoElement) {
                  return;
            }

            const playPromise = videoElement.play();
            if (playPromise) {
                  playPromise.catch(() => {
                        // Autoplay might be blocked until user interaction.
                  });
            }
      }, [activeBackgroundVideoIndex]);

      const getSafeNextPath = () => {
            if (typeof window === "undefined") {
                  return "/user/dashboard";
            }
            const value = new URLSearchParams(window.location.search).get("next");
            return value && value.startsWith("/") ? value : "/user/dashboard";
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
                        router.push("/user/login");
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
            router.push('/user/login');
            
      }

      const moveHome = () => {
            router.push("/");
      };

      const moveHomeSection = (sectionId: string) => {
            router.push(`/#${sectionId}`);
      };

      const SignupWithGoogle = () => {
            setIsLoading(true);
            const safeNextPath = getSafeNextPath();
            void signIn("google", { callbackUrl: safeNextPath });
      }



      return(
            <div className="relative min-h-screen w-full overflow-x-hidden">
                  <video
                        ref={backgroundVideoRef}
                        key={backgroundVideos[activeBackgroundVideoIndex]}
                        autoPlay
                        muted
                        playsInline
                        preload="metadata"
                        className="fixed inset-0 -z-20 h-full w-full object-cover"
                        onEnded={() => {
                              setActiveBackgroundVideoIndex((prev) => (prev + 1) % backgroundVideos.length);
                        }}
                  >
                        <source src={backgroundVideos[activeBackgroundVideoIndex]} type="video/mp4" />
                  </video>
                  <div className="fixed inset-0 -z-10 bg-[#000017]/70" />

                  <div className="flex min-h-screen flex-col p-2">
                  {isLoading && <Loader />}

                  <div className="w-full h-full flex-1 flex flex-col rounded-t-2xl bg-transparent px-4 py-6 sm:px-8 sm:py-10">
                        {/* Navbar */}
                        <motion.nav
                              initial={{ opacity: 0, y: -24 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.45 }}
                              className="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-3"
                        >
                              <MotionButton
                                    className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
                                    onClick={moveHome}
                              >
                                    HOME
                              </MotionButton>
                              <MotionButton
                                    className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
                                    onClick={() => moveHomeSection("about")}
                              >
                                    ABOUT US
                              </MotionButton>
                              <MotionButton
                                    className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
                                    onClick={() => moveHomeSection("how-it-works")}
                              >
                                    HOW IT WORKS
                              </MotionButton>
                              <MotionButton
                                    className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
                                    onClick={() => moveHomeSection("services")}
                              >
                                    OUR SERVICES
                              </MotionButton>
                              <MotionButton
                                    className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
                                    onClick={() => moveHomeSection("pricing")}
                              >
                                    PRICING
                              </MotionButton>
                              <MotionButton
                                    className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
                                    onClick={() => moveHomeSection("contact")}
                              >
                                    CONTACT US
                              </MotionButton>
                              <MotionButton
                                    className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
                                    onClick={Login}
                              >
                                    LOGIN
                              </MotionButton>
                        </motion.nav>

                        <motion.div
                              initial={{ opacity: 0, y: 24 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1, duration: 0.45 }}
                              className="mx-auto mt-25 w-full max-w-xl rounded-3xl border border-violet-300 bg-transparent p-5 shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:p-6"
                        >
                              {/* Google Signup Button - Top */}
                              <MotionButton 
                                    className="w-full bg-white text-gray-800 px-6 py-3 text-lg font-semibold rounded-lg cursor-pointer hover:bg-gray-100 transition flex items-center justify-center gap-2"
                                    onClick={SignupWithGoogle}
                              >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Continue with Google
                              </MotionButton>

                              <div className="my-4 flex items-center gap-3">
                                    <div className="flex-1 h-px bg-violet-300/40"></div>
                                    <span className="text-white text-sm">OR</span>
                                    <div className="flex-1 h-px bg-violet-300/40"></div>
                              </div>

                              <form
                                    className="mt-6 flex flex-col items-center gap-4"
                                    onSubmit={(event) => {
                                          event.preventDefault();
                                          void Signup();
                                    }}
                              >
                                    <div className="w-full flex flex-col gap-1">
                                          <label className="text-white text-sm font-semibold">Full name</label>
                                          <input
                                                type="text"
                                                placeholder="Enter your name"
                                                className="w-full tracking-tighter outline-none text-lg px-4 py-3 bg-transparent rounded-lg text-white placeholder:text-white/50 border border-violet-300 shadow-[0_0_18px_rgba(139,92,246,0.35)] focus:border-amber-300 transition"
                                                value={username}
                                                onChange={(e)=>{setUsername(e.target.value)}}
                                          />
                                    </div>

                                    <div className="w-full flex flex-col gap-1">
                                          <label className="text-white text-sm font-semibold">Email address</label>
                                          <input
                                                type="email"
                                                placeholder="Enter your email"
                                                className="w-full tracking-tighter outline-none text-lg px-4 py-3 bg-transparent rounded-lg text-white placeholder:text-white/50 border border-violet-300 shadow-[0_0_18px_rgba(139,92,246,0.35)] focus:border-amber-300 transition"
                                                value={email}
                                                onChange={(e)=>{setEmail(e.target.value)}}
                                          />
                                    </div>

                                    <div className="w-full flex flex-col gap-1">
                                          <label className="text-white text-sm font-semibold">Password</label>
                                          <input
                                                type="password"
                                                placeholder="Enter your password"
                                                className="w-full outline-none tracking-tighter text-lg px-4 py-3 bg-transparent rounded-lg text-white placeholder:text-white/50 border border-violet-300 shadow-[0_0_18px_rgba(139,92,246,0.35)] focus:border-amber-300 transition"
                                                value={password}
                                                onChange={(e)=>{setPassword(e.target.value)}}
                                          />
                                    </div>

                                    <MotionButton
                                          type="submit"
                                          className="w-full bg-gradient-to-r from-violet-500 to-amber-500 text-white px-6 py-3 text-lg font-semibold rounded-lg cursor-pointer hover:from-violet-600 hover:to-amber-600 transition mt-2"
                                    >
                                          Continue
                                    </MotionButton>
                              </form>

                              <div className="mt-6 text-center">
                                    <p className="text-white text-sm">
                                          Already have an account?{" "}
                                          <MotionButton 
                                                onClick={Login}
                                                className="text-green-400 font-semibold cursor-pointer hover:text-green-300 transition inline"
                                          >
                                                Login
                                          </MotionButton>
                                    </p>
                              </div>
                        </motion.div>
                  </div>

                  <SiteFooter />
                  </div>
            </div>
      )

}