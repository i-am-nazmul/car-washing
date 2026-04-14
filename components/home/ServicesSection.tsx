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
      className="mt-10 w-full max-w-6xl rounded-3xl border border-violet-200/60 bg-linear-to-br from-violet-50 via-white to-indigo-100 px-6 py-10 text-left shadow-xl"
    >
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Services</h2>
      <p className="mt-2 text-base font-medium text-gray-700 sm:text-xl">Precision Care. Zero Compromise.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-violet-200 bg-white/85 p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-violet-700">Service 1</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900">Car Cleaning</h3>
          <p className="mt-2 text-gray-700">Daily premium care for residents who want a consistently clean car without the hassle.</p>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-white/85 p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-violet-700">Service 2</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900">Bike Cleaning</h3>
          <p className="mt-2 text-gray-700">Smart, waterless bike cleaning for riders who want a polished, well-kept vehicle every day. Simple, fast, and reliable.</p>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-white/85 p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-violet-700">Service 3</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900">All Shine Combo</h3>
          <p className="mt-2 text-gray-700">Complete care for your entire fleet. One seamless plan covering both car and bike with full exterior, interior, and maintenance services.</p>
        </div>
      </div>
    </motion.section>
  );
}

const ServicesSection = React.memo(ServicesSectionComponent);

export default ServicesSection;
