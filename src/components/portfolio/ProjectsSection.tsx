import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import FadeIn from './FadeIn';
import LiveProjectButton from './LiveProjectButton';

const projects = [
  {
    num: '01',
    category: 'Client Work',
    name: 'Nextlevel Studio',
    tabId: 'agents', // AI Agent slot
    img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
    img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
    img3: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
  },
  {
    num: '02',
    category: 'Personal Work',
    name: 'Aura Brand Identity',
    tabId: 'notes', // Reading Shelf / notes slot
    img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
    img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
    img3: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
  },
  {
    num: '03',
    category: 'Client Work',
    name: 'Solaris Digital',
    tabId: 'dashboard', // Core dynamic dashboard slot
    img1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
    img2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
    img3: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
  },
];

interface ProjectsSectionProps {
  onOpenTabCockpit: (tabId: string) => void;
}

export default function ProjectsSection({ onOpenTabCockpit }: ProjectsSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Track scroll space of the main visual area
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="relative z-20">
      <section
        id="projects-sec"
        className="relative bg-[#0C0C0C] text-white select-none rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] pb-24 px-5 sm:px-8 md:px-10 -mt-10 sm:-mt-12 md:-mt-14 z-10 font-sans"
      >
        <div className="max-w-6xl mx-auto w-full pt-20">
          {/* Header */}
          <FadeIn delay={0} y={40}>
            <h2
              className="hero-heading font-black uppercase text-center tracking-tight leading-none mb-16 md:mb-20"
              style={{ fontSize: 'clamp(3rem, 11vw, 150px)' }}
            >
              Project
            </h2>
          </FadeIn>

          {/* Cards stacking structure mapping Framer scroll transform multipliers */}
          <div className="flex flex-col gap-12 sm:gap-20 md:gap-24">
            {projects.map((proj, index) => {
              const cardTotal = projects.length;
              const targetScale = 1 - (cardTotal - 1 - index) * 0.03;
              const offsetTop = index * 28;

              return (
                <ProjectCard
                  key={proj.num}
                  proj={proj}
                  index={index}
                  offsetTop={offsetTop}
                  targetScale={targetScale}
                  scrollYProgress={scrollYProgress}
                  onOpenTab={() => onOpenTabCockpit(proj.tabId)}
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

interface ProjectCardProps {
  key?: React.Key;
  proj: typeof projects[0];
  index: number;
  offsetTop: number;
  targetScale: number;
  scrollYProgress: any;
  onOpenTab: () => void;
}

function ProjectCard({ proj, index, offsetTop, targetScale, scrollYProgress, onOpenTab }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  
  // Custom transform range for scaling down while scrolling past
  const startScroll = index / projects.length;
  const endScroll = (index + 1) / projects.length;

  const scale = useTransform(scrollYProgress, [startScroll, endScroll], [1, targetScale]);

  return (
    <div
      className="sticky hover:-translate-y-1 transition-transform duration-300"
      style={{
        top: `calc(90px + ${offsetTop}px)`,
        height: 'height: clamp(60vh, 85vh, 90vh)',
      }}
    >
      <motion.div
        ref={cardRef}
        style={{ scale }}
        className="w-full bg-[#0C0C0C] border-2 border-[#D7E2EA] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] p-5 sm:p-7 md:p-10 shadow-2xl flex flex-col justify-between"
      >
        {/* Top Details Horizontal Grid */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 sm:gap-6 text-left">
            <span
              className="font-black text-[#D7E2EA] leading-none"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 100px)' }}
            >
              {proj.num}
            </span>
            <div>
              <span className="text-[10px] md:text-xs tracking-widest text-[#D7E2EA]/50 uppercase font-bold block">
                {proj.category}
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3.5xl font-extrabold uppercase text-white leading-tight">
                {proj.name}
              </h3>
            </div>
          </div>

          <LiveProjectButton label="Live Project" onClick={onOpenTab} />
        </div>

        {/* Bottom Pictures Grid: Left stacked, Right single tall */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4 md:gap-6 flex-1 items-stretch">
          {/* Left Layout (40%) contains 2 stacked images */}
          <div className="md:col-span-4 flex flex-col justify-between gap-4">
            <div
              className="w-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden bg-neutral-900 border border-[#D7E2EA]/10"
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
            >
              <img
                src={proj.img1}
                alt="Highlight visual 1"
                className="w-full h-full object-cover select-none pointer-events-none hover:scale-105 transition-transform duration-500"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <div
              className="w-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden bg-neutral-900 border border-[#D7E2EA]/10"
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            >
              <img
                src={proj.img2}
                alt="Highlight visual 2"
                className="w-full h-full object-cover select-none pointer-events-none hover:scale-105 transition-transform duration-500"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right Layout (60%) with 1 tall image */}
          <div className="md:col-span-6 rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden bg-neutral-900 border border-[#D7E2EA]/10 relative min-h-[220px] md:min-h-0">
            <img
              src={proj.img3}
              alt="Highlight visual tall"
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none hover:scale-105 transition-transform duration-500"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
