import React, { useEffect, useRef } from 'react';

// Exact 21 GIF URLs requested in the prompt
const gifs = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
];

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const row1Ref = useRef<HTMLDivElement | null>(null);
  const row2Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      const row1 = row1Ref.current;
      const row2 = row2Ref.current;
      if (!section || !row1 || !row2) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      
      // Calculate scroll offset exactly as requested:
      // (window.scrollY - sectionTop + window.innerHeight) * 0.3
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;

      // Update row positions via direct DOM updates with willChange: transform
      row1.style.transform = `translate3d(${offset - 200}px, 0px, 0px)`;
      row2.style.transform = `translate3d(${-(offset - 200)}px, 0px, 0px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Split into Row 1 (first 11 images, tripled) and Row 2 (remaining 10 images, tripled)
  const row1Gifs = [...gifs.slice(0, 11), ...gifs.slice(0, 11), ...gifs.slice(0, 11)];
  const row2Gifs = [...gifs.slice(11), ...gifs.slice(11), ...gifs.slice(11)];

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden select-none"
    >
      <div className="flex flex-col gap-3">
        {/* Row 1 - Moves RIGHT on scroll */}
        <div className="whitespace-nowrap overflow-visible">
          <div
            ref={row1Ref}
            className="flex gap-3 w-max"
            style={{
              willChange: 'transform',
              transition: 'transform 0.1s ease-out',
            }}
          >
            {row1Gifs.map((src, idx) => (
              <div
                key={`r1-${idx}`}
                className="w-[420px] h-[270px] rounded-2xl overflow-hidden flex-shrink-0 bg-neutral-900 shadow-xl border border-white/5"
              >
                <img
                  src={src}
                  alt={`Marquee top ${idx}`}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Moves LEFT on scroll */}
        <div className="whitespace-nowrap overflow-visible">
          <div
            ref={row2Ref}
            className="flex gap-3 w-max"
            style={{
              willChange: 'transform',
              transition: 'transform 0.1s ease-out',
            }}
          >
            {row2Gifs.map((src, idx) => (
              <div
                key={`r2-${idx}`}
                className="w-[420px] h-[270px] rounded-2xl overflow-hidden flex-shrink-0 bg-neutral-900 shadow-xl border border-white/5"
              >
                <img
                  src={src}
                  alt={`Marquee bottom ${idx}`}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
