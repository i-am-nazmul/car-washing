import React from "react";
import * as motion from "motion/react-client";

type HowItWorksSectionProps = {
  howRef: React.RefObject<HTMLElement | null>;
  howVisibleStep: number;
};

function HowItWorksSectionComponent({ howRef, howVisibleStep }: HowItWorksSectionProps) {
  return (
    <section ref={howRef} id="how-it-works" className="mt-10 w-full max-w-6xl">
      <div className="relative h-[105vh] overflow-hidden sm:h-[130vh]">
        <div className="sticky top-18 h-[70vh] px-6 py-10 sm:h-[78vh]">

          <h2 className="text-center text-3xl font-extrabold tracking-tight text-yellow-300  sm:text-6xl">How It Works</h2>
          <p className="mt-2 text-center text-base  text-white font-bold sm:text-3xl">Three steps to a permanently clean vehicle.</p>

          <div className="relative mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-3">
            <motion.div
              initial={false}
              animate={{ opacity: howVisibleStep >= 1 ? 1 : 0, scale: howVisibleStep >= 1 ? 1 : 0.9, y: howVisibleStep >= 1 ? 0 : 20 }}
              transition={{ duration: 0.42, ease: "easeOut", delay: 0 }}
              className="relative transform-gpu will-change-transform "
            >
              <div className="h-full min-h-72 rounded-2xl border border-violet-300 p-10 text-center text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:min-h-80 flex flex-col items-center justify-start">
                <p className="mt-10 text-4xl font-bold uppercase tracking-wide text-violet-100 sm:text-4xl">Step 1</p>
                <h3 className="mt-20 text-4xl font-bold sm:text-4xl">Choose Your Plan</h3>
                <p className="mt-20 text-2xl text-violet-100 ">Select the subscription that fits your car, bike, or both.</p>
              </div>
            </motion.div>

            <motion.div
              initial={false}
              animate={{ opacity: howVisibleStep >= 1 ? 1 : 0, scale: howVisibleStep >= 1 ? 1 : 0.9, y: howVisibleStep >= 1 ? 0 : 20 }}
              transition={{ duration: 0.42, ease: "easeOut", delay: 0 }}
              className="relative transform-gpu will-change-transform"
            >
              <div className="h-full min-h-72 rounded-2xl border border-violet-300 p-10 text-center text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:min-h-80 flex flex-col items-center justify-start">
                <p className="mt-10 text-4xl font-bold uppercase tracking-wide text-violet-100 sm:text-4xl">Step 2</p>
                <h3 className="mt-25 text-4xl font-bold sm:text-4xl">We Take Over</h3>
                <p className="mt-25 text-2xl text-violet-100 ">Our team arrives at your parking area 5 days a week for professional, eco-friendly cleaning.</p>
              </div>
            </motion.div>


            <motion.div
              initial={false}
              animate={{ opacity: howVisibleStep >= 1 ? 1 : 0, scale: howVisibleStep >= 1 ? 1 : 0.9, y: howVisibleStep >= 1 ? 0 : 20 }}
              transition={{ duration: 0.42, ease: "easeOut", delay: 0 }}
              className="relative transform-gpu will-change-transform "
            >
              <div className="h-full min-h-72 rounded-2xl border border-violet-300 p-10 text-center text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:min-h-80 flex flex-col items-center justify-start">
                <p className="mt-10 text-4xl font-bold uppercase tracking-wide text-violet-100 sm:text-4xl">Step 3</p>
                <h3 className="mt-20 text-4xl font-bold sm:text-4xl">Enjoy the Shine</h3>
                <p className="mt-20 text-2xl text-violet-100 ">Park. Drive. Repeat. No scheduling. No waiting. Enjoy a clean vehicle without spending your time on it.</p>
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
