import Image from "next/image";
import React from "react";
import * as motion from "motion/react-client";
import { PlanData, PlanCardProps } from "@/components/cards/types";

type VehicleCategory = "Sedan" | "SUV" | "Bike";

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
  const [selectedCategory, setSelectedCategory] = React.useState<VehicleCategory>("Sedan");

  const visiblePlans = React.useMemo(() => {
    if (selectedCategory === "Bike") {
      return pricingPlans.filter(({ plan }) => plan.name === "BIKE CARE");
    }

    const carPlans = pricingPlans.filter(({ plan }) => plan.name === "CLEAN CARE" || plan.name === "SHINE CARE");

    if (selectedCategory === "Sedan") {
      return carPlans;
    }

    return carPlans.map((entry) => {
      const basePrice = Number.parseInt(entry.plan.displayPrice.replace(/[^0-9]/g, ""), 10);
      const suvPrice = Number.isNaN(basePrice) ? entry.plan.displayPrice : `₹${basePrice + 100}`;

      return {
        ...entry,
        plan: {
          ...entry.plan,
          amountInPaise: entry.plan.amountInPaise + 10000,
          displayPrice: suvPrice,
        },
      };
    });
  }, [pricingPlans, selectedCategory]);

  return (
    <motion.section
      id="pricing"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="mt-24 w-full max-w-350 px-4 py-6 text-left shadow-xl sm:px-6 sm:py-8"
    >
      <h2 className="text-center text-2xl font-extrabold tracking-tight text-amber-300 sm:text-6xl">PRICING</h2>
      <p className="mt-2 text-center text-base font-semibold tracking-tight text-white sm:text-3xl">Premium Care. Transparent Plans.</p>
      <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-4">
        {[
          { value: "Sedan", label: "Sedan/Hatchback", image: "/sedan.png" },
          { value: "SUV", label: "SUV/XUV", image: "/suv.png" },
          { value: "Bike", label: "Bike", image: "/bike.png" },
        ].map((item) => (
          <motion.button
            key={item.value}
            type="button"
            onClick={() => setSelectedCategory(item.value as VehicleCategory)}
            initial={{ opacity: 0, y: 38, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.82, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group flex min-h-[24vh] cursor-pointer flex-col items-center justify-center text-center sm:min-h-0"
          >
            <div
              className={`mx-auto flex h-52 w-52 items-center justify-center rounded-full transition-colors duration-200 ${
                selectedCategory === item.value ? "bg-white" : "bg-transparent group-hover:bg-white"
              }`}
            >
              <Image src={item.image} alt={item.label} width={200} height={200} className="h-48 w-48 object-contain" />
            </div>
            <p className={`mt-3 text-xl font-semibold tracking-tight ${selectedCategory === item.value ? "text-white" : "text-amber-200"}`}>{item.label}</p>
          </motion.button>
        ))}
      </div>

      <div className={`mt-16 grid w-full grid-cols-1 justify-items-center gap-6 ${selectedCategory === "Bike" ? "md:grid-cols-1" : "md:grid-cols-2"}`}>
        {visiblePlans.map(({ plan, features, Card }, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.42, delay: index * 0.08 }}
            className="h-full w-full max-w-2xl"
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
