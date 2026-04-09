"use client"
import React, { useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DashboardPage(){
      const [headline, setHeadline] = React.useState("Dashboard");
      const router = useRouter();

      const moveToProfilePage = function(){
            router.push('/profile');
      }

      useEffect(() => {
            let intervalId: ReturnType<typeof setInterval> | undefined;

            const loadHeadline = async () => {
                  try {
                        const profile = await axios.get('/api/profile');
                        const rawName = profile.data?.username?.trim() || "there";
                        const shortName = rawName.split(/\s+/)[0] || rawName;
                        const fullText = `Hello ${shortName}`;
                        let index = 0;

                        setHeadline("");
                        intervalId = setInterval(() => {
                              index += 1;
                              setHeadline(fullText.slice(0, index));
                              if (index >= fullText.length && intervalId) {
                                    clearInterval(intervalId);
                              }
                        }, 90);
                  } catch {
                        setHeadline("Dashboard");
                  }
            };

            void loadHeadline();

            return () => {
                  if (intervalId) {
                        clearInterval(intervalId);
                  }
            };
      }, []);

      return (
  <div className="min-h-screen w-screen bg-blue-200 p-1">
    <div className="flex h-full min-h-[calc(100vh-0.5rem)] w-full flex-col rounded-sm border border-gray-400 bg-white px-2 py-2 sm:px-4 sm:py-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-700 sm:text-5xl lg:text-7xl">
          {headline}
        </h1>

        <div className="mt-2 flex w-full flex-row items-stretch gap-2 sm:mt-0 sm:w-auto  sm:items-center sm:justify-end">
          <div className="flex flex-col sm:flex-row w-full items-center" />

          <Image
            src="/download.png"
            width={70}
            height={70}
            alt="work"
            className="h-20 w-20 rounded-full bg-amber-400 cursor-pointer shadow-md hover:shadow-lg sm:h-14 sm:w-14"
            onClick={moveToProfilePage}
          />
        </div>
      </div>

                  <div className="mt-4 flex min-h-[65vh] w-full items-center justify-center rounded-sm border border-gray-200 bg-white p-4 shadow-md">
                        <p className="text-center font-mono text-3xl font-semibold tracking-tight text-gray-500 sm:text-5xl">
                              Under development
                        </p>
      </div>
    </div>
  </div>
);
}