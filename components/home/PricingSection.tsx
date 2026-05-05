import Image from "next/image";
import React from "react";
import * as motion from "motion/react-client";
import { PlanData, PlanCardProps } from "@/components/cards/types";
import { HOME_SECTION_BODY, HOME_SECTION_SUBTITLE, HOME_SECTION_TITLE } from "@/components/home/typography";

type VehicleCategory = "Sedan" | "SUV" | "Bike";
type CarModelBucket = "Sedan" | "Hatchback" | "Compact SUV" | "SUV/XUV";

type CarModelOption = {
  model: string;
  bucket: CarModelBucket;
  pricingCategory: Exclude<VehicleCategory, "Bike">;
};

const CAR_COMPANY_MODELS: Record<string, CarModelOption[]> = {
  "Maruti Suzuki": [
    { model: "Swift", bucket: "Hatchback", pricingCategory: "Sedan" },
    { model: "Baleno", bucket: "Hatchback", pricingCategory: "Sedan" },
    { model: "Dzire", bucket: "Sedan", pricingCategory: "Sedan" },
    { model: "Ciaz", bucket: "Sedan", pricingCategory: "Sedan" },
    { model: "Brezza", bucket: "Compact SUV", pricingCategory: "Sedan" },
    { model: "Fronx", bucket: "Compact SUV", pricingCategory: "Sedan" },
    { model: "Grand Vitara", bucket: "SUV/XUV", pricingCategory: "SUV" },
  ],
  Hyundai: [
    { model: "Grand i10 Nios", bucket: "Hatchback", pricingCategory: "Sedan" },
    { model: "i20", bucket: "Hatchback", pricingCategory: "Sedan" },
    { model: "Verna", bucket: "Sedan", pricingCategory: "Sedan" },
    { model: "Aura", bucket: "Sedan", pricingCategory: "Sedan" },
    { model: "Exter", bucket: "Compact SUV", pricingCategory: "Sedan" },
    { model: "Venue", bucket: "Compact SUV", pricingCategory: "Sedan" },
    { model: "Creta", bucket: "SUV/XUV", pricingCategory: "SUV" },
    { model: "Alcazar", bucket: "SUV/XUV", pricingCategory: "SUV" },
  ],
  Tata: [
    { model: "Tiago", bucket: "Hatchback", pricingCategory: "Sedan" },
    { model: "Altroz", bucket: "Hatchback", pricingCategory: "Sedan" },
    { model: "Tigor", bucket: "Sedan", pricingCategory: "Sedan" },
    { model: "Punch", bucket: "Compact SUV", pricingCategory: "Sedan" },
    { model: "Nexon", bucket: "Compact SUV", pricingCategory: "Sedan" },
    { model: "Harrier", bucket: "SUV/XUV", pricingCategory: "SUV" },
    { model: "Safari", bucket: "SUV/XUV", pricingCategory: "SUV" },
  ],
  Mahindra: [
    { model: "XUV 3XO", bucket: "Compact SUV", pricingCategory: "Sedan" },
    { model: "Bolero Neo", bucket: "Compact SUV", pricingCategory: "Sedan" },
    { model: "Scorpio N", bucket: "SUV/XUV", pricingCategory: "SUV" },
    { model: "XUV700", bucket: "SUV/XUV", pricingCategory: "SUV" },
    { model: "Thar", bucket: "SUV/XUV", pricingCategory: "SUV" },
  ],
  Kia: [
    { model: "Sonet", bucket: "Compact SUV", pricingCategory: "Sedan" },
    { model: "Carens", bucket: "Compact SUV", pricingCategory: "Sedan" },
    { model: "Seltos", bucket: "SUV/XUV", pricingCategory: "SUV" },
  ],
  Honda: [
    { model: "Amaze", bucket: "Sedan", pricingCategory: "Sedan" },
    { model: "City", bucket: "Sedan", pricingCategory: "Sedan" },
    { model: "Elevate", bucket: "SUV/XUV", pricingCategory: "SUV" },
  ],
  Toyota: [
    { model: "Glanza", bucket: "Hatchback", pricingCategory: "Sedan" },
    { model: "Urban Cruiser Taisor", bucket: "Compact SUV", pricingCategory: "Sedan" },
    { model: "Innova Hycross", bucket: "SUV/XUV", pricingCategory: "SUV" },
    { model: "Fortuner", bucket: "SUV/XUV", pricingCategory: "SUV" },
  ],
  Skoda: [
    { model: "Slavia", bucket: "Sedan", pricingCategory: "Sedan" },
    { model: "Kushaq", bucket: "SUV/XUV", pricingCategory: "SUV" },
  ],
  Volkswagen: [
    { model: "Virtus", bucket: "Sedan", pricingCategory: "Sedan" },
    { model: "Taigun", bucket: "SUV/XUV", pricingCategory: "SUV" },
  ],
  MG: [
    { model: "Comet EV", bucket: "Hatchback", pricingCategory: "Sedan" },
    { model: "Astor", bucket: "SUV/XUV", pricingCategory: "SUV" },
    { model: "Hector", bucket: "SUV/XUV", pricingCategory: "SUV" },
  ],
  Renault: [
    { model: "Kwid", bucket: "Hatchback", pricingCategory: "Sedan" },
    { model: "Kiger", bucket: "Compact SUV", pricingCategory: "Sedan" },
  ],
  Nissan: [
    { model: "Magnite", bucket: "Compact SUV", pricingCategory: "Sedan" },
  ],
};

const CAR_COMPANIES = Object.keys(CAR_COMPANY_MODELS);

type PricingPlanEntry = {
  plan: PlanData;
  features: string[];
  Card: React.ComponentType<PlanCardProps>;
};

type PricingSectionProps = {
  pricingPlans: PricingPlanEntry[];
  isPaying: string | null;
  onCheckout: (plan: PlanData, vehicleCategory: string) => void;
};

function PricingSectionComponent({ pricingPlans, isPaying, onCheckout }: PricingSectionProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<VehicleCategory>("Sedan");
  const [selectedCompany, setSelectedCompany] = React.useState("");
  const [selectedModel, setSelectedModel] = React.useState("");
  const [isCategoryLocked, setIsCategoryLocked] = React.useState(false);
  const [mobileCardIndex, setMobileCardIndex] = React.useState(0);
  const touchStartXRef = React.useRef<number | null>(null);
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const hasAutoSwipedRef = React.useRef(false);
  const [hasEnteredPricing, setHasEnteredPricing] = React.useState(false);

  const availableModels = React.useMemo(() => {
    if (!selectedCompany) {
      return [];
    }

    return CAR_COMPANY_MODELS[selectedCompany] ?? [];
  }, [selectedCompany]);

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

  const sharedCarOneTimePrice = selectedCategory === "SUV" ? "₹649" : "₹549";

  React.useEffect(() => {
    if (visiblePlans.length <= 1) {
      setMobileCardIndex(0);
      return;
    }

    setMobileCardIndex((current) => Math.min(current, visiblePlans.length - 1));
  }, [visiblePlans]);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section || hasEnteredPricing) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasEnteredPricing(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [hasEnteredPricing]);

  React.useEffect(() => {
    if (hasAutoSwipedRef.current || !hasEnteredPricing) {
      return;
    }

    if (typeof window === "undefined" || window.innerWidth >= 768) {
      return;
    }

    if (selectedCategory !== "Sedan" || visiblePlans.length < 2 || mobileCardIndex !== 0) {
      return;
    }

    const timerId = window.setTimeout(() => {
      hasAutoSwipedRef.current = true;
      setMobileCardIndex(1);
    }, 3000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [hasEnteredPricing, selectedCategory, visiblePlans.length, mobileCardIndex]);

  const handleCategorySelect = React.useCallback((category: VehicleCategory) => {
    if (isCategoryLocked && category !== selectedCategory) {
      return;
    }

    setSelectedCategory(category);
    setMobileCardIndex(0);
  }, [isCategoryLocked, selectedCategory]);

  const handleCompanySelect = React.useCallback((company: string) => {
    setSelectedCompany(company);
    setSelectedModel("");
    setIsCategoryLocked(false);
  }, []);

  const handleModelSelect = React.useCallback((modelName: string) => {
    setSelectedModel(modelName);

    if (!modelName || !selectedCompany) {
      setIsCategoryLocked(false);
      return;
    }

    const chosenModel = availableModels.find((entry) => entry.model === modelName);
    if (!chosenModel) {
      setIsCategoryLocked(false);
      return;
    }

    setSelectedCategory(chosenModel.pricingCategory);
    setMobileCardIndex(0);
    setIsCategoryLocked(true);
  }, [availableModels, selectedCompany]);

  const handleTouchStart = React.useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  }, []);

  const handleTouchEnd = React.useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (touchStartXRef.current === null || visiblePlans.length <= 1) {
        return;
      }

      const endX = event.changedTouches[0]?.clientX ?? touchStartXRef.current;
      const deltaX = endX - touchStartXRef.current;
      touchStartXRef.current = null;

      const swipeThreshold = 50;
      if (Math.abs(deltaX) < swipeThreshold) {
        return;
      }

      if (deltaX < 0) {
        setMobileCardIndex((current) => Math.min(current + 1, visiblePlans.length - 1));
        return;
      }

      setMobileCardIndex((current) => Math.max(current - 1, 0));
    },
    [visiblePlans.length]
  );

  return (
    <motion.section
      ref={sectionRef}
      id="pricing"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="mt-24 w-full max-w-6xl px-4 py-6 text-left shadow-xl sm:px-6 sm:py-8"
    >
      <h2 className={HOME_SECTION_TITLE.replace("text-yellow-300", "text-amber-300")}>PRICING</h2>
      <p className={HOME_SECTION_SUBTITLE.replace("font-bold", "font-semibold")}>Premium Care. Transparent Plans.</p>
      <div className="mx-auto mt-6 grid w-full max-w-4xl grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2 md:gap-4">
        <label className={`flex flex-col gap-2 ${HOME_SECTION_BODY.replace("font-medium", "font-semibold")} text-amber-100`}>
          Select Vehicle Brand
          <select
            value={selectedCompany}
            onChange={(event) => handleCompanySelect(event.target.value)}
            className="w-full rounded-xl border border-violet-300/80 bg-[#020826]/70 px-3 py-2 text-sm text-white outline-none transition focus:border-amber-300 focus:bg-[#020826]/85 sm:px-4 sm:py-3"
          >
            <option value="" className="bg-[#020826] text-white">Choose a company</option>
            {CAR_COMPANIES.map((company) => (
              <option key={company} value={company} className="bg-[#020826] text-white">
                {company}
              </option>
            ))}
          </select>
        </label>

        <label className={`flex flex-col gap-2 ${HOME_SECTION_BODY.replace("font-medium", "font-semibold")} text-amber-100`}>
          Select Vehicle Model
          <select
            value={selectedModel}
            onChange={(event) => handleModelSelect(event.target.value)}
            disabled={!selectedCompany}
            className="w-full rounded-xl border border-violet-300/80 bg-[#020826]/70 px-3 py-2 text-sm text-white outline-none transition focus:border-amber-300 focus:bg-[#020826]/85 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:py-3"
          >
            <option value="" className="bg-[#020826] text-white">Choose a model</option>
            {availableModels.map((modelOption) => (
              <option key={modelOption.model} value={modelOption.model} className="bg-[#020826] text-white">
                {modelOption.model} ({modelOption.bucket})
              </option>
            ))}
          </select>
        </label>
      </div>

      {isCategoryLocked && selectedCompany && selectedModel && (
        <p className="mt-3 text-center text-sm font-semibold text-amber-200 sm:text-base">
          Category selected based on your selected model. Change company/model to update recommendation.
        </p>
      )}

      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { value: "Sedan", label: "Sedan/Hatchback/\nCompact SUV", image: "/sedan.png" },
          { value: "SUV", label: "Premium SUV", image: "/suv.png" },
          { value: "Bike", label: "Bike", image: "/bike.png" },
        ].map((item) => {
          const buttonCategory = item.value as VehicleCategory;
          const isDisabled = isCategoryLocked && buttonCategory !== selectedCategory && buttonCategory !== "Bike";

          return (
            <motion.button
              key={item.value}
              type="button"
              onClick={() => handleCategorySelect(buttonCategory)}
              disabled={isDisabled}
              initial={{ opacity: 0, y: 38, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.82, margin: "0px 0px -12% 0px" }}
              transition={{ duration: 0.42, ease: "easeOut" }}
              whileHover={isDisabled ? undefined : { y: -4, scale: 1.02 }}
              className={`group flex flex-col items-center justify-center text-center ${
                isDisabled ? "cursor-not-allowed opacity-45" : "cursor-pointer"
              }`}
            >
              <div
                className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full transition-colors duration-200 sm:h-52 sm:w-52 ${
                  selectedCategory === item.value ? "bg-white" : isDisabled ? "bg-transparent" : "bg-transparent group-hover:bg-white"
                }`}
              >
                <Image src={item.image} alt={item.label} width={200} height={200} className="h-20 w-20 object-contain sm:h-48 sm:w-48" />
              </div>
              <p
                className={`mt-2 whitespace-pre-line text-sm font-semibold tracking-tight sm:mt-3 sm:text-xl ${
                  selectedCategory === item.value ? "text-white" : isDisabled ? "text-white/55" : "text-amber-200"
                }`}
              >
                {item.label}
              </p>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-24 w-full md:hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="overflow-x-hidden pt-2">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${mobileCardIndex * 100}%)` }}
          >
            {visiblePlans.map(({ plan, features, Card }) => (
              <div key={`mobile-${plan.name}`} className="w-full shrink-0 px-1 pb-16 pt-1">
                <div className="relative">
                  <Card plan={plan} isPaying={isPaying} features={features} vehicleCategory={selectedCategory} onCheckout={onCheckout} />

                  {selectedCategory !== "Bike" && (
                    <p className="absolute left-1/2 top-full z-30 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-violet-300 bg-[#020826]/90 px-8 py-3 text-4xl font-extrabold tracking-tight text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:text-5xl">
                      {sharedCarOneTimePrice}
                      <span className="ml-1 text-lg font-medium text-white/85 sm:text-2xl">/One Time</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {visiblePlans.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {visiblePlans.map((entry, index) => (
              <button
                key={`mobile-indicator-${entry.plan.name}`}
                type="button"
                onClick={() => setMobileCardIndex(index)}
                aria-label={`Show ${entry.plan.name} plan`}
                className={`h-2.5 rounded-full transition-all ${mobileCardIndex === index ? "w-7 bg-white" : "w-2.5 bg-white/45"}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className={`relative mt-16 hidden w-full grid-cols-1 justify-items-center gap-6 md:grid ${selectedCategory === "Bike" ? "md:grid-cols-1" : "md:grid-cols-2"}`}>
        {visiblePlans.map(({ plan, features, Card }, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.42, delay: index * 0.08 }}
            className="h-full w-full max-w-2xl"
          >
            <Card plan={plan} isPaying={isPaying} features={features} vehicleCategory={selectedCategory} onCheckout={onCheckout} />
          </motion.div>
        ))}

        {selectedCategory !== "Bike" && visiblePlans.length === 2 && (
          <p className="absolute -bottom-11 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-violet-300 bg-[#020826]/90 px-8 py-3 text-4xl font-extrabold tracking-tight text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:text-5xl">
            {sharedCarOneTimePrice}
            <span className="ml-1 text-lg font-medium text-white/85 sm:text-2xl">/One Time</span>
          </p>
        )}
      </div>
    </motion.section>
  );
}

const PricingSection = React.memo(PricingSectionComponent);

export default PricingSection;
