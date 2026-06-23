import React from 'react';
import FadeIn from './FadeIn';

const services = [
  {
    num: '01',
    name: '3D Modeling',
    desc: 'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.',
  },
  {
    num: '02',
    name: 'Rendering',
    desc: 'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.',
  },
  {
    num: '03',
    name: 'Motion Design',
    desc: 'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.',
  },
  {
    num: '04',
    name: 'Branding',
    desc: 'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.',
  },
  {
    num: '05',
    name: 'Web Design',
    desc: 'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
  },
];

export default function ServicesSection() {
  return (
    <section
      id="services-sec"
      className="relative bg-white text-[#0C0C0C] select-none rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 z-10 font-sans"
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Title */}
        <FadeIn delay={0} y={40}>
          <h2
            className="font-black uppercase text-center text-[#0C0C0C] tracking-tight leading-none mb-16 sm:mb-20 md:mb-28"
            style={{ fontSize: 'clamp(3rem, 11vw, 150px)' }}
          >
            Services
          </h2>
        </FadeIn>

        {/* List of items */}
        <div className="flex flex-col border-t border-black/15">
          {services.map((svc, i) => (
            <FadeIn
              key={svc.num}
              delay={i * 0.15}
              y={30}
              className="flex items-start md:items-center py-8 sm:py-10 md:py-12 border-b border-black/15 gap-4 md:gap-12"
            >
              {/* Number left */}
              <div
                className="font-black text-[#0C0C0C] leading-none select-none min-w-[70px] sm:min-w-[120px] md:min-w-[160px]"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
              >
                {svc.num}
              </div>

              {/* Text content right */}
              <div className="flex flex-col gap-2 text-left">
                <h3
                  className="font-semibold uppercase text-black"
                  style={{ fontSize: 'clamp(1.15rem, 2.2vw, 2.1rem)' }}
                >
                  {svc.name}
                </h3>
                <p
                  className="font-light leading-relaxed text-black/70 max-w-2xl"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.15rem)' }}
                >
                  {svc.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
