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

const ABOUT_SENTENCES = [
  "New Standard of Vehicle Care.",
  "Driven by Shine.",
  "Delivered with Care.",
  "No random washers.",
  "No repeated follow ups.",
  "No micro scratches.",
  "No water stains.",
  "Only reliable, waterless, high-quality clean that fits into modern community living.",
];

export default function Home() {
  const router = useRouter();
  const { isLoading, setIsLoading } = useIsLoading();
  const [isPaying] = React.useState<string | null>(null);
  const [activePlan, setActivePlan] = React.useState<PlanData | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = React.useState(false);
  const aboutRef = React.useRef<HTMLElement | null>(null);
  const howRef = React.useRef<HTMLElement | null>(null);
  const aboutProgressRef = React.useRef(-1);
  const howStepRef = React.useRef(-1);
  const [aboutScrollProgress, setAboutScrollProgress] = React.useState(0);
  const [howVisibleStep, setHowVisibleStep] = React.useState(0);
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

  React.useEffect(() => {
    let rafId: number | null = null;

    const runScrollEffects = () => {
      if (aboutRef.current) {
        const rect = aboutRef.current.getBoundingClientRect();
        const viewportCenter = window.innerHeight * 0.5;
        const totalScrollable = Math.max(1, rect.height - viewportCenter);
        const scrolled = Math.min(Math.max(viewportCenter - rect.top, 0), totalScrollable);
        const progress = scrolled / totalScrollable;
        if (Math.abs(progress - aboutProgressRef.current) > 0.01) {
          aboutProgressRef.current = progress;
          setAboutScrollProgress(progress);
        }
      }

      if (howRef.current) {
        const rect = howRef.current.getBoundingClientRect();
        const enterThreshold = window.innerHeight * 0.78;
        const exitThreshold = window.innerHeight * 0.2;
        const pathStartTrigger = window.innerHeight * 0.5;

        if (rect.top > enterThreshold || rect.bottom < exitThreshold) {
          if (howStepRef.current !== 0) {
            howStepRef.current = 0;
            setHowVisibleStep(0);
          }
          return;
        }

        const totalScrollable = Math.max(1, rect.height - window.innerHeight);
        const scrolled = Math.min(Math.max(pathStartTrigger - rect.top, 0), totalScrollable);
        const progress = scrolled / totalScrollable;
        let nextStep = 3;

        if (progress < 0.34) {
          nextStep = 1;
        } else if (progress < 0.67) {
          nextStep = 2;
        }

        if (howStepRef.current !== nextStep) {
          howStepRef.current = nextStep;
          setHowVisibleStep(nextStep);
        }
      }
    };

    const scheduleScrollEffects = () => {
      if (rafId !== null) {
        return;
      }

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        runScrollEffects();
      });
    };

    scheduleScrollEffects();
    window.addEventListener("scroll", scheduleScrollEffects, { passive: true });
    window.addEventListener("resize", scheduleScrollEffects);

    return () => {
      window.removeEventListener("scroll", scheduleScrollEffects);
      window.removeEventListener("resize", scheduleScrollEffects);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const aboutExactIndex = aboutScrollProgress * (ABOUT_SENTENCES.length - 1);
  const aboutBaseIndex = Math.floor(aboutExactIndex);
  const aboutPhase = aboutExactIndex - aboutBaseIndex;
  const aboutCurrentSentence = ABOUT_SENTENCES[Math.min(aboutBaseIndex, ABOUT_SENTENCES.length - 1)];
  const aboutNextSentence = ABOUT_SENTENCES[Math.min(aboutBaseIndex + 1, ABOUT_SENTENCES.length - 1)];
  const aboutTitleOpacity = aboutPhase < 0.5 ? 0.55 + (aboutPhase / 0.5) * 0.45 : 1 - ((aboutPhase - 0.5) / 0.5) * 0.45;

  let aboutSentenceText = aboutCurrentSentence;
  let aboutSentenceOpacity = 1;

  if (aboutPhase >= 0.45 && aboutPhase < 0.65) {
    aboutSentenceOpacity = 1 - (aboutPhase - 0.45) / 0.2;
  } else if (aboutPhase >= 0.65 && aboutPhase < 0.8) {
    aboutSentenceOpacity = 0;
  } else if (aboutPhase >= 0.8 && aboutBaseIndex < ABOUT_SENTENCES.length - 1) {
    aboutSentenceText = aboutNextSentence;
    aboutSentenceOpacity = (aboutPhase - 0.8) / 0.2;
  }

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

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        className="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      >
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={() => scrollToSection("about")}
        >
          About
        </MotionButton>
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={() => scrollToSection("how-it-works")}
        >
          How It Works
        </MotionButton>
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={() => scrollToSection("services")}
        >
          Services
        </MotionButton>
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={scrollToPricing}
        >
          Pricing
        </MotionButton>
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={() => scrollToSection("contact")}
        >
          Contact
        </MotionButton>
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={handleLogin}
        >
          Login
        </MotionButton>
        <MotionButton
          className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
          onClick={handleGetStarted}
        >
          Signup
        </MotionButton>
      </motion.nav>


      {/* Company Info */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.8 }}
        transition={{ delay: 0.1, duration: 0.45 }}
        className="mt-6 flex flex-col items-center"
      >
        <Image src="/logo_2.png" alt="The Shine Company logo" width={192} height={192} className="rounded-full object-cover h-32 w-32 sm:h-48 sm:w-48" />
        <h1 className="mt-3 text-center text-2xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(251,191,36,0.35)] sm:text-6xl">
          The Shine Company
        </h1>
        <p className="mt-4 max-w-3xl text-center text-sm font-medium tracking-wide text-amber-200/90 sm:text-lg">
          The New Standard of Vehicle Care.
        </p>
        <p className="max-w-3xl text-center text-base font-semibold text-white sm:text-2xl">
          Driven by Shine. Delivered With Care.
        </p>
      </motion.div>

      <section ref={howRef} id="how-it-works" className="mt-10 w-full max-w-6xl">
        <div className="relative h-[210vh] overflow-hidden">
          <div className="sticky top-18 h-[78vh] px-6 py-10">
            <h2 className="text-center text-3xl font-extrabold tracking-tight text-amber-200 sm:text-5xl">How It Works</h2>
            <p className="mt-2 text-center text-base font-medium text-amber-100/80 sm:text-xl">Three steps to a permanently clean vehicle.</p>

            <div className="relative mx-auto mt-20 max-w-5xl space-y-28">
              <motion.div
                initial={false}
                animate={{ opacity: howVisibleStep >= 1 ? 1 : 0, x: howVisibleStep >= 1 ? 0 : "-120vw" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="relative flex justify-start transform-gpu will-change-transform"
              >
                <div className="aspect-square w-full max-w-[14rem] rounded-full border border-violet-300 bg-purple-600 p-5 text-center text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:max-w-[16rem] flex flex-col items-center justify-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-violet-100 sm:text-sm">Step 1</p>
                  <h3 className="mt-1 text-xl font-bold sm:text-2xl">Choose Your Plan</h3>
                  <p className="mt-2 text-sm text-violet-100 sm:text-base">Select the subscription that fits your car, bike, or both.</p>
                </div>
              </motion.div>

              <motion.div
                initial={false}
                animate={{ opacity: howVisibleStep >= 2 ? 1 : 0, x: howVisibleStep >= 2 ? 0 : "120vw" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="relative flex justify-end transform-gpu will-change-transform"
              >
                <div className="aspect-square w-full max-w-[14rem] rounded-full border border-violet-300 bg-violet-600 p-5 text-center text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:max-w-[16rem] flex flex-col items-center justify-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-violet-100 sm:text-sm">Step 2</p>
                  <h3 className="mt-1 text-xl font-bold sm:text-2xl">We Take Over</h3>
                  <p className="mt-2 text-sm text-violet-100 sm:text-base">Our team arrives at your parking area 5 days a week for professional, eco-friendly cleaning.</p>
                </div>
              </motion.div>

              <motion.div
                initial={false}
                animate={{ opacity: howVisibleStep >= 3 ? 1 : 0, x: howVisibleStep >= 3 ? 0 : "-120vw" }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="relative flex justify-start transform-gpu will-change-transform"
              >
                <div className="aspect-square w-full max-w-[14rem] rounded-full border border-violet-300 bg-violet-600 p-5 text-center text-white shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:max-w-[16rem] flex flex-col items-center justify-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-violet-100 sm:text-sm">Step 3</p>
                  <h3 className="mt-1 text-xl font-bold sm:text-2xl">Enjoy the Shine</h3>
                  <p className="mt-2 text-sm text-violet-100 sm:text-base">Park. Drive. Repeat. No scheduling. No waiting. Enjoy a clean vehicle without spending your time on it.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>



      {/* About Us */}
      <section ref={aboutRef} id="about" className="mt-12 w-full max-w-6xl">
        <div className="relative h-[210vh]">
          <div className="sticky top-18 flex h-[72vh] flex-col items-center justify-start px-6 py-10 text-center">
            <motion.h2
              initial={{ opacity: 0.45 }}
              animate={{ opacity: aboutTitleOpacity }}
              transition={{ duration: 0.22, ease: "linear" }}
              className="text-4xl font-extrabold tracking-tight text-amber-200 sm:text-6xl"
            >
              About Us
            </motion.h2>


            <div className="relative mt-8 h-28 w-full max-w-5xl overflow-hidden">
              <p
                style={{
                  opacity: aboutSentenceOpacity,
                }}
                className="absolute inset-0 flex items-center justify-center px-4 text-center text-2xl font-semibold tracking-tight text-white sm:text-5xl"
              >
                {aboutSentenceText}
              </p>
            </div>
          </div>
        </div>
      </section>

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



      {/* Pricing */}
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

      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.12 }}
        transition={{ duration: 0.45 }}
        className="mt-10 w-full max-w-6xl rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-lime-100 px-6 py-10 text-left shadow-xl"
      >
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Contact Us</h2>
        <p className="mt-3 text-lg font-semibold text-gray-800 sm:text-2xl">Ready for Smarter Routine?</p>
        <p className="mt-3 text-base text-gray-700 sm:text-lg">Now launching exclusively for Alpine Viva residents.</p>
        <p className="mt-1 text-base text-gray-700 sm:text-lg">Secure your dedicated cleaning schedule before they&apos;re gone.</p>
        <p className="mt-1 text-base text-gray-700 sm:text-lg">Click on WhatsApp Button for instant booking and confirmation.</p>

        <div className="mt-6">
          <MotionButton
            className="hover-fill-ltr cursor-pointer rounded-full border border-emerald-900 bg-emerald-800 px-6 py-3 text-lg font-semibold text-white hover:bg-emerald-900"
            onClick={openWhatsApp}
          >
            WhatsApp Button
          </MotionButton>
        </div>

        <p className="mt-6 text-base font-semibold text-gray-800 sm:text-xl">Professional. Verified. On time. Every time.</p>
        <p className="text-base font-medium text-gray-700 sm:text-lg">Driven by Shine. Delivered with Care.</p>
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