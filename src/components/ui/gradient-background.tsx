'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface GradientBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  speed?: 'slow' | 'medium' | 'fast';
  intensity?: 'subtle' | 'vibrant';
  interactive?: boolean;
}

export function GradientBackground({
  children,
  className,
  containerClassName,
  speed = 'medium',
  intensity = 'vibrant',
  interactive = false,
}: GradientBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || isReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  // Speed duration mapping
  const durationClass =
    speed === 'slow'
      ? 'duration-[30s]'
      : speed === 'fast'
      ? 'duration-[12s]'
      : 'duration-[20s]';

  // Intensity opacity mapping
  const opacityClass =
    intensity === 'subtle' ? 'opacity-40' : 'opacity-70 dark:opacity-85';

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        'relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#050B18] dark:text-white transition-colors duration-500',
        containerClassName
      )}
    >
      {/* Background Animated Gradient Blobs Container */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        
        {/* Math Grid Accent Overlay */}
        <div className="absolute inset-0 math-grid-bg opacity-20 dark:opacity-25 z-10" />

        {/* Blob 1: Ocean Blue (Top Right) */}
        <div
          className={cn(
            'absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-200/50 via-[#e0f2fe]/40 to-transparent dark:from-[#0284c7] dark:via-[#0369a1] dark:to-transparent filter blur-[100px] mix-blend-multiply dark:mix-blend-screen transition-transform ease-out',
            opacityClass,
            durationClass,
            !isReducedMotion && 'animate-blob-slow-1'
          )}
        />

        {/* Blob 2: Cyan (Center Left) */}
        <div
          className={cn(
            'absolute top-1/4 -left-1/4 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-sky-200/60 via-sky-100/40 to-transparent dark:from-[#38bdf8]/60 dark:via-[#0284c7]/40 dark:to-transparent filter blur-[90px] mix-blend-multiply dark:mix-blend-screen transition-transform ease-out',
            opacityClass,
            durationClass,
            !isReducedMotion && 'animate-blob-slow-2'
          )}
        />

        {/* Blob 3: Emerald Glow (#235D3A & #73C088) (Bottom Right) */}
        <div
          className={cn(
            'absolute -bottom-1/4 right-1/3 w-[650px] h-[650px] rounded-full bg-gradient-to-t from-emerald-200/50 via-emerald-100/40 to-transparent dark:from-[#235d3a]/70 dark:via-[#73c088]/40 dark:to-transparent filter blur-[110px] mix-blend-multiply dark:mix-blend-screen transition-transform ease-out',
            opacityClass,
            durationClass,
            !isReducedMotion && 'animate-blob-slow-3'
          )}
        />

        {/* Blob 4: Soft Radial Core Light (Center) */}
        <div
          className={cn(
            'absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-radial from-blue-400/10 via-emerald-300/10 to-transparent dark:from-white/20 dark:via-blue-200/10 dark:to-transparent filter blur-[70px] mix-blend-overlay',
            opacityClass
          )}
        />

        {/* Interactive Mouse Trail Blob */}
        {interactive && !isReducedMotion && (
          <div
            className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-r from-sky-300/30 to-emerald-300/30 dark:from-sky-400/30 dark:to-[#73c088]/30 filter blur-[60px] pointer-events-none transition-all duration-300 ease-out mix-blend-multiply dark:mix-blend-screen"
            style={{
              transform: `translate3d(${mousePosition.x - 150}px, ${
                mousePosition.y - 150
              }px, 0)`,
            }}
          />
        )}

        {/* Bottom Fade Gradient for seamless layout section transition */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-50 via-slate-50/60 to-transparent dark:from-[#050B18] dark:via-[#050B18]/60 dark:to-transparent z-10" />
      </div>

      {/* Content Container */}
      <div className={cn('relative z-10', className)}>{children}</div>
    </div>
  );
}

export default GradientBackground;
