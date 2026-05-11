"use client";
import { useRouter } from "next/navigation";
import React from "react";
import * as motion from "motion/react-client";
import MotionButton from "@/components/MotionButton";
import SiteFooter from "@/components/SiteFooter";
import { useIsLoading } from "@/store/store";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import BikeCard, { BIKE_CARE_FEATURES, BIKE_CARE_PLAN } from "@/components/cards/bike";
import CarStandardCard, { CLEAN_CARE_FEATURES, CLEAN_CARE_PLAN } from "@/components/cards/carStandard";
import CarPremiumCard, { SHINE_CARE_FEATURES, SHINE_CARE_PLAN } from "@/components/cards/carPremium";
import ComboCard, { SMART_COMBO_FEATURES, SMART_COMBO_PLAN } from "@/components/cards/combo";
import { PlanData } from "@/components/cards/types";
import axios from "axios";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import ShineProcessSection from "@/components/home/ShineProcessSection";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import PricingSection from "@/components/home/PricingSection";
import { HOME_CTA_GRADIENT, HOME_SECTION_BODY, HOME_SECTION_SUBTITLE, HOME_SECTION_TITLE } from "@/components/home/typography";

const WHATSAPP_PHONE = "6366247239";
const WHATSAPP_WA_PHONE = `91${WHATSAPP_PHONE}`;
const SUPPORT_EMAIL = "support@shinecompany.in";

export default function Home() {
  const router = useRouter();
  const { isLoading, setIsLoading } = useIsLoading();
  const backgroundVideos = React.useMemo(() => ["/washing.mp4", "/washing2.mp4"], []);
  const [activeBackgroundVideoIndex, setActiveBackgroundVideoIndex] = React.useState(0);
  const backgroundVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const [contactName, setContactName] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [contactMessage, setContactMessage] = React.useState("");
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
    const videoElement = backgroundVideoRef.current;
    if (!videoElement) {
      return;
    }

    const playPromise = videoElement.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Autoplay might be blocked in some browsers until user interaction.
      });
    }
  }, [activeBackgroundVideoIndex]);

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

  const handleLogin = React.useCallback(function(){
    setIsLoading(true);
    router.push('/user/login');
  }, [router, setIsLoading]);

  const openWhatsApp = React.useCallback(() => {
    const message = encodeURIComponent("Hey, I am interested in your services.");
    window.open(`https://wa.me/${WHATSAPP_WA_PHONE}?text=${message}`, "_blank", "noopener,noreferrer");
  }, []);

  const scrollToPricing = React.useCallback(() => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const scrollToSection = React.useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const SECTION_NAV_OFFSET = 60;

  const scrollToAbout = React.useCallback(() => scrollToSection("about"), [scrollToSection]);
  const scrollToHow = React.useCallback(() => {
    const section = document.getElementById("how-it-works");
    if (!section) {
      return;
    }

    const isMobile = window.innerWidth < 640;
    const offset = isMobile ? 24 : 80;
    const targetTop = window.scrollY + section.getBoundingClientRect().top - offset;
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  }, []);
  const scrollToShineProcess = React.useCallback(() => {
    const section = document.getElementById("shine-process");
    if (!section) {
      return;
    }

    const targetTop = window.scrollY + section.getBoundingClientRect().top - SECTION_NAV_OFFSET;
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  }, [SECTION_NAV_OFFSET]);

  const scrollToServices = React.useCallback(() => {
    const section = document.getElementById("services");
    if (!section) {
      return;
    }

    const targetTop = window.scrollY + section.getBoundingClientRect().top - SECTION_NAV_OFFSET;
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  }, [SECTION_NAV_OFFSET]);
  const scrollToContact = React.useCallback(() => scrollToSection("contact"), [scrollToSection]);

  const assignPlanToUser = React.useCallback(async (plan: PlanData, vehicleCategory: string) => {
    try {
      const response = await axios.post("/api/plans/assign", {
        planName: plan.name,
        vehicleCategory,
      });

      if (response.status === 201) {
        toast.success("Plan added to your account");
        return true;
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          router.push("/user/login?next=/#pricing");
          return false;
        }
        toast.error(error.response?.data?.message || "Failed to add plan");
      } else {
        toast.error("Failed to add plan");
      }
    }

    return false;
  }, [router]);

  const handleCheckoutClick = React.useCallback((plan: PlanData, vehicleCategory: string) => {
    setActivePlan(plan);
    setIsOverlayVisible(true);
    void assignPlanToUser(plan, vehicleCategory);
  }, [assignPlanToUser]);

  const closeOverlay = React.useCallback(() => {
    setIsOverlayVisible(false);
    window.setTimeout(() => {
      setActivePlan(null);
    }, 220);
  }, []);

  const goToDashboard = React.useCallback(() => {
    setIsOverlayVisible(false);
    window.setTimeout(() => {
      setActivePlan(null);
    }, 220);
    router.push("/user/dashboard");
  }, [router]);

  const handleContactSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
        return;
      }

      const whatsappText = encodeURIComponent(
        [
          "Hello The Shine Company,",
          "",
          "I am interested in your services.",
          `Name: ${contactName.trim()}`,
          `Email: ${contactEmail.trim()}`,
          `Message: ${contactMessage.trim()}`,
        ].join("\n")
      );

      window.open(`https://wa.me/${WHATSAPP_WA_PHONE}?text=${whatsappText}`, "_blank", "noopener,noreferrer");
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    },
    [contactName, contactEmail, contactMessage]
  );

  return (
  <div className="relative min-h-dvh w-full overflow-x-hidden">
    <video
      ref={backgroundVideoRef}
      key={backgroundVideos[activeBackgroundVideoIndex]}
      autoPlay
      muted
      playsInline
      preload="metadata"
      className="fixed inset-0 -z-20 h-full w-full object-cover"
      onEnded={() => {
        setActiveBackgroundVideoIndex((prev) => (prev + 1) % backgroundVideos.length);
      }}
    >
      <source src={backgroundVideos[activeBackgroundVideoIndex]} type="video/mp4" />
    </video>
    <div className="fixed inset-0 -z-10 bg-[#000017]/70" />

    <div className="flex min-h-dvh flex-col p-2">
    {isLoading && <Loader />}
    <div className="h-full w-full flex-1 flex flex-col items-center rounded-none bg-transparent px-4 py-6 text-center sm:rounded-t-2xl sm:px-8 sm:py-10">

      <section className="flex min-h-svh w-full max-w-6xl flex-col">
        <HeroSection
          onAbout={scrollToAbout}
          onHowItWorks={scrollToHow}
          onShineProcess={scrollToShineProcess}
          onServices={scrollToServices}
          onPricing={scrollToPricing}
          onContact={scrollToContact}
          onLogin={handleLogin}
        />
      </section>

      <AboutSection />

      <HowItWorksSection howRef={howRef} howVisibleStep={howVisibleStep} />

      <ShineProcessSection />

      <div className="mt-10 sm:mt-18 lg:mt-32">
        <ServicesSection />
      </div>

      <PricingSection pricingPlans={pricingPlans} isPaying={isPaying} onCheckout={handleCheckoutClick} />

      <div className="mx-auto mt-8 w-full max-w-4xl rounded-3xl border border-violet-300 bg-transparent px-6 py-4 text-center shadow-[0_0_18px_rgba(139,92,246,0.35)]">
        <p className="m-0 text-base sm:text-2xl text-white font-bold">
          If you are looking for SMART COMBO Plan and would like to avail special discounts, please feel free to reach out to us.
        </p>
      </div>

      <div id="contact" className="mt-25 w-full max-w-6xl text-center">
        <h2 className={HOME_SECTION_TITLE}>CONTACT US</h2>
        <p className={HOME_SECTION_SUBTITLE}>Ready for Smarter Routine?</p>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.12 }}
          transition={{ duration: 0.45 }}
          className="mx-auto mt-5 w-full max-w-4xl rounded-3xl border border-violet-300 bg-transparent px-6 py-10 text-center shadow-[0_0_18px_rgba(139,92,246,0.35)]"
        >
          <p className={HOME_SECTION_BODY}>Now launching exclusively for Gated Societies.</p>
          <p className={`mt-1 ${HOME_SECTION_BODY}`}>Submit your query.</p>

          <div className="mt-4 flex flex-col items-center gap-1 text-sm text-violet-100 sm:text-lg">
            <p>Phone: <span className="font-bold text-white">+91 63662 47239</span></p>
            <p>Email: <span className="font-bold text-white">{SUPPORT_EMAIL}</span></p>
          </div>

          <form onSubmit={handleContactSubmit} className="mx-auto mt-6 grid w-full max-w-2xl grid-cols-1 gap-4 text-left">
            <input
              type="text"
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
              placeholder="Your Name"
              required
              className="w-full rounded-xl border border-violet-300 bg-black/35 px-4 py-3 text-base text-white placeholder:text-violet-200/80 outline-none focus:border-violet-200"
            />
            <input
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-violet-300 bg-black/35 px-4 py-3 text-base text-white placeholder:text-violet-200/80 outline-none focus:border-violet-200"
            />
            <textarea
              value={contactMessage}
              onChange={(event) => setContactMessage(event.target.value)}
              placeholder="Write your message"
              required
              rows={4}
              className="w-full resize-y rounded-xl border border-violet-300 bg-black/35 px-4 py-3 text-base text-white placeholder:text-violet-200/80 outline-none focus:border-violet-200"
            />

            <button
              type="submit"
              className={`hover-fill-ltr cursor-pointer rounded-full px-6 py-3 text-lg font-semibold transition ${HOME_CTA_GRADIENT}`}
            >
              Submit
            </button>

          </form>
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
                onClick={goToDashboard}
              >
                Go to Dashboard
              </MotionButton>
            </div>
          </div>
        </div>
      </div>
    )}
    <SiteFooter />
    </div>
  </div>
  </div>
);

}
