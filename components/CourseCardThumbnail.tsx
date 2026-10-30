'use client';

import React, { useState, useEffect } from 'react';
import {
  Code2,
  Database,
  Cloud,
  Layers,
  Sparkles,
  GitBranch,
  Terminal,
  Cpu,
  Brain,
  Award,
  BookOpen
} from 'lucide-react';

interface CourseCardThumbnailProps {
  src?: string;
  alt: string;
  courseId: string;
  category?: string;
  level?: string;
  className?: string;
}

const CATEGORY_ICONS: Record<string, any> = {
  Programming: Code2,
  'Data Structures': Layers,
  Databases: Database,
  'Frontend Development': Sparkles,
  Cloud: Cloud,
  'Artificial Intelligence': Brain,
  Tools: GitBranch,
  'Soft Skills': Award
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  Programming: 'from-blue-950 via-slate-900 to-indigo-950 text-blue-400',
  'Data Structures': 'from-purple-950 via-slate-900 to-fuchsia-950 text-purple-400',
  Databases: 'from-emerald-950 via-slate-900 to-teal-950 text-emerald-400',
  'Frontend Development': 'from-sky-950 via-slate-900 to-cyan-950 text-sky-400',
  Cloud: 'from-indigo-950 via-slate-900 to-blue-950 text-indigo-400',
  'Artificial Intelligence': 'from-pink-950 via-slate-900 to-purple-950 text-pink-400',
  Tools: 'from-rose-950 via-slate-900 to-orange-950 text-rose-400',
  'Soft Skills': 'from-amber-950 via-slate-900 to-yellow-950 text-amber-400'
};

export default function CourseCardThumbnail({
  src,
  alt,
  courseId,
  category = 'Programming',
  level,
  className = ''
}: CourseCardThumbnailProps) {
  // Prefer local SVG if available, fallback to provided src or local SVG
  const defaultLocal = `/images/courses/${courseId}.svg`;
  const [currentSrc, setCurrentSrc] = useState<string>(src || defaultLocal);
  const [hasError, setHasError] = useState(false);
  const [attemptedLocal, setAttemptedLocal] = useState(false);

  useEffect(() => {
    // When src prop changes, reset state
    setCurrentSrc(src || defaultLocal);
    setHasError(false);
    setAttemptedLocal(false);
  }, [src, courseId]);

  const handleError = () => {
    if (!attemptedLocal && currentSrc !== defaultLocal) {
      // First fallback: attempt local vector SVG
      setAttemptedLocal(true);
      setCurrentSrc(defaultLocal);
    } else {
      // Ultimate fallback: rendered pure React gradient badge
      setHasError(true);
    }
  };

  const IconComponent = CATEGORY_ICONS[category] || Code2;
  const gradientClass = CATEGORY_GRADIENTS[category] || 'from-slate-900 via-slate-800 to-slate-950 text-cyan-400';

  if (hasError) {
    return (
      <div className={`w-full h-full bg-gradient-to-tr ${gradientClass} flex flex-col items-center justify-center p-6 text-center relative overflow-hidden select-none ${className}`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-radial from-white/10 to-transparent blur-xl pointer-events-none" />

        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform">
          <IconComponent className="w-8 h-8 text-current" />
        </div>

        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1">
          {category}
        </span>
        <h4 className="text-sm font-black text-white line-clamp-1 max-w-[90%] tracking-tight">
          {alt}
        </h4>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${className}`}
      loading="lazy"
    />
  );
}
