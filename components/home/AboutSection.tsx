import React from "react";

function AboutSectionComponent() {
  return (
    <section id="about" className="mt-10 w-full max-w-6xl px-4 sm:px-6">
      <h2 className="text-center text-2xl font-extrabold tracking-tight text-yellow-300 sm:text-5xl">ABOUT US</h2>
      <div className="mt-2 flex w-full items-center justify-center">
        <p className="w-full text-center text-base font-bold text-white sm:text-2xl">The New Standard of Vehicle Care.</p>
      </div>

      <div className="mx-auto mt-5 rounded-3xl border border-violet-300 p-3 text-left shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:p-6 lg:p-8">
        <div className="flex flex-col space-y-3 text-sm font-medium leading-relaxed text-white sm:space-y-4 sm:text-base lg:text-lg">
          <p>
             Driven by Shine. Delivered With Care. We provide premium, daily waterless vehicle detailing exclusively for gated communities.
          </p>
          <p>
            We started with one clear insight: most residential vehicle cleaning is inconsistent, rushed, and unmanaged. Our model replaces that with a professional system, verified staff, and a cleaner standard of service.
          </p>
          <p>
            No random washers. No repeated follow-ups. No micro-scratches. No water stains. Just a reliable, waterless, high-quality clean that fits into modern community living.
          </p>
        </div>
      </div>
    </section>
  );
}

const AboutSection = React.memo(AboutSectionComponent);

export default AboutSection;
