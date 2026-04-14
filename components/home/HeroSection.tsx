import Image from "next/image";
import React from "react";
import * as motion from "motion/react-client";
import MotionButton from "@/components/MotionButton";

type HeroSectionProps = {
  onAbout: () => void;
  onHowItWorks: () => void;
  onServices: () => void;
  onPricing: () => void;
  onContact: () => void;
  onLogin: () => void;
  onSignup: () => void;
};

function HeroSectionComponent({
  onAbout,
  onHowItWorks,
  onServices,
  onPricing,
  onContact,
  onLogin,
  onSignup,
}: HeroSectionProps) {
  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.8 }}
        transition={{ duration: 0.5 }}
        className="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      >
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={onAbout}
        >
          About
        </MotionButton>
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={onHowItWorks}
        >
          How It Works
        </MotionButton>
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={onServices}
        >
          Services
        </MotionButton>
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={onPricing}
        >
          Pricing
        </MotionButton>
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={onContact}
        >
          Contact
        </MotionButton>
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={onLogin}
        >
          Login
        </MotionButton>
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={onSignup}
        >
          Signup
        </MotionButton>
      </motion.nav>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.8 }}
        transition={{ delay: 0.1, duration: 0.45 }}
        className="mt-6 flex flex-col items-center"
      >
        <Image
          src="/logo_2.png"
          alt="The Shine Company logo"
          width={192}
          height={192}
          className="rounded-full object-cover h-32 w-32 sm:h-48 sm:w-48"
        />
        <h1 className="mt-3 text-center text-2xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(251,191,36,0.35)] sm:text-6xl">
          The Shine Company
        </h1>
        <p className="mt-4 max-w-3xl text-center text-sm font-medium tracking-wide text-amber-200/90 sm:text-lg">
          The New Standard of Vehicle Care.
        </p>
        <p className="max-w-3xl text-center text-base font-semibold text-white sm:text-2xl">
          Driven by Shine. Delivered With Care.
        </p>
      </motion.div>
    </>
  );
}

const HeroSection = React.memo(HeroSectionComponent);

export default HeroSection;
