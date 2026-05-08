"use client"
import React from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import * as motion from "motion/react-client";
import { useIsLoading } from "@/store/store";
import Loader from "@/components/Loader";
import MotionButton from "@/components/MotionButton";
import SiteFooter from "@/components/SiteFooter";
import toast from "react-hot-toast";
import { getSession } from "next-auth/react";

export default function CompleteProfilePage() {
  const backgroundVideos = React.useMemo(() => ["/washing.mp4", "/washing2.mp4"], []);
  const [activeBackgroundVideoIndex, setActiveBackgroundVideoIndex] = React.useState(0);
  const backgroundVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const { isLoading, setIsLoading } = useIsLoading();
  const router = useRouter();
  const searchParams = useSearchParams();

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
    const value = searchParams.get("next");
    return value && value.startsWith("/") ? value : "/user/dashboard";
  };

  const CompleteProfile = async () => {
    if (!phoneNumber) {
      toast.error("Please enter your phone number!");
      return;
    }

    const phoneDigitsOnly = phoneNumber.replace(/\D/g, '');
    if (phoneDigitsOnly.length < 10 || phoneDigitsOnly.length > 15) {
      toast.error("Please provide a valid phone number (10-15 digits).");
      return;
    }

    setIsLoading(true);
    try {
      const session = await getSession();
      if (!session?.user?.email) {
        toast.error("Session expired. Please login again.");
        setIsLoading(false);
        router.push("/user/login");
        return;
      }

      const response = await axios.post('/api/profile/update-phone', {
        phoneNumber: phoneDigitsOnly,
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        const safeNextPath = getSafeNextPath();
        router.push(safeNextPath);
        router.refresh();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = (error.response?.data as { message?: string })?.message;
        toast.error(message || "Failed to update profile. Please try again.");
      } else {
        toast.error("Unexpected error occurred. Please try again.");
      }
      setIsLoading(false);
    }
  };

  const moveHome = () => {
    router.push("/");
  };

  return (
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
          </motion.nav>

          {/* Profile Completion Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="mx-auto mt-25 w-full max-w-xl rounded-3xl border border-violet-300 bg-transparent p-5 shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:p-6"
          >
            <h2 className="text-center text-2xl font-bold text-white mb-2">Complete Your Profile</h2>
            <p className="text-center text-white/70 mb-6">We need your phone number to complete your registration.</p>

            <form
              className="mt-6 flex flex-col items-center gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                void CompleteProfile();
              }}
            >
              <div className="w-full flex flex-col gap-1">
                <label className="text-white text-sm font-semibold">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full tracking-tighter outline-none text-lg px-4 py-3 bg-transparent rounded-lg text-white placeholder:text-white/50 border border-violet-300 shadow-[0_0_18px_rgba(139,92,246,0.35)] focus:border-amber-300 transition"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value.replace(/\D/g, ''));
                  }}
                />
                <span className="text-xs text-white/50 mt-1">10-15 digits</span>
              </div>

              <MotionButton
                type="submit"
                className="w-full bg-linear-to-r from-violet-500 to-amber-500 text-white px-6 py-3 text-lg font-semibold rounded-lg cursor-pointer hover:from-violet-600 hover:to-amber-600 transition mt-2"
              >
                Complete Profile
              </MotionButton>
            </form>
          </motion.div>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}
