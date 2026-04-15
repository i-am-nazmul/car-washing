"use client"
import React from "react";
import { useRouter } from "next/navigation";
import * as motion from "motion/react-client";
import { useIsLoading } from "@/store/store";
import Loader from "@/components/Loader";
import MotionButton from "@/components/MotionButton";
import SiteFooter from "@/components/SiteFooter";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
 



export default function LoginPage(){
      const router = useRouter();
      const [email,setEmail]=React.useState('');
      const [password,setPassword]=React.useState('');
      const {isLoading,setIsLoading}=useIsLoading();

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

      const moveHome = () => {
            router.push("/");
      };

      const moveHomeSection = (sectionId: string) => {
            router.push(`/#${sectionId}`);
      };

      const LoginWithGoogle = () => {
            setIsLoading(true);
            const safeNextPath = getSafeNextPath();
            void signIn("google", { callbackUrl: safeNextPath });
      }


      return(
            <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,#fde68a,#fff7d6_32%,#fefbf0_68%)] p-2 flex flex-col">
                  {isLoading && <Loader message={"Wait"} />}

                  <div className="w-full h-full flex-1 flex flex-col rounded-t-2xl bg-black px-4 py-6 sm:px-8 sm:py-10">


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
                                    onClick={SignUp}
                              >
                                    Signup
                              </MotionButton>
                        </motion.nav>

                        <motion.div
                              initial={{ opacity: 0, y: 24 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1, duration: 0.45 }}
                              className="mx-auto mt-40 w-full max-w-xl rounded-3xl border border-amber-300/30 bg-white/95 p-5 shadow-xl sm:p-6"
                        >
                              <h2 className="text-center text-4xl font-bold  tracking-tighter text-gray-800 sm:text-8xl">Login</h2>

                              <form
                                    className="mt-8 flex flex-col items-center gap-3"
                                    onSubmit={(event) => {
                                          event.preventDefault();
                                          void Login();
                                    }}
                              >
                                    <input
                                          type="email"
                                          placeholder="Enter the email"
                                          className="w-full max-w-xl tracking-tighter outline-none text-xl px-4 py-2 bg-amber-200 rounded-sm text-black border border-gray-400"
                                          value={email}
                                          onChange={(e)=>{setEmail(e.target.value)}}
                                    />

                                    <input
                                          type="password"
                                          placeholder="Enter the password"
                                          className="w-full max-w-xl outline-none tracking-tighter text-xl px-4 py-2 bg-amber-200 rounded-sm text-black border border-gray-400"
                                          value={password}
                                          onChange={(e)=>{setPassword(e.target.value)}}
                                    />

                                    <MotionButton
                                          type="submit"
                                          className="hover-fill-ltr bg-emerald-900 px-6 py-2 text-white font-semibold tracking-tighter text-xl cursor-pointer hover:bg-emerald-950 rounded-lg sm:font-normal sm:text-2xl"
                                    >
                                          Login
                                    </MotionButton>
                              </form>

                              <div className="mt-4 flex flex-col items-center gap-3">
                                    <MotionButton className="hover-fill-ltr bg-emerald-900 text-white px-3 py-2 cursor-pointer font-medium hover:bg-emerald-950 rounded-lg sm:text-xl" onClick={SignUp}>Signup Instead</MotionButton>

                                    <MotionButton className="hover-fill-ltr bg-purple-800 px-6 py-2 text-white font-semibold mt-6 tracking-tighter text-xl cursor-pointer hover:bg-purple-950 rounded-lg border border-gray-400 sm:text-lg"
                                    onClick={LoginWithGoogle}>Login with Google</MotionButton>
                              </div>
                        </motion.div>
                  </div>

                  <SiteFooter />
            </div>
      )

}