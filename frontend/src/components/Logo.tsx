import React from 'react';

interface LogoProps {
  size?: 'small' | 'large';
}

export default function Logo({ size = 'small' }: LogoProps) {
  const isLarge = size === 'large';

  return (
    <div className={`flex items-center gap-2 ${isLarge ? 'gap-3' : 'gap-2'}`}>
      {/* Flame Icon */}
      <div className={`relative ${isLarge ? 'w-10 h-12' : 'w-7 h-8'} animate-flame`}>
        <svg
          viewBox="0 0 40 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 0 8px oklch(0.65 0.22 25 / 0.8))' }}
        >
          <defs>
            <linearGradient id="flameOuter" x1="20" y1="48" x2="20" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="oklch(0.55 0.22 20)" />
              <stop offset="50%" stopColor="oklch(0.65 0.22 25)" />
              <stop offset="100%" stopColor="oklch(0.72 0.18 195)" />
            </linearGradient>
            <linearGradient id="flameInner" x1="20" y1="48" x2="20" y2="10" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="oklch(0.75 0.20 30)" />
              <stop offset="100%" stopColor="oklch(0.85 0.12 195)" />
            </linearGradient>
          </defs>
          {/* Outer flame */}
          <path
            d="M20 2C20 2 8 14 8 26C8 33.7 13.4 40 20 40C26.6 40 32 33.7 32 26C32 14 20 2 20 2Z"
            fill="url(#flameOuter)"
          />
          {/* Inner flame */}
          <path
            d="M20 14C20 14 13 22 13 29C13 33.4 16.1 37 20 37C23.9 37 27 33.4 27 29C27 22 20 14 20 14Z"
            fill="url(#flameInner)"
            opacity="0.9"
          />
          {/* Core */}
          <ellipse cx="20" cy="32" rx="4" ry="5" fill="oklch(0.95 0.05 60)" opacity="0.8" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className={`font-display font-bold tracking-tight ${isLarge ? 'text-3xl' : 'text-lg'}`}>
        <span className="gradient-text-brand">Noventra</span>
        <span className="text-cyan" style={{ textShadow: '0 0 10px oklch(0.72 0.18 195 / 0.6)' }}>.ai</span>
      </div>
    </div>
  );
}
