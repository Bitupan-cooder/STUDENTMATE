import React from 'react';

interface ContactButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export default function ContactButton({ label = 'Contact Me', onClick, className = '' }: ContactButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-full font-medium uppercase tracking-widest text-white transition-all cursor-pointer active:scale-95 select-none hover:opacity-90 ${className}`}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
    >
      <span className="block px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base font-bold whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}
