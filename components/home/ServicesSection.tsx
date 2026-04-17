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
      className="w-full max-w-6xl px-6 text-left"
    >
      <h2 className="text-center text-3xl font-extrabold tracking-tight text-yellow-300 sm:text-6xl">SERVICES</h2>
      <p className="mt-2 text-center text-base font-bold text-white sm:text-3xl">Precision Care. Zero Compromise.</p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-3">
        <div className="flex min-h-72 flex-col items-center justify-start rounded-2xl border border-violet-300 p-10 text-center text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:min-h-80">
          <p className="mt-10 text-4xl font-bold uppercase tracking-wide text-violet-100">Service 1</p>
          <h3 className="mt-20 text-4xl font-bold">Car Cleaning</h3>
          <p className="mt-20 text-2xl text-violet-100">Daily premium care for residents who want a consistently clean car without the hassle.</p>
        </div>
        <div className="flex min-h-72 flex-col items-center justify-start rounded-2xl border border-violet-300 p-10 text-center text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:min-h-80">
          <p className="mt-10 text-4xl font-bold uppercase tracking-wide text-violet-100">Service 2</p>
          <h3 className="mt-20 text-4xl font-bold">Bike Cleaning</h3>
          <p className="mt-20 text-2xl text-violet-100">Smart, waterless bike cleaning for riders who want a polished, well-kept vehicle every day. Simple, fast, and reliable.</p>
        </div>
        <div className="flex min-h-72 flex-col items-center justify-start rounded-2xl border border-violet-300 p-10 text-center text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:min-h-80">
          <p className="mt-10 text-4xl font-bold uppercase tracking-wide text-violet-100">Service 3</p>
          <h3 className="mt-20 text-4xl font-bold">All Shine Combo</h3>
          <p className="mt-20 text-2xl text-violet-100">Complete care for your entire fleet. One seamless plan covering both car and bike with full exterior, interior, and maintenance services.</p>
        </div>
      </div>
    </motion.section>
  );
}

const ServicesSection = React.memo(ServicesSectionComponent);

export default ServicesSection;
