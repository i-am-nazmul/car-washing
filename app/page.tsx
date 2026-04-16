"use client";
import { useRouter } from "next/navigation";
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
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import PricingSection from "@/components/home/PricingSection";

const WHATSAPP_PHONE = "916002175516";

export default function Home() {
  const router = useRouter();
  const { isLoading, setIsLoading } = useIsLoading();
  const [isPaying] = React.useState<string | null>(null);
  const [activePlan, setActivePlan] = React.useState<PlanData | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = React.useState(false);
  const howRef = React.useRef<HTMLElement | null>(null);
  const howStepRef = React.useRef(-1);
  const [howVisibleStep, setHowVisibleStep] = React.useState(0);
  const pricingPlans = React.useMemo(
    () => [
      { plan: CLEAN_CARE_PLAN, features: CLEAN_CARE_FEATURES, Card: CarStandardCard },
      { plan: SHINE_CARE_PLAN, features: SHINE_CARE_FEATURES, Card: CarPremiumCard },
      { plan: BIKE_CARE_PLAN, features: BIKE_CARE_FEATURES, Card: BikeCard },
      { plan: SMART_COMBO_PLAN, features: SMART_COMBO_FEATURES, Card: ComboCard },
    ],
    []
  );

  const planFeatures = React.useMemo(
    () => Object.fromEntries(pricingPlans.map(({ plan, features }) => [plan.name, features])),
    [pricingPlans]
  );

  React.useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  React.useEffect(() => {
    let rafId: number | null = null;

    const runScrollEffects = () => {
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

  const handleGetStarted = React.useCallback(function(){
    setIsLoading(true);
    router.push('/signup');
  }, [router, setIsLoading]);
  const handleLogin = React.useCallback(function(){
    setIsLoading(true);
    router.push('/login');
  }, [router, setIsLoading]);

  const openWhatsApp = React.useCallback(() => {
    const message = encodeURIComponent("Hey, I am interested in your services.");
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, "_blank", "noopener,noreferrer");
  }, []);

  const scrollToPricing = React.useCallback(() => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const scrollToSection = React.useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const SECTION_NAV_OFFSET = 74;

  const scrollToAbout = React.useCallback(() => scrollToSection("about"), [scrollToSection]);
  const scrollToHow = React.useCallback(() => {
    const section = document.getElementById("how-it-works");
    if (!section) {
      return;
    }

    const targetTop = window.scrollY + section.getBoundingClientRect().top + SECTION_NAV_OFFSET;
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  }, [SECTION_NAV_OFFSET]);
  const scrollToServices = React.useCallback(() => {
    const section = document.getElementById("services");
    if (!section) {
      return;
    }

    const targetTop = window.scrollY + section.getBoundingClientRect().top + SECTION_NAV_OFFSET;
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  }, [SECTION_NAV_OFFSET]);
  const scrollToContact = React.useCallback(() => scrollToSection("contact"), [scrollToSection]);

  const handleCheckoutClick = React.useCallback((plan: PlanData) => {
    setActivePlan(plan);
    window.requestAnimationFrame(() => {
      setIsOverlayVisible(true);
    });
  }, []);

  const closeOverlay = React.useCallback(() => {
    setIsOverlayVisible(false);
    window.setTimeout(() => {
      setActivePlan(null);
    }, 220);
  }, []);

  const contactOnWhatsApp = React.useCallback(() => {
    if (!activePlan) {
      return;
    }

    const message = encodeURIComponent(`Hey, I want the ${activePlan.name} service.`);
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, "_blank", "noopener,noreferrer");
  }, [activePlan]);

  return (
  <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,#fde68a,#fff7d6_32%,#fefbf0_68%)] p-2 flex flex-col">
    {isLoading && <Loader />}
    <div className="w-full h-full flex-1 flex flex-col items-center rounded-t-2xl text-center bg-black px-4 py-6 sm:px-8 sm:py-10">

      <section className="flex min-h-[100svh] w-full max-w-6xl flex-col">
        <HeroSection
          onAbout={scrollToAbout}
          onHowItWorks={scrollToHow}
          onServices={scrollToServices}
          onPricing={scrollToPricing}
          onContact={scrollToContact}
          onLogin={handleLogin}
          onSignup={handleGetStarted}
        />
      </section>

      <AboutSection />

      <HowItWorksSection howRef={howRef} howVisibleStep={howVisibleStep} />

      <ServicesSection />

      <PricingSection pricingPlans={pricingPlans} isPaying={isPaying} onCheckout={handleCheckoutClick} />

      <div id="contact" className="mt-10 w-full max-w-6xl text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-yellow-300 sm:text-4xl">Contact Us</h2>
        <p className="mt-3 text-lg font-semibold text-white sm:text-2xl">Ready for Smarter Routine?</p>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.12 }}
          transition={{ duration: 0.45 }}
          className="mx-auto mt-5 w-full max-w-4xl rounded-3xl border border-violet-300 bg-transparent px-6 py-10 text-center shadow-[0_0_18px_rgba(139,92,246,0.35)]"
        >
          <p className="text-base text-white sm:text-2xl">Now launching exclusively for Alpine Viva residents.</p>
          <p className="mt-1 text-base text-white sm:text-2xl">Secure your dedicated cleaning schedule before they&apos;re gone.</p>
          <p className="mt-1 text-base text-white sm:text-2xl">Click on WhatsApp Button for instant booking and confirmation.</p>

          <div className="mt-6">
            <MotionButton
              className="hover-fill-ltr cursor-pointer rounded-full border border-emerald-900 bg-emerald-800 px-6 py-3 text-lg font-semibold text-white hover:bg-emerald-900"
              onClick={openWhatsApp}
            >
              WhatsApp
            </MotionButton>
          </div>

          <p className="mt-6 text-base font-semibold text-white sm:text-2xl">Professional. Verified. On time. Every time.</p>
          <p className="text-base font-medium text-white sm:text-2xl">Driven by Shine. Delivered with Care.</p>
        </motion.section>
      </div>


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