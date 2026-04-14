import React from "react";
import * as motion from "motion/react-client";

type AboutSectionProps = {
  aboutRef: React.RefObject<HTMLElement | null>;
  titleOpacity: number;
  sentenceOpacity: number;
  sentenceText: string;
};

function AboutSectionComponent({ aboutRef, titleOpacity, sentenceOpacity, sentenceText }: AboutSectionProps) {
  return (
    <section ref={aboutRef} id="about" className="mt-12 w-full max-w-6xl">
      <div className="relative h-[210vh]">
        <div className="sticky top-18 flex h-[72vh] flex-col items-center justify-start px-6 py-10 text-center">
          <motion.h2
            initial={{ opacity: 0.45 }}
            animate={{ opacity: titleOpacity }}
            transition={{ duration: 0.22, ease: "linear" }}
            className="text-4xl font-extrabold tracking-tight text-amber-200 sm:text-6xl"
          >
            About Us
          </motion.h2>

          <div className="relative mt-8 h-28 w-full max-w-5xl overflow-hidden">
            <p
              style={{ opacity: sentenceOpacity }}
              className="absolute inset-0 flex items-center justify-center px-4 text-center text-2xl font-semibold tracking-tight text-white sm:text-5xl"
            >
              {sentenceText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const AboutSection = React.memo(AboutSectionComponent);

export default AboutSection;
