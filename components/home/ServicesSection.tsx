import React from "react";
import * as motion from "motion/react-client";

function ServicesSectionComponent() {
  return (
    <motion.section
      id="services"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-6xl px-4 text-left sm:px-6"
    >
      <h2 className="text-center text-2xl font-extrabold tracking-tight text-yellow-300 sm:text-5xl">SERVICES</h2>
      <p className="mt-2 text-center text-xs font-bold text-white sm:text-2xl">Precision Care. Zero Compromise.</p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-10 md:mt-13 md:grid-cols-3 md:gap-5">
        <div className="flex min-h-51 flex-col items-center justify-start rounded-2xl border border-violet-300 p-3 text-center text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:min-h-57 sm:p-5 md:min-h-64 md:p-8">
          <p className="mt-2 text-2xl font-bold uppercase tracking-wide text-violet-100 sm:mt-5 sm:text-3xl md:mt-8">Service 1</p>
          <h3 className="mt-5 text-lg font-bold sm:mt-7 sm:text-3xl md:mt-16">Car Cleaning</h3>
          <p className="mt-5 text-xs text-violet-100 sm:mt-7 sm:text-base md:mt-16 md:text-lg">Daily premium care for residents who want a consistently clean car without the hassle.</p>
        </div>
        <div className="flex min-h-51 flex-col items-center justify-start rounded-2xl border border-violet-300 p-3 text-center text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:min-h-57 sm:p-5 md:min-h-64 md:p-8">
          <p className="mt-2 text-2xl font-bold uppercase tracking-wide text-violet-100 sm:mt-5 sm:text-3xl md:mt-8">Service 2</p>
          <h3 className="mt-5 text-lg font-bold sm:mt-7 sm:text-3xl md:mt-16">Bike Cleaning</h3>
          <p className="mt-5 text-xs text-violet-100 sm:mt-7 sm:text-base md:mt-16 md:text-lg">Smart, waterless bike cleaning for riders who want a polished, well-kept vehicle every day. Simple, fast, and reliable.</p>
        </div>
        <div className="flex min-h-51 flex-col items-center justify-start rounded-2xl border border-violet-300 p-3 text-center text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:min-h-57 sm:p-5 md:min-h-64 md:p-8">
          <p className="mt-2 text-2xl font-bold uppercase tracking-wide text-violet-100 sm:mt-5 sm:text-3xl md:mt-8">Service 3</p>
          <h3 className="mt-5 text-lg font-bold sm:mt-7 sm:text-3xl md:mt-16">All Shine Combo</h3>
          <p className="mt-5 text-xs text-violet-100 sm:mt-7 sm:text-base md:mt-16 md:text-lg">Complete care for your entire fleet. One seamless plan covering both car and bike with full exterior, interior, and maintenance services.</p>
        </div>
      </div>
    </motion.section>
  );
}

const ServicesSection = React.memo(ServicesSectionComponent);

export default ServicesSection;
