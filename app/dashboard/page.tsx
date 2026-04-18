"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import Loader from "@/components/Loader";
import { useIsLoading } from "@/store/store";

export default function DashboardPage() {
  const [headline, setHeadline] = React.useState("Hello ");
  const { isLoading, setIsLoading } = useIsLoading();
  const router = useRouter();

  const moveToProfilePage = React.useCallback(() => {
    router.push("/profile");
  }, [router]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const loadHeadline = async () => {
      setIsLoading(true);
      try {
        const profile = await axios.get("/api/profile");
        const rawName = profile.data?.username?.trim() || "there";
        const shortName = rawName.split(/\s+/)[0] || rawName;
        const fullText = `${shortName}`;
        let index = 0;

        setHeadline("Hello ");
        intervalId = setInterval(() => {
          index += 1;
          setHeadline(`Hello ${fullText.slice(0, index)}`);
          if (index >= fullText.length && intervalId) {
            clearInterval(intervalId);
            setIsLoading(false);
          }
        }, 90);
      } catch {
        setHeadline("Hello there");
        setIsLoading(false);
      }
    };

    void loadHeadline();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [setIsLoading]);

  return (
    <div className="min-h-screen w-full p-1">
      {isLoading && <Loader />}
      <div className="flex h-full min-h-[calc(100vh-0.5rem)] w-full flex-col bg-white px-2 py-2 sm:px-4 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-4xl font-bold tracking-tight text-gray-700 sm:text-5xl lg:text-7xl">{headline}</h1>

          <div className="flex items-center justify-end">
            <button
              type="button"
              aria-label="Open profile"
              className="cursor-pointer rounded-full shadow-md hover:shadow-lg"
              onClick={moveToProfilePage}
            >
              <svg width="70" height="70" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 sm:h-14 sm:w-14">
                <circle cx="100" cy="100" r="90" fill="#8A90A0" />
                <circle cx="100" cy="80" r="25" fill="#1F2A4A" />
                <ellipse cx="100" cy="140" rx="50" ry="25" fill="#1F2A4A" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mx-auto mt-20 w-full max-w-3xl rounded-3xl border border-gray-200 px-6 py-12 text-center shadow-md sm:px-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl">Thanks for registering</h2>
          <p className="mt-4 text-lg font-medium text-gray-600 sm:text-2xl">We will get back to you soon.</p>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
