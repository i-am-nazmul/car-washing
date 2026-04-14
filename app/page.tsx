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
    window.open(`https://wa.me/6002175516?text=${message}`, "_blank", "noopener,noreferrer");
  }, []);

  const scrollToPricing = React.useCallback(() => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const scrollToSection = React.useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const scrollToAbout = React.useCallback(() => scrollToSection("about"), [scrollToSection]);
  const scrollToHow = React.useCallback(() => scrollToSection("how-it-works"), [scrollToSection]);
  const scrollToServices = React.useCallback(() => scrollToSection("services"), [scrollToSection]);
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
    window.open(`https://wa.me/6002175516?text=${message}`, "_blank", "noopener,noreferrer");
  }, [activePlan]);

  return (
  <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,#fde68a,#fff7d6_32%,#fefbf0_68%)] p-2 flex flex-col">
    {isLoading && <Loader message={"Wait"} />}
    <div className="w-full h-full flex-1 flex flex-col items-center rounded-t-2xl text-center bg-black px-4 py-6 sm:px-8 sm:py-10">


      <HeroSection
        onAbout={scrollToAbout}
        onHowItWorks={scrollToHow}
        onServices={scrollToServices}
        onPricing={scrollToPricing}
        onContact={scrollToContact}
        onLogin={handleLogin}
        onSignup={handleGetStarted}
      />

      <HowItWorksSection howRef={howRef} howVisibleStep={howVisibleStep} />

      <AboutSection
        aboutRef={aboutRef}
        titleOpacity={aboutTitleOpacity}
        sentenceOpacity={aboutSentenceOpacity}
        sentenceText={aboutSentenceText}
      />

      <ServicesSection />

      <PricingSection pricingPlans={pricingPlans} isPaying={isPaying} onCheckout={handleCheckoutClick} />

      <motion.section
        id="contact"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.12 }}
        transition={{ duration: 0.45 }}
        className="mt-10 w-full max-w-6xl rounded-3xl border border-emerald-200/60 bg-linear-to-br from-emerald-50 via-white to-lime-100 px-6 py-10 text-left shadow-xl"
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