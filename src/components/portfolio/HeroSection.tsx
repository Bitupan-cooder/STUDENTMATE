import React from 'react';
import { motion } from 'motion/react';
import Magnet from './Magnet';
import FadeIn from './FadeIn';
import ContactButton from './ContactButton';

interface HeroSectionProps {
  onToggleCockpit: () => void;
  onScrollToSection: (id: string) => void;
}

export default function HeroSection({ onToggleCockpit, onScrollToSection }: HeroSectionProps) {
  return (
    <section id="hero" className="relative h-screen w-full flex flex-col justify-between overflow-x-clip bg-[#0C0C0C] select-none text-white font-sans">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-0 pointer-events-none" />

      {/* Navbar: Horizontal nav with 4 links */}
      <nav className="relative z-20 flex items-center justify-between w-full px-6 md:px-10 pt-6 md:pt-8">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-[#D7E2EA] text-sm md:text-xl uppercase tracking-widest font-marvel">
            JACK <span className="opacity-40">|</span> VELDARA
          </span>
          <span className="bg-red-650/15 border border-red-500/20 text-[#E21227] text-[8px] tracking-wider px-2 py-0.5 rounded-full font-mono uppercase font-black uppercase">
            LEARNING CORE Active
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-8 justify-between">
          <button
            onClick={() => onScrollToSection('about-sec')}
            className="text-xs md:text-sm lg:text-[1.2rem] text-[#D7E2EA] font-medium uppercase tracking-wider hover:opacity-75 transition-opacity duration-200 cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => onScrollToSection('services-sec')}
            className="text-xs md:text-sm lg:text-[1.2rem] text-[#D7E2EA] font-medium uppercase tracking-wider hover:opacity-75 transition-opacity duration-200 cursor-pointer"
          >
            Price
          </button>
          <button
            onClick={() => onScrollToSection('projects-sec')}
            className="text-xs md:text-sm lg:text-[1.2rem] text-[#D7E2EA] font-medium uppercase tracking-wider hover:opacity-75 transition-opacity duration-200 cursor-pointer"
          >
            Projects
          </button>
          <button
            onClick={onToggleCockpit}
            className="bg-[#E21227] hover:bg-neutral-900 border border-transparent hover:border-[#E21227]/30 text-white font-black text-[10px] md:text-xs uppercase tracking-widest font-marvel px-4 py-1.5 rounded-full shadow-lg transition-all transform -skew-x-4 cursor-pointer"
          >
            STUDY WORKSPACE
          </button>
        </div>
      </nav>

      {/* Hero Portrait: Centered absolutely */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 pointer-events-auto">
        <FadeIn delay={0.6} y={30}>
          <Magnet padding={150} strength={3}>
            <div className="w-[260px] sm:w-[320px] md:w-[380px] lg:w-[460px] select-none pointer-events-auto">
              <img
                src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
                alt="Jack portrait"
                className="w-full h-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.8)] filter brightness-[1.08] pointer-events-none"
                referrerPolicy="no-referrer"
              />
            </div>
          </Magnet>
        </FadeIn>
      </div>

      {/* Hero Heading: Massive upper text */}
      <div className="relative z-10 w-full text-center px-4 overflow-hidden mt-12 sm:mt-8 md:-mt-4">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap text-[12vw] sm:text-[13vw] md:text-[14vw] lg:text-[16vw]">
            Hi, i&apos;m jack
          </h1>
        </FadeIn>
      </div>

      {/* Bottom bar: Info + Action indicator */}
      <div className="relative z-10 w-full px-6 md:px-12 pb-7 sm:pb-8 md:pb-10 flex justify-between items-end gap-4 mt-auto">
        {/* Left comment card */}
        <FadeIn delay={0.35} y={20} className="text-left">
          <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[150px] sm:max-w-[210px] md:max-w-[250px]" style={{ fontSize: 'clamp(0.75rem, 1.3vw, 1.35rem)' }}>
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>

        {/* Right action call */}
        <FadeIn delay={0.5} y={20}>
          <ContactButton
            label="Open Cockpit"
            onClick={onToggleCockpit}
            className="transform scale-90 sm:scale-100 origin-bottom-right"
          />
        </FadeIn>
      </div>
    </section>
  );
}
