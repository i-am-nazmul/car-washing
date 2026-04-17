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
                                    Home
                              </MotionButton>
                              <MotionButton
                                    className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
                                    onClick={() => moveHomeSection("about")}
                              >
                                    About
                              </MotionButton>
                              <MotionButton
                                    className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
                                    onClick={() => moveHomeSection("how-it-works")}
                              >
                                    How It Works
                              </MotionButton>
                              <MotionButton
                                    className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
                                    onClick={() => moveHomeSection("services")}
                              >
                                    Services
                              </MotionButton>
                              <MotionButton
                                    className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
                                    onClick={() => moveHomeSection("pricing")}
                              >
                                    Pricing
                              </MotionButton>
                              <MotionButton
                                    className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
                                    onClick={() => moveHomeSection("contact")}
                              >
                                    Contact
                              </MotionButton>
                              <MotionButton
                                    className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
                                    onClick={Login}
                              >
                                    Login
                              </MotionButton>
                        </motion.nav>

                        <h2 className="mt-28 text-center text-4xl font-bold tracking-tighter text-yellow-300 sm:text-8xl">SignUp</h2>

                        <motion.div
                              initial={{ opacity: 0, y: 24 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1, duration: 0.45 }}
                              className="mx-auto mt-6 w-full max-w-xl rounded-3xl border border-violet-300 bg-transparent p-5 shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:p-6"
                        >
                              <form
                                    className="mt-8 flex flex-col items-center gap-3"
                                    onSubmit={(event) => {
                                          event.preventDefault();
                                          void Signup();
                                    }}
                              >
                                    <input
                                          type="text"
                                          placeholder="Enter your name"
                                          className="w-full max-w-xl outline-none text-xl px-4 py-2 bg-transparent rounded-sm text-white placeholder:text-white/70 border border-violet-300 shadow-[0_0_18px_rgba(139,92,246,0.35)] tracking-tighter"
                                          value={username}
                                          onChange={(e)=>{setUsername(e.target.value)}}
                                    />

                                    <input
                                          type="email"
                                          placeholder="Enter your email"
                                          className="w-full max-w-xl outline-none text-xl px-4 py-2 bg-transparent rounded-sm text-white placeholder:text-white/70 border tracking-tighter border-violet-300 shadow-[0_0_18px_rgba(139,92,246,0.35)]"
                                          value={email}
                                          onChange={(e)=>{setEmail(e.target.value)}}
                                    />

                                    <input
                                          type="password"
                                          placeholder="Enter your password"
                                          className="w-full max-w-xl outline-none tracking-tighter text-xl px-4 py-2 bg-transparent rounded-sm text-white placeholder:text-white/70 border border-violet-300 shadow-[0_0_18px_rgba(139,92,246,0.35)]"
                                          value={password}
                                          onChange={(e)=>{setPassword(e.target.value)}}
                                    />

                                    <MotionButton
                                          type="submit"
                                          className="hover-fill-ltr bg-transparent px-6 py-2 text-white font-semibold tracking-tighter text-xl cursor-pointer hover:bg-transparent rounded-lg border border-violet-300 shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:font-normal sm:text-2xl"
                                    >
                                          Signup
                                    </MotionButton>
                              </form>

                              <div className="mt-4 flex flex-col items-center gap-3">
                                    <MotionButton className="hover-fill-ltr bg-transparent text-white px-3 py-2 cursor-pointer font-medium hover:bg-transparent rounded-lg border border-violet-300 shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:text-xl" onClick={Login}>Already have an account ? Login Instead</MotionButton>

                                    <MotionButton className="hover-fill-ltr bg-transparent px-4 py-2 text-white font-semibold mt-6 tracking-tighter text-xl cursor-pointer hover:bg-transparent rounded-lg border border-violet-300 shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:text-lg"
                                    onClick={SignupWithGoogle}>Signup with Google</MotionButton>
                              </div>
                        </motion.div>
                  </div>

                  <SiteFooter />
                  </div>
            </div>
      )

}