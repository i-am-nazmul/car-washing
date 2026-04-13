"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import * as motion from "motion/react-client";
import MotionButton from "@/components/MotionButton";
import SiteFooter from "@/components/SiteFooter";
import { useIsLoading } from "@/store/store";
import Loader from "@/components/Loader";
import BikeCard, { BIKE_CARE_FEATURES, BIKE_CARE_PLAN } from "@/components/cards/bike";
import CarStandardCard, { CLEAN_CARE_FEATURES, CLEAN_CARE_PLAN } from "@/components/cards/carStandard";
import CarPremiumCard, { SHINE_CARE_FEATURES, SHINE_CARE_PLAN } from "@/components/cards/carPremium";
import ComboCard, { SMART_COMBO_FEATURES, SMART_COMBO_PLAN } from "@/components/cards/combo";
import { PlanData } from "@/components/cards/types";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function Home() {
  const router = useRouter();
  const { isLoading, setIsLoading } = useIsLoading();
  const [isPaying] = React.useState<string | null>(null);
  const [activePlan, setActivePlan] = React.useState<PlanData | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = React.useState(false);
  const pricingPlans = [
    { plan: CLEAN_CARE_PLAN, features: CLEAN_CARE_FEATURES, Card: CarStandardCard },
    { plan: SHINE_CARE_PLAN, features: SHINE_CARE_FEATURES, Card: CarPremiumCard },
    { plan: BIKE_CARE_PLAN, features: BIKE_CARE_FEATURES, Card: BikeCard },
    { plan: SMART_COMBO_PLAN, features: SMART_COMBO_FEATURES, Card: ComboCard },
  ];

  const planFeatures = Object.fromEntries(pricingPlans.map(({ plan, features }) => [plan.name, features]));

  React.useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  const handleGetStarted = function(){
    setIsLoading(true);
    router.push('/signup');
  }
  const handleLogin = function(){
    setIsLoading(true);
    router.push('/login');
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hey, I am interested in your services.");
    window.open(`https://wa.me/6002175516?text=${message}`, "_blank", "noopener,noreferrer");
  };

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCheckoutClick = (plan: PlanData) => {
    setActivePlan(plan);
    window.requestAnimationFrame(() => {
      setIsOverlayVisible(true);
    });
  };

  const closeOverlay = () => {
    setIsOverlayVisible(false);
    window.setTimeout(() => {
      setActivePlan(null);
    }, 220);
  };

  const contactOnWhatsApp = () => {
    if (!activePlan) {
      return;
    }

    const message = encodeURIComponent(`Hey, I want the ${activePlan.name} service.`);
    window.open(`https://wa.me/6002175516?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
  <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,#fde68a,#fff7d6_32%,#fefbf0_68%)] p-2 flex flex-col">
    {isLoading && <Loader message={"Wait"} />}
    <div className="w-full h-full flex-1 flex flex-col items-center rounded-t-2xl text-center bg-black px-4 py-6 sm:px-8 sm:py-10">


      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.8 }}
        transition={{ duration: 0.5 }}
        className="w-full flex items-center gap-2 sm:gap-4"
      >
        <div className="mr-auto flex items-center gap-0">
          <Image src="/logo_2.png" alt="The Shine Company logo" width={96} height={96} className="-mr-1 rounded-full object-cover sm:-mr-3 sm:h-24 sm:w-24 h-12 w-12" />
          <h1 className="text-left text-lg font-extrabold tracking-tight text-white drop-shadow-[0_0_8px_rgba(251,191,36,0.35)] sm:text-6xl">
            The Shine Company
          </h1>
        </div>

        <div className="ml-auto flex flex-wrap justify-end gap-2 sm:gap-4">
          <MotionButton
            className="hover-fill-ltr cursor-pointer rounded-full border border-amber-300/70 bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-amber-200/10 sm:text-base"
            onClick={scrollToPricing}
          >
            Pricing
          </MotionButton>
          <MotionButton
            className="hover-fill-ltr cursor-pointer rounded-full border border-amber-300/70 bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-amber-200/10 sm:text-base"
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            About us
          </MotionButton>
          <MotionButton
            className="hover-fill-ltr cursor-pointer rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold tracking-tight text-black hover:bg-amber-200 sm:text-base"
            onClick={handleLogin}
          >
            Login
          </MotionButton>
          <MotionButton
            className="hover-fill-ltr cursor-pointer rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold tracking-tight text-black hover:bg-amber-200 sm:text-base"
            onClick={handleGetStarted}
          >
            Get Started
          </MotionButton>
        </div>
      </motion.nav>





      {/* About Us */}
      <motion.section
        id="about"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.12 }}
        transition={{ duration: 0.35 }}
        className="mt-20 w-full max-w-6xl rounded-3xl border border-amber-300/30 bg-white/95 px-6 py-8 text-left shadow-lg"
      >
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">About Us</h2>
        <p className="mt-3 text-base text-gray-700 sm:text-lg">
          We are a doorstep vehicle care team focused on reliable service, cleaner methods, and consistent quality every week.
        </p>
        <p className="mt-2 text-base text-gray-700 sm:text-lg">
          Our crew handles regular maintenance for cars and bikes with transparent plans, trained staff, and quick customer support.
        </p>
        <p className="mt-2 text-base text-gray-700 sm:text-lg">
          From quick weekday cleanup to complete monthly care, we keep your vehicle ready for daily use with minimal hassle and timely service.
        </p>
        <p className="mt-2 text-base text-gray-700 sm:text-lg">
          We also track service quality through regular checklists so your washing, interior touch-ups, and tyre care stay consistent all month.
        </p>
      </motion.section>



      {/* Pricing */}
      <motion.section
        id="pricing"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="mt-10 w-full max-w-350 px-4 py-6 text-left shadow-xl sm:px-6 sm:py-8"
      >
        <h2 className="text-center text-2xl font-mono font-extrabold tracking-tight text-amber-300 sm:text-4xl">Choose Your Category</h2>
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
              <Card
                plan={plan}
                isPaying={isPaying}
                features={features}
                onCheckout={handleCheckoutClick}
              />
            </motion.div>
          ))}
        </div>

      </motion.section>


    </div>

    <button
      type="button"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 rounded-full bg-[#25D366] p-4 shadow-xl transition-transform duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer"
      onClick={openWhatsApp}
    >
      <WhatsAppIcon className="h-10 w-10 fill-white" />
    </button>

    {activePlan && (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 transition-opacity duration-200 ${isOverlayVisible ? "opacity-100" : "opacity-0"}`}
        onClick={closeOverlay}
      >
        <div
          className={`relative w-full max-w-3xl overflow-hidden rounded-4xl border border-white/70 shadow-2xl transition-all duration-200 ${isOverlayVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"}`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={`absolute inset-0 bg-linear-to-br ${activePlan.gradient}`} />
          <div className={`absolute -right-20 -top-20 h-64 w-64 rounded-full ${activePlan.bubbleOne}`} />
          <div className={`absolute -left-20 bottom-24 h-64 w-64 rounded-full ${activePlan.bubbleTwo}`} />

          <div className="relative z-10 px-6 py-6 sm:px-8 sm:py-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">{activePlan.name}</h2>
                {activePlan.description && <p className="mt-1 text-lg font-medium text-gray-800 sm:text-xl">{activePlan.description}</p>}
                <p className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">{activePlan.displayPrice} <span className="text-xl font-medium text-gray-700">/month</span></p>
              </div>
              <button
                className="rounded-full border border-gray-900 bg-white/85 px-3 py-1 text-base font-semibold text-gray-900 hover:bg-white cursor-pointer"
                onClick={closeOverlay}
                type="button"
              >
                Close
              </button>
            </div>

            <div className="mt-6">
              <p className="text-xl font-semibold tracking-tight text-gray-900">Included highlights</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {(planFeatures[activePlan.name] || []).map((feature) => (
                  <li key={`overlay-${activePlan.name}-${feature}`} className="flex items-center gap-2 text-lg text-gray-800">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-bold text-white">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex justify-end">
              <MotionButton
                className="rounded-full border border-gray-900 bg-white/95 px-6 py-2 text-lg font-semibold text-gray-900 hover:bg-white cursor-pointer"
                onClick={contactOnWhatsApp}
              >
                Contact Us
              </MotionButton>
            </div>
          </div>
        </div>
      </div>
    )}
    <SiteFooter />

  </div>
);

}