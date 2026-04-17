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
};

function HeroSectionComponent({
  onAbout,
  onHowItWorks,
  onServices,
  onPricing,
  onContact,
  onLogin,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-svh w-full">

      <motion.nav
        initial={{ opacity: 0, y: -24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.8 }}
        transition={{ duration: 0.5 }}
        className="mt-6 w-full flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      >
        <Image
          src="/logo4.png"
          alt="The Shine Company"
          width={44}
          height={44}
          className="-translate-x-20 h-9 w-9 rounded-full object-cover sm:h-11 sm:w-11 sm:-translate-x-60"
        />
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={onAbout}
        >
          ABOUT US
        </MotionButton>
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={onHowItWorks}
        >
          HOW IT WORKS
        </MotionButton>
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={onServices}
        >
          OUR SERVICES
        </MotionButton>
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={onPricing}
        >
          PRICING
        </MotionButton>
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={onContact}
        >
          CONTACT US
        </MotionButton>
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={onLogin}
        >
          LOGIN / SIGNUP
        </MotionButton>
      </motion.nav>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.8 }}
        transition={{ delay: 0.1, duration: 0.45 }}
        className="mt-2 flex min-h-[72vh] w-full flex-col items-center justify-center"
      >
        <Image
          src="/logo4.png"
          alt="The Shine Company logo"
          width={320}
          height={320}
          className="mt-10 h-40 w-40 rounded-full object-cover sm:h-56 sm:w-56"
        />
        <h1 className="mt-6 text-center text-2xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(251,191,36,0.35)] sm:text-8xl">
          THE SHINE COMPANY
        </h1>

        <p className="mt-2 max-w-3xl text-center text-base font-semibold text-white sm:text-4xl">
          Driven by Shine. Delivered With Care.
        </p>
      </motion.div>
    </section>
  );
}

const HeroSection = React.memo(HeroSectionComponent);

export default HeroSection;
