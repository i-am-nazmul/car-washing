import React from "react";
import * as motion from "motion/react-client";
import { HOME_SECTION_BODY, HOME_SECTION_SUBTITLE, HOME_SECTION_TITLE } from "@/components/home/typography";

function ShineProcessSectionComponent() {
  return (
    <motion.section
      id="shine-process"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-6xl px-4 text-left sm:px-6"
    >
      <h2 className={HOME_SECTION_TITLE}>THE SHINE PROCESS</h2>
      <p className={HOME_SECTION_SUBTITLE}>Consistency you can see, every day.</p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-10 md:mt-13 md:grid-cols-3 md:gap-5">
        <div className="card-trace card-pop flex min-h-51 flex-col items-start justify-start rounded-2xl border border-violet-300 p-3 text-left text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:min-h-57 sm:p-5 md:min-h-64 md:p-8">
          
          <h3 className="mt-5 w-full text-center text-2xl font-bold sm:mt-7 sm:text-3xl md:mt-8">EXTERIOR CARE</h3>
          <p className={`mt-5 ${HOME_SECTION_BODY} text-violet-100 sm:mt-7 md:mt-16`}>
            We follow a structured exterior cleaning method designed to protect your vehicle’s surface while delivering a consistent shine.
          </p>
          <ul className={`mt-4 w-full list-disc space-y-2 pl-5 text-left ${HOME_SECTION_BODY} text-violet-100`}>
            <li>Surface dust is safely lifted using our Waterless Cleaning Method</li>
            <li>High GSM microfiber cloth (800 GSM) ensures Scratch-Safe Wiping</li>
            <li>Wheels and lower panels receive focused attention</li>
            <li>Final finish ensures a clean, streak-free surface</li>
          </ul>
          <p className={`mt-4 ${HOME_SECTION_BODY} text-violet-100`}>
            Every step is designed to protect the paint, not just clean it.
          </p>
        </div>

        <div className="card-trace card-pop flex min-h-51 flex-col items-start justify-start rounded-2xl border border-violet-300 p-3 text-left text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:min-h-57 sm:p-5 md:min-h-64 md:p-8">
          
          <h3 className="mt-5 w-full text-center text-2xl font-bold sm:mt-7 sm:text-3xl md:mt-8">INTERIOR CARE</h3>
          <p className={`mt-5 ${HOME_SECTION_BODY} text-violet-100 sm:mt-7 md:mt-16`}>
            Interior cleaning is done with attention to detail — not just surface wiping.
          </p>
          <ul className={`mt-4 w-full list-disc space-y-2 pl-5 text-left ${HOME_SECTION_BODY} text-violet-100`}>
            <li>Dust and debris are removed from all touchpoints</li>
            <li>Dashboard and panels are cleaned and maintained</li>
            <li>Seats and visible areas are refreshed regularly</li>
            <li>Glass and mirrors are cleaned for clear visibility</li>
          </ul>
          <p className={`mt-4 ${HOME_SECTION_BODY} text-violet-100`}>
            A clean interior improves both comfort and longevity of materials.
          </p>
        </div>

        <div className="card-trace card-pop flex min-h-51 flex-col items-start justify-start rounded-2xl border border-violet-300 p-3 text-left text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:min-h-57 sm:p-5 md:min-h-64 md:p-8">
          
          <h3 className="mt-5 w-full text-center text-2xl font-bold sm:mt-7 sm:text-3xl md:mt-8">POLISH &amp; PROTECTION</h3>
          <p className={`mt-5 ${HOME_SECTION_BODY} text-violet-100 sm:mt-7 md:mt-8`}>
            Beyond cleaning, we focus on maintaining your vehicle’s finish.
          </p>
          <ul className={`mt-4 w-full list-disc space-y-2 pl-5 text-left ${HOME_SECTION_BODY} text-violet-100`}>
            <li>Dashboard polish restores surface appearance</li>
            <li>Tyre care enhances overall look</li>
            <li>Wax application adds a protective layer</li>
            <li>Surface finish is maintained for a clean, well-kept appearance</li>
          </ul>
          <p className={`mt-4 ${HOME_SECTION_BODY} text-violet-100`}>
            Protection is what keeps your vehicle looking new, not just clean.
          </p>
        </div>
      </div>
    </motion.section>
  );
}

const ShineProcessSection = React.memo(ShineProcessSectionComponent);

export default ShineProcessSection;
