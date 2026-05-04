import React from "react";
import * as motion from "motion/react-client";
import { HOME_SECTION_BODY, HOME_SECTION_SUBTITLE, HOME_SECTION_TITLE } from "@/components/home/typography";

type HowItWorksSectionProps = {
  howRef: React.RefObject<HTMLElement | null>;
  howVisibleStep: number;
};

function HowItWorksSectionComponent({ howRef, howVisibleStep }: HowItWorksSectionProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);
    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);
    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  return (
    <section ref={howRef} id="how-it-works" className="mt-25 mb-10 w-full max-w-6xl sm:mb-19 lg:mb-32">
      <div className="relative h-auto overflow-visible">
        <div className="px-4 py-6 lg:px-6 lg:py-8">

          <h2 className={HOME_SECTION_TITLE}>HOW TO START</h2>
          <p className={HOME_SECTION_SUBTITLE}>Three steps to a permanently clean vehicle.</p>

          <div className="relative mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-3 sm:mt-13 sm:grid-cols-3 sm:gap-5">
            <motion.div
              initial={false}
              animate={
                isMobile
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: howVisibleStep >= 1 ? 1 : 0, scale: howVisibleStep >= 1 ? 1 : 0.9, y: howVisibleStep >= 1 ? 0 : 20 }
              }
              transition={{ duration: 0.42, ease: "easeOut", delay: 0 }}
              className="relative transform-gpu will-change-transform "
            >
              <div className="card-trace card-pop flex h-full min-h-57 flex-col items-center justify-start rounded-2xl border border-violet-300 p-5 text-center text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:min-h-64 sm:p-8">
                <p className="mt-2 text-2xl font-bold uppercase tracking-wide text-violet-100 sm:mt-8 sm:text-3xl">Step 1</p>
                <h3 className="mt-6 text-2xl font-bold sm:mt-16 sm:text-3xl">Choose Your Plan</h3>
                <p className={`mt-6 ${HOME_SECTION_BODY} text-violet-100 sm:mt-16`}>Select the subscription that fits your car, bike, or both.</p>
              </div>
            </motion.div>

            <motion.div
              initial={false}
              animate={
                isMobile
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: howVisibleStep >= 2 ? 1 : 0, scale: howVisibleStep >= 2 ? 1 : 0.9, y: howVisibleStep >= 2 ? 0 : 20 }
              }
              transition={{ duration: 0.42, ease: "easeOut", delay: 0 }}
              className="relative transform-gpu will-change-transform"
            >
              <div className="card-trace card-pop flex h-full min-h-57 flex-col items-center justify-start rounded-2xl border border-violet-300 p-5 text-center text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:min-h-64 sm:p-8">
                <p className="mt-2 text-2xl font-bold uppercase tracking-wide text-violet-100 sm:mt-8 sm:text-3xl">Step 2</p>
                <h3 className="mt-6 text-2xl font-bold sm:mt-16 sm:text-3xl">We Take Over</h3>
                <p className={`mt-6 ${HOME_SECTION_BODY} text-violet-100 sm:mt-16`}>Our team arrives at your parking area 5 days a week for professional, eco-friendly cleaning.</p>
              </div>
            </motion.div>


            <motion.div
              initial={false}
              animate={
                isMobile
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: howVisibleStep >= 3 ? 1 : 0, scale: howVisibleStep >= 3 ? 1 : 0.9, y: howVisibleStep >= 3 ? 0 : 20 }
              }
              transition={{ duration: 0.42, ease: "easeOut", delay: 0 }}
              className="relative transform-gpu will-change-transform "
            >
              <div className="card-trace card-pop flex h-full min-h-57 flex-col items-center justify-start rounded-2xl border border-violet-300 p-5 text-center text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:min-h-64 sm:p-8">
                <p className="mt-2 text-2xl font-bold uppercase tracking-wide text-violet-100 sm:mt-8 sm:text-3xl">Step 3</p>
                <h3 className="mt-6 text-2xl font-bold sm:mt-16 sm:text-3xl">Enjoy the Shine</h3>
                <p className={`mt-6 ${HOME_SECTION_BODY} text-violet-100 sm:mt-16`}>Park. Drive. Repeat. No scheduling. No waiting. Enjoy a clean vehicle without spending your time on it.</p>
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
