"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = function(){
    router.push('/signup');
  }
  const handleLogin = function(){
    router.push('/login');
  }
  return (
  <div className="min-h-screen w-screen p-2">
    <div className="w-full h-full rounded-sm  flex flex-col items-center text-center px-4 py-6 sm:px-8 sm:py-10">

      {/* Heading */}
      <h1 className="font-extrabold text-gray-700 tracking-tighter text-5xl sm:text-7xl lg:text-9xl mt-6 sm:mt-12">
        The Shine Company.
      </h1>

      {/* Image */}


      {/* Buttons */}
      <div className="flex gap-4 sm:gap-10 mt-6 sm:mt-10">
        <button className="cursor-pointer bg-purple-800 rounded font-bold text-white px-4 py-2 text-lg sm:px-6 sm:py-3 sm:text-2xl hover:bg-purple-700"
          onClick={handleGetStarted}
        >
          Get Started
        </button>

        <button
          className="cursor-pointer bg-purple-800 rounded font-bold text-white 
                     px-4 py-2 text-lg 
                     sm:px-6 sm:py-3 sm:text-2xl 
                     hover:bg-purple-700"
          onClick={handleLogin}
        >
          Login
        </button>

      </div>
    </div>
  </div>
);

}