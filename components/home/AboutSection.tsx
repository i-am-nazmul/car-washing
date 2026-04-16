import React from "react";

function AboutSectionComponent() {
  return (
    <section id="about" className="mt-12 w-full max-w-6xl px-4 sm:px-6">
      <h2 className="text-center text-4xl font-extrabold tracking-tight text-yellow-300 sm:text-6xl">About Us</h2>
      <div className="mt-3 flex w-full items-center justify-center">
        <p className="w-full text-center text-xl font-bold text-white sm:text-3xl">The New Standard of Vehicle Care.</p>
      </div>

      <div className="mx-auto mt-6 rounded-3xl border border-violet-300 p-6 text-left shadow-[0_0_18px_rgba(139,92,246,0.35)] sm:p-10">
        <div className="flex flex-col space-y-5 text-lg font-medium leading-relaxed text-white sm:text-2xl">
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
