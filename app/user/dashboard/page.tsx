"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as motion from "motion/react-client";
import SiteFooter from "@/components/SiteFooter";
import MotionButton from "@/components/MotionButton";

export default function DashboardPage() {
  const router = useRouter();

  const hasActiveMembership = true;

  const moveHome = React.useCallback(() => {
    router.push("/");
  }, [router]);

  const moveHomeSection = React.useCallback(
    (sectionId: string) => {
      router.push(`/#${sectionId}`);
    },
    [router]
  );

  const moveLogin = React.useCallback(() => {
    router.push("/user/login");
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-[#03061a] p-1 text-amber-100">
      <div className="flex h-full min-h-[calc(100vh-0.5rem)] w-full flex-col bg-[#050b28] px-2 py-2 sm:px-4 sm:py-4">
        <motion.nav
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-2 flex w-full items-center justify-between gap-3"
        >
          <button
            type="button"
            aria-label="Go to home"
            onClick={moveHome}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/15"
          >
            <Image
              src="/logo4.png"
              alt="The Shine Company"
              width={36}
              height={36}
              className="h-7 w-7 object-contain"
            />
          </button>

          <div className="flex flex-1 flex-wrap items-center justify-center gap-2 sm:gap-3">
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
              HOW TO START
            </MotionButton>
            <MotionButton
              className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
              onClick={() => moveHomeSection("shine-process")}
            >
              SHINE PROCESS
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
              onClick={moveLogin}
            >
              LOGIN
            </MotionButton>
          </div>

          <div className="hidden h-10 w-10 sm:block" aria-hidden="true" />
        </motion.nav>

        {hasActiveMembership ? (
          <div className="mx-auto mt-12 w-full max-w-4xl">
            <div className="rounded-3xl border border-amber-200/25 bg-[#070f2f] px-6 py-8 shadow-[0_0_22px_rgba(253,230,138,0.1)] sm:px-10">
              <h3 className="text-xl font-semibold text-amber-200 sm:text-2xl">Benefits Used</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Exterior Refreshes", value: "20/20" },
                  { label: "Dashboard Polish", value: "1/1" },
                  { label: "Tyre Polishes", value: "2/2" },
                ].map((benefit) => (
                  <div key={benefit.label} className="rounded-2xl border border-amber-200/20 bg-[#060b26] px-5 py-6 text-center">
                    <div className="text-3xl font-semibold text-amber-200 sm:text-4xl">{benefit.value}</div>
                    <div className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-amber-100/80 sm:text-base">
                      {benefit.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto mt-12 w-full max-w-3xl rounded-3xl border border-amber-200/30 bg-[#070f2f] px-6 py-12 text-center shadow-[0_0_22px_rgba(253,230,138,0.12)] sm:px-10">
            <h2 className="text-3xl font-semibold tracking-tight text-amber-200 sm:text-4xl">Your Membership is Pending Activation.</h2>
            <p className="mt-4 text-lg font-medium text-amber-100/85 sm:text-2xl">
              To maintain our signature quality, we limit slots per community. Complete your subscription to lock in your daily maintenance slot.
            </p>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
