import React, { useEffect, useRef, useState } from 'react';

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      opacity: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    const createParticles = () => {
      particles = [];
      const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 12000));
      for (let i = 0; i < count; i++) {
        const isRed = Math.random() > 0.7;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          size: Math.random() * 2 + 0.5,
          color: isRed ? '226, 18, 39' : '255, 255, 255',
          opacity: Math.random() * 0.6 + 0.2,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Scroll video scrubbing logic
  useEffect(() => {
    const handleScroll = (e: Event) => {
      let scrollTop = 0;
      let scrollHeight = 0;
      let clientHeight = 0;

      const target = e.target;
      if (target === document || target === window) {
        scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
        scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        clientHeight = window.innerHeight;
      } else if (target instanceof HTMLElement) {
        scrollTop = target.scrollTop;
        scrollHeight = target.scrollHeight;
        clientHeight = target.clientHeight;
      } else if (target && (target as any).scrollTop !== undefined) {
        scrollTop = (target as any).scrollTop;
        scrollHeight = (target as any).scrollHeight;
        clientHeight = (target as any).clientHeight;
      }

      const scrollLimit = scrollHeight - clientHeight;
      if (scrollLimit <= 0) return;

      const percentage = Math.min(Math.max(0, scrollTop / scrollLimit), 1);
      setScrollProgress(percentage);

      const video = videoRef.current;
      if (video && video.duration) {
        const targetTime = percentage * video.duration;
        video.currentTime = Math.min(Math.max(0, targetTime), video.duration - 0.05);
      }
    };

    // Capture scrolls on any container with capture phase so it catches inner main scrolls
    window.addEventListener('scroll', handleScroll, { capture: true });

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Scrolling/Looping Video Background */}
      <div 
        id="scroll-video-container" 
        className="absolute inset-0 z-0 opacity-95 dark:opacity-100 mix-blend-screen overflow-hidden"
      >
        <video
          ref={videoRef}
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{
            transform: `scale(${1.02 + scrollProgress * 0.15}) rotate(${scrollProgress * 28}deg)`,
            transition: 'transform 0.15s cubic-bezier(0.1, 0.8, 0.2, 1)',
          }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260616_212935_bbf608da-62d1-4f25-9be4-c346e4d09cc8.mp4"
        />
        <div className="absolute inset-0 bg-slate-50/5 dark:bg-[#030712]/20 overlay" />
      </div>

      {/* 2. Starburst Particles Canvas Layer */}
      <canvas ref={canvasRef} id="particles-canvas" className="absolute inset-0 w-full h-full z-10" />

      {/* 3. Deep Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-slate-100/20 dark:to-[#030712]/70 z-20" />
    </div>
  );
}
