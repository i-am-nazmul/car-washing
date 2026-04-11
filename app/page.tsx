"use client";
import { useRouter } from "next/navigation";
import MotionButton from "@/components/MotionButton";
import SiteFooter from "@/components/SiteFooter";
import { useIsLoading } from "@/store/store";
import Loader from "@/components/Loader";

export default function Home() {
  const router = useRouter();
  const { isLoading, setIsLoading } = useIsLoading();

  const handleGetStarted = function(){
    setIsLoading(true);
    router.push('/signup');
  }
  const handleLogin = function(){
    setIsLoading(true);
    router.push('/login');
  }
  return (
  <div className="min-h-screen w-full p-2 flex flex-col">
    {isLoading && <Loader message={"Wait"} />}
    <div className="w-full h-full rounded-sm flex-1 flex flex-col items-center text-center px-4 py-6 sm:px-8 sm:py-10">

      {/* Heading */}
      <h1 className="font-extrabold text-gray-700 tracking-tighter text-5xl sm:text-7xl lg:text-9xl mt-6 sm:mt-12">
        The Shine Company.
      </h1>

      {/* Image */}


      {/* Buttons */}
      <div className="flex gap-4 sm:gap-10 mt-6 sm:mt-10">
        <MotionButton className="bg-emerald-900 px-4 py-2 text-white font-semibold tracking-tighter text-lg cursor-pointer hover:bg-emerald-950 rounded-lg sm:font-normal sm:px-6 sm:py-3 sm:text-2xl"
          onClick={handleGetStarted}
        >
          Get Started
        </MotionButton>

        <MotionButton
          className="bg-purple-800 px-4 py-2 text-white font-semibold tracking-tighter text-lg cursor-pointer hover:bg-purple-950 rounded-lg border border-gray-400 sm:font-normal sm:px-6 sm:py-3 sm:text-2xl"
          onClick={handleLogin}
        >
          Login
        </MotionButton>

      </div>
    </div>

    <SiteFooter />
  </div>
);

}