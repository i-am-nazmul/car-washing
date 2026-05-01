import Image from "next/image";
import React from "react";
import * as motion from "motion/react-client";
import MotionButton from "@/components/MotionButton";

type HeroSectionProps = {
  onAbout: () => void;
  onHowItWorks: () => void;
  onShineProcess: () => void;
  onServices: () => void;
  onPricing: () => void;
  onContact: () => void;
  onLogin: () => void;
};

function HeroSectionComponent({
  onAbout,
  onHowItWorks,
  onShineProcess,
  onServices,
  onPricing,
  onContact,
  onLogin,
}: HeroSectionProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = React.useMemo(
    () => [
      { label: "ABOUT US", action: onAbout },
      { label: "HOW IT WORKS", action: onHowItWorks },
      { label: "SHINE PROCESS", action: onShineProcess },
      { label: "OUR SERVICES", action: onServices },
      { label: "PRICING", action: onPricing },
      { label: "CONTACT US", action: onContact },
      { label: "LOGIN", action: onLogin },
    ],
    [onAbout, onHowItWorks, onShineProcess, onServices, onPricing, onContact, onLogin]
  );

  React.useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen]);

  const handleMobileNavClick = React.useCallback((action: () => void) => {
    setIsMobileMenuOpen(false);
    action();
  }, []);

  return (
    <section className="relative min-h-svh w-full">

      <div className="absolute right-0 top-5 z-40 md:hidden">
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-xl border border-white/30 bg-black/35 p-3 text-amber-100 backdrop-blur-sm transition hover:bg-black/50"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/45 md:hidden" onClick={() => setIsMobileMenuOpen(false)} aria-hidden="true" />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[82vw] max-w-85 bg-[#050b2b]/95 px-5 py-6 shadow-2xl backdrop-blur-md transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo4.png"
              alt="The Shine Company"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="text-sm font-semibold tracking-wide text-amber-100">THE SHINE COMPANY</span>
          </div>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-lg border border-white/30 bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12" />
              <path d="M18 6l-12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {navItems.map((item) => (
            <MotionButton
              key={item.label}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-left text-sm font-semibold tracking-wide text-amber-100"
              onClick={() => handleMobileNavClick(item.action)}
            >
              {item.label}
            </MotionButton>
          ))}
        </div>
      </aside>

      <motion.nav
        initial={{ opacity: 0, y: -24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.8 }}
        transition={{ duration: 0.5 }}
        className="mt-6 hidden w-full flex-wrap items-center justify-center gap-2 sm:gap-3 md:flex"
      >
        <Image
          src="/logo4.png"
          alt="The Shine Company"
          width={44}
          height={44}
          className="h-10 w-10 object-contain sm:h-11 sm:w-11"
        />
        {navItems.map((item) => (
          <MotionButton
            key={item.label}
            className="hover-fill-ltr cursor-pointer rounded-full bg-transparent px-4 py-2 text-sm font-semibold tracking-tight text-amber-200 hover:bg-white hover:text-gray-800 sm:text-base"
            onClick={item.action}
          >
            {item.label}
          </MotionButton>
        ))}
      </motion.nav>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.8 }}
        transition={{ delay: 0.1, duration: 0.45 }}
        className="mt-2 flex min-h-[calc(100svh-8.5rem)] w-full flex-col items-center justify-center"
      >
        <Image
          src="/logo4.png"
          alt="The Shine Company logo"
          width={320}
          height={320}
          className="mt-4 h-[clamp(6rem,11.2vw,10.4rem)] w-[clamp(6rem,11.2vw,10.4rem)] object-contain"
        />
        <h1 className="mt-5 text-center text-[clamp(1.6rem,6.4vw,5.2rem)] font-bold leading-[0.95] tracking-tight text-white drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]">
          THE SHINE COMPANY
        </h1>

        <p className="mt-3 max-w-4xl text-center text-[clamp(0.88rem,2.4vw,2.4rem)] font-semibold leading-tight text-white">
          Driven by Shine. Delivered With Care.
        </p>
      </motion.div>
    </section>
  );
}

const HeroSection = React.memo(HeroSectionComponent);

export default HeroSection;
