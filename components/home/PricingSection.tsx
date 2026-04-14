import Image from "next/image";
import React from "react";
import * as motion from "motion/react-client";
import { PlanData, PlanCardProps } from "@/components/cards/types";

type PricingPlanEntry = {
  plan: PlanData;
  features: string[];
  Card: React.ComponentType<PlanCardProps>;
};

type PricingSectionProps = {
  pricingPlans: PricingPlanEntry[];
  isPaying: string | null;
  onCheckout: (plan: PlanData) => void;
};

function PricingSectionComponent({ pricingPlans, isPaying, onCheckout }: PricingSectionProps) {
  return (
    <motion.section
      id="pricing"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="mt-24 w-full max-w-350 px-4 py-6 text-left shadow-xl sm:px-6 sm:py-8"
    >
      <h2 className="text-center text-2xl font-extrabold tracking-tight text-amber-300 sm:text-4xl">Categories</h2>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Sedan", image: "/sedan.png" },
          { label: "SUV", image: "/suv.png" },
          { label: "Bike", image: "/bike.png" },
        ].map((item, index) => (
          <motion.button
            key={item.label}
            type="button"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group cursor-pointer text-center"
          >
            <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-transparent transition-colors duration-200 group-hover:bg-white">
              <Image src={item.image} alt={item.label} width={150} height={150} className="h-36 w-36 object-contain" />
            </div>
            <p className="mt-3 text-xl font-semibold tracking-tight text-amber-200">{item.label}</p>
          </motion.button>
        ))}
      </div>

      <h2 className="text-center text-3xl font-extrabold tracking-tight text-amber-300 sm:text-5xl mt-20">Choose Your Plan</h2>
      <p className="mt-2 text-center text-base font-medium text-amber-300 sm:text-lg">Flexible monthly plans with reliable doorstep service</p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {pricingPlans.map(({ plan, features, Card }, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.42, delay: index * 0.08 }}
          >
            <Card plan={plan} isPaying={isPaying} features={features} onCheckout={onCheckout} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

const PricingSection = React.memo(PricingSectionComponent);

export default PricingSection;
