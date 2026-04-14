import React from "react";
import * as motion from "motion/react-client";

type HowItWorksSectionProps = {
  howRef: React.RefObject<HTMLElement | null>;
  howVisibleStep: number;
};

function HowItWorksSectionComponent({ howRef, howVisibleStep }: HowItWorksSectionProps) {
  return (
    <section ref={howRef} id="how-it-works" className="mt-10 w-full max-w-6xl">
      <div className="relative h-[210vh] overflow-hidden">
        <div className="sticky top-18 h-[78vh] px-6 py-10">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-amber-200 sm:text-5xl">How It Works</h2>
          <p className="mt-2 text-center text-base font-medium text-amber-100/80 sm:text-xl">Three steps to a permanently clean vehicle.</p>

          <div className="relative mx-auto mt-20 max-w-5xl space-y-28">
            <motion.div
              initial={false}
              animate={{ opacity: howVisibleStep >= 1 ? 1 : 0, x: howVisibleStep >= 1 ? 0 : "-120vw" }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative flex justify-start transform-gpu will-change-transform"
            >
              <div className="aspect-square w-full max-w-[14rem] rounded-full border border-violet-300 bg-purple-600 p-5 text-center text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:max-w-[16rem] flex flex-col items-center justify-center">
                <p className="text-xs font-bold uppercase tracking-wide text-violet-100 sm:text-sm">Step 1</p>
                <h3 className="mt-1 text-xl font-bold sm:text-2xl">Choose Your Plan</h3>
                <p className="mt-2 text-sm text-violet-100 sm:text-base">Select the subscription that fits your car, bike, or both.</p>
              </div>
            </motion.div>

            <motion.div
              initial={false}
              animate={{ opacity: howVisibleStep >= 2 ? 1 : 0, x: howVisibleStep >= 2 ? 0 : "120vw" }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative flex justify-end transform-gpu will-change-transform"
            >
              <div className="aspect-square w-full max-w-[14rem] rounded-full border border-violet-300 bg-purple-600 p-5 text-center text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:max-w-[16rem] flex flex-col items-center justify-center">
                <p className="text-xs font-bold uppercase tracking-wide text-violet-100 sm:text-sm">Step 2</p>
                <h3 className="mt-1 text-xl font-bold sm:text-2xl">We Take Over</h3>
                <p className="mt-2 text-sm text-violet-100 sm:text-base">Our team arrives at your parking area 5 days a week for professional, eco-friendly cleaning.</p>
              </div>
            </motion.div>

            <motion.div
              initial={false}
              animate={{ opacity: howVisibleStep >= 3 ? 1 : 0, x: howVisibleStep >= 3 ? 0 : "-120vw" }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative flex justify-start transform-gpu will-change-transform"
            >
              <div className="aspect-square w-full max-w-[14rem] rounded-full border border-violet-300 bg-purple-600 p-5 text-center text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:max-w-[16rem] flex flex-col items-center justify-center">
                <p className="text-xs font-bold uppercase tracking-wide text-violet-100 sm:text-sm">Step 3</p>
                <h3 className="mt-1 text-xl font-bold sm:text-2xl">Enjoy the Shine</h3>
                <p className="mt-2 text-sm text-violet-100 sm:text-base">Park. Drive. Repeat. No scheduling. No waiting. Enjoy a clean vehicle without spending your time on it.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

const HowItWorksSection = React.memo(HowItWorksSectionComponent);

export default HowItWorksSection;
