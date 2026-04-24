"use client"
import React from "react";
import { useRouter } from "next/navigation";
import * as motion from "motion/react-client";
import { useIsLoading } from "@/store/store";
import Loader from "@/components/Loader";
import MotionButton from "@/components/MotionButton";
import SiteFooter from "@/components/SiteFooter";
import toast from "react-hot-toast";
import { signIn, signOut } from "next-auth/react";
import axios from "axios";
 



export default function AdminLoginPage(){
      const router = useRouter();
      const backgroundVideos = React.useMemo(() => ["/washing.mp4", "/washing2.mp4"], []);
      const [activeBackgroundVideoIndex, setActiveBackgroundVideoIndex] = React.useState(0);
      const backgroundVideoRef = React.useRef<HTMLVideoElement | null>(null);
      const [email,setEmail]=React.useState('');
      const [password,setPassword]=React.useState('');
      const {isLoading,setIsLoading}=useIsLoading();

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

      const AdminLogin = async () => {
            if(!email || !password){
                  toast.error("Please enter valid credentials!");
                  return;
            }
            try {
                  setIsLoading(true);
            const result = await signIn("credentials", {
                  redirect: false,
                  email,
                  password,
                  callbackUrl: "/admin/dashboard",
            });
            if (!result?.error) {
                  const profile = await axios.get('/api/profile', { timeout: 8000 });
                  if (profile.data?.role !== "admin") {
                        await signOut({ redirect: false });
                        toast.error("Only admins can login from this page.");
                        setIsLoading(false);
                        return;
                  }

                  toast.success("Admin login successful!");
                  window.location.assign("/admin/dashboard");
                  return;
            }
      
            toast.error("Invalid admin credentials or insufficient permissions!");
            setIsLoading(false);
            } catch {
                  toast.error("Something went wrong. Please try again.");
                  setIsLoading(false);
            }
      };

      const LoginWithGoogle = () => {
            setIsLoading(true);
            void signIn("google", { callbackUrl: "/admin/dashboard" });
      }

      const moveHome = () => {
            router.push("/");
      };

      const moveBack = () => {
            router.back();
      };


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
                              className="w-full flex flex-wrap items-center justify-between gap-2 sm:gap-3"
                        >
                              <MotionButton
                                    className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
                                    onClick={moveHome}
                              >
                                    Home
                              </MotionButton>
                              <MotionButton
                                    className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
                                    onClick={moveBack}
                              >
                                    Back
                              </MotionButton>
                        </motion.nav>

                        <h2 className="mt-28 text-center text-4xl font-bold tracking-tighter text-yellow-300 sm:text-8xl">Admin Login</h2>

                        <motion.div
                              initial={{ opacity: 0, y: 24 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1, duration: 0.45 }}
                              className="mx-auto mt-6 w-full max-w-xl rounded-3xl border border-red-400 bg-transparent p-5 shadow-[0_0_18px_rgba(220,38,38,0.35)] sm:p-6"
                        >
                              <form
                                    className="mt-8 flex flex-col items-center gap-3"
                                    onSubmit={(event) => {
                                          event.preventDefault();
                                          void AdminLogin();
                                    }}
                              >
                                    <input
                                          type="email"
                                          placeholder="Enter admin email"
                                          className="w-full max-w-xl tracking-tighter outline-none text-xl px-4 py-2 bg-transparent rounded-sm text-white placeholder:text-white/70 border border-red-400 shadow-[0_0_18px_rgba(220,38,38,0.35)]"
                                          value={email}
                                          onChange={(e)=>{setEmail(e.target.value)}}
                                    />

                                    <input
                                          type="password"
                                          placeholder="Enter admin password"
                                          className="w-full max-w-xl outline-none tracking-tighter text-xl px-4 py-2 bg-transparent rounded-sm text-white placeholder:text-white/70 border border-red-400 shadow-[0_0_18px_rgba(220,38,38,0.35)]"
                                          value={password}
                                          onChange={(e)=>{setPassword(e.target.value)}}
                                    />

                                    <MotionButton
                                          type="submit"
                                          className="hover-fill-ltr bg-transparent px-6 py-2 text-white font-semibold tracking-tighter text-xl cursor-pointer hover:bg-transparent rounded-lg border border-red-400 shadow-[0_0_18px_rgba(220,38,38,0.35)] sm:font-normal sm:text-2xl"
                                    >
                                          Admin Login
                                    </MotionButton>
                              </form>

                              <div className="mt-4 flex flex-col items-center gap-3">
                                    <MotionButton className="hover-fill-ltr bg-transparent px-6 py-2 text-white font-semibold mt-6 tracking-tighter text-xl cursor-pointer hover:bg-transparent rounded-lg border border-red-400 shadow-[0_0_18px_rgba(220,38,38,0.35)] sm:text-lg"
                                    onClick={LoginWithGoogle}>Login with Google</MotionButton>
                              </div>
                        </motion.div>
                  </div>

                  <SiteFooter />
                  </div>
            </div>
      )

}
