import React from "react";

interface CharticlesLogoProps {
  className?: string;
  size?: number;
}

export function CharticlesLogo({ className = "h-5 w-5", size }: CharticlesLogoProps) {
  const dimensionProps = size ? { width: size, height: size } : {};

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...dimensionProps}
    >
      <defs>
        {/* Signature Charticles Neon Teal to Electric Violet Gradient */}
        <linearGradient id="charticles-c-grad" x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2ff0d6" />
          <stop offset="55%" stopColor="#22e3cb" />
          <stop offset="100%" stopColor="#7c4dff" />
        </linearGradient>

        {/* Ambient Precision Glow Filter */}
        <filter id="charticles-c-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#2ff0d6" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Main Elegant Geometric 'C' Curve */}
      <path
        d="M 23 9 A 10 10 0 1 0 23 23"
        stroke="url(#charticles-c-grad)"
        strokeWidth="3.2"
        strokeLinecap="round"
        filter="url(#charticles-c-glow)"
      />

      {/* Trailing Particle Node (The Data Origin) */}
      <circle cx="23.5" cy="16" r="1.6" fill="#2ff0d6" filter="url(#charticles-c-glow)" />

      {/* Secondary Orbit Particle */}
      <circle cx="17.5" cy="16" r="1.1" fill="#2ff0d6" fillOpacity="0.75" />
    </svg>
  );
}
