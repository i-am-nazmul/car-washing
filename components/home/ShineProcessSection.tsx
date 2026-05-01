import React from "react";
import * as motion from "motion/react-client";

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
      <h2 className="text-center text-2xl font-extrabold tracking-tight text-yellow-300 sm:text-5xl">THE SHINE PROCESS</h2>
      <p className="mt-2 text-center text-xs font-bold text-white sm:text-2xl">Consistency you can see, every day.</p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-10 md:mt-13 md:grid-cols-3 md:gap-5">
        <div className="flex min-h-51 flex-col items-start justify-start rounded-2xl border border-violet-300 p-3 text-left text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:min-h-57 sm:p-5 md:min-h-64 md:p-8">
          
          <h3 className="mt-5 w-full text-center text-lg font-bold sm:mt-7 sm:text-3xl md:mt-8">EXTERIOR CARE</h3>
          <p className="mt-5 text-[0.7rem] text-violet-100 sm:mt-7 sm:text-sm md:mt-16 md:text-base">
            We follow a structured exterior cleaning method designed to protect your vehicle’s surface while delivering a consistent shine.
          </p>
          <ul className="mt-4 w-full list-disc space-y-2 pl-5 text-left text-[0.7rem] text-violet-100 sm:text-sm md:text-base">
            <li>Surface dust is safely lifted using our Waterless Cleaning Method</li>
            <li>High GSM microfiber cloth (800 GSM) ensures Scratch-Safe Wiping</li>
            <li>Wheels and lower panels receive focused attention</li>
            <li>Final finish ensures a clean, streak-free surface</li>
          </ul>
          <p className="mt-4 text-[0.7rem] text-violet-100 sm:text-sm md:text-base">
            Every step is designed to protect the paint, not just clean it.
          </p>
        </div>

        <div className="flex min-h-51 flex-col items-start justify-start rounded-2xl border border-violet-300 p-3 text-left text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:min-h-57 sm:p-5 md:min-h-64 md:p-8">
          
          <h3 className="mt-5 w-full text-center text-lg font-bold sm:mt-7 sm:text-3xl md:mt-8">INTERIOR CARE</h3>
          <p className="mt-5 text-[0.7rem] text-violet-100 sm:mt-7 sm:text-sm md:mt-16 md:text-base">
            Interior cleaning is done with attention to detail — not just surface wiping.
          </p>
          <ul className="mt-4 w-full list-disc space-y-2 pl-5 text-left text-[0.7rem] text-violet-100 sm:text-sm md:text-base">
            <li>Dust and debris are removed from all touchpoints</li>
            <li>Dashboard and panels are cleaned and maintained</li>
            <li>Seats and visible areas are refreshed regularly</li>
            <li>Glass and mirrors are cleaned for clear visibility</li>
          </ul>
          <p className="mt-4 text-[0.7rem] text-violet-100 sm:text-sm md:text-base">
            A clean interior improves both comfort and longevity of materials.
          </p>
        </div>

        <div className="flex min-h-51 flex-col items-start justify-start rounded-2xl border border-violet-300 p-3 text-left text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:min-h-57 sm:p-5 md:min-h-64 md:p-8">
          
          <h3 className="mt-5 w-full text-center text-lg font-bold sm:mt-7 sm:text-3xl md:mt-8">POLISH &amp; PROTECTION</h3>
          <p className="mt-5 text-[0.7rem] text-violet-100 sm:mt-7 sm:text-sm md:mt-8 md:text-base">
            Beyond cleaning, we focus on maintaining your vehicle’s finish.
          </p>
          <ul className="mt-4 w-full list-disc space-y-2 pl-5 text-left text-[0.7rem] text-violet-100 sm:text-sm md:text-base">
            <li>Dashboard polish restores surface appearance</li>
            <li>Tyre care enhances overall look</li>
            <li>Wax application adds a protective layer</li>
            <li>Surface finish is maintained for a clean, well-kept appearance</li>
          </ul>
          <p className="mt-4 text-[0.7rem] text-violet-100 sm:text-sm md:text-base">
            Protection is what keeps your vehicle looking new, not just clean.
          </p>
        </div>
      </div>
    </motion.section>
  );
}

const ShineProcessSection = React.memo(ShineProcessSectionComponent);

export default ShineProcessSection;
