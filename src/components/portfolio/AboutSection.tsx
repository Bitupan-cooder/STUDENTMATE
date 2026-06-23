import React from 'react';
import FadeIn from './FadeIn';
import AnimatedText from './AnimatedText';
import ContactButton from './ContactButton';

interface AboutSectionProps {
  onToggleCockpit: () => void;
}

export default function AboutSection({ onToggleCockpit }: AboutSectionProps) {
  return (
    <section id="about-sec" className="relative min-h-screen w-full bg-[#0C0C0C] py-20 px-5 sm:px-8 md:px-10 flex flex-col justify-center items-center overflow-hidden select-none text-white">
      {/* Absolute Decorative 3D Images in Corners */}
      {/* 1. Top-left: Moon icon */}
      <div className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-0 pointer-events-none">
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
            alt="3D Moon"
            className="w-[120px] sm:w-[160px] md:w-[210px] h-auto object-contain filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            referrerPolicy="no-referrer"
          />
        </FadeIn>
      </div>

      {/* 2. Bottom-left: 3D object */}
      <div className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-0 pointer-events-none">
        <FadeIn delay={0.25} x={-80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
            alt="3D object decoration"
            className="w-[100px] sm:w-[140px] md:w-[180px] h-auto object-contain filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            referrerPolicy="no-referrer"
          />
        </FadeIn>
      </div>

      {/* 3. Top-right: Lego icon */}
      <div className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-0 pointer-events-none">
        <FadeIn delay={0.15} x={80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
            alt="3D Lego Block"
            className="w-[120px] sm:w-[160px] md:w-[210px] h-auto object-contain filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            referrerPolicy="no-referrer"
          />
        </FadeIn>
      </div>

      {/* 4. Bottom-right: 3D group */}
      <div className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-0 pointer-events-none">
        <FadeIn delay={0.3} x={80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
            alt="3D Shapes Stack"
            className="w-[130px] sm:w-[170px] md:w-[220px] h-auto object-contain filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            referrerPolicy="no-referrer"
          />
        </FadeIn>
      </div>

      {/* Content layout with exact vertical padding and spacing gaps */}
      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center">
        {/* Heading: Centered clamp sizing */}
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight select-none mb-10 sm:mb-14 md:mb-16"
            style={{ fontSize: 'clamp(3rem, 11vw, 150px)' }}
          >
            About me
          </h2>
        </FadeIn>

        {/* Animated paragraph: Character-by-character scroll opacity reveal */}
        <div className="w-full max-w-[560px] mx-auto text-center">
          <AnimatedText
            text="With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!"
            className="text-[#D7E2EA] font-medium leading-relaxed font-sans"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
        </div>

        {/* Button triggers cockpit with precise gaps */}
        <div className="mt-16 sm:mt-20 md:mt-24 pointer-events-auto">
          <FadeIn delay={0.4} y={20}>
            <ContactButton label="LAUNCH WORKSPACE" onClick={onToggleCockpit} />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
