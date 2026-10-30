'use client';

import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';

interface CompanyLogoBadgeProps {
  logoUrl?: string;
  companyId?: string;
  companyName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const COMPANY_NAME_TO_ID: Record<string, string> = {
  'technova': 'comp_1',
  'innosoft': 'comp_2',
  'datasphere': 'comp_3',
  'cloudcore': 'comp_4',
  'finedge': 'comp_5',
  'nextgen ai': 'comp_6',
  'cybershield': 'comp_7',
  'pulsehealth': 'comp_8',
  'bytewave': 'comp_9',
  'apex logistics': 'comp_10'
};

const COMPANY_GRADIENTS: Record<string, string> = {
  comp_1: 'from-blue-600 to-indigo-700 text-white',
  comp_2: 'from-emerald-600 to-teal-700 text-white',
  comp_3: 'from-purple-600 to-indigo-700 text-white',
  comp_4: 'from-sky-600 to-blue-700 text-white',
  comp_5: 'from-amber-600 to-orange-700 text-white',
  comp_6: 'from-pink-600 to-purple-700 text-white',
  comp_7: 'from-cyan-600 to-blue-800 text-white',
  comp_8: 'from-rose-600 to-red-700 text-white',
  comp_9: 'from-indigo-600 to-purple-700 text-white',
  comp_10: 'from-teal-600 to-emerald-700 text-white'
};

const SIZE_CLASSES = {
  sm: 'w-10 h-10 text-xs rounded-xl',
  md: 'w-12 h-12 text-sm rounded-2xl',
  lg: 'w-16 h-16 text-base rounded-2xl',
  xl: 'w-20 h-20 text-xl rounded-3xl'
};

export default function CompanyLogoBadge({
  logoUrl,
  companyId,
  companyName,
  size = 'md',
  className = ''
}: CompanyLogoBadgeProps) {
  // Infer ID from companyName if not explicitly provided
  const normalizedName = (companyName || '').toLowerCase().trim();
  const resolvedCompId = companyId || COMPANY_NAME_TO_ID[normalizedName] || 'comp_1';

  // Prefer dedicated local SVG asset
  const localSvg = `/images/companies/${resolvedCompId}.svg`;
  const [currentSrc, setCurrentSrc] = useState<string>(logoUrl || localSvg);
  const [hasError, setHasError] = useState(false);
  const [attemptedLocal, setAttemptedLocal] = useState(false);

  useEffect(() => {
    setCurrentSrc(logoUrl || localSvg);
    setHasError(false);
    setAttemptedLocal(false);
  }, [logoUrl, companyId, companyName]);

  const handleError = () => {
    if (!attemptedLocal && currentSrc !== localSvg) {
      setAttemptedLocal(true);
      setCurrentSrc(localSvg);
    } else {
      setHasError(true);
    }
  };

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const gradientClass = COMPANY_GRADIENTS[resolvedCompId] || 'from-slate-700 to-slate-900 text-white';
  const initials = companyName
    ? companyName
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CO';

  if (hasError) {
    return (
      <div
        className={`${sizeClass} bg-gradient-to-tr ${gradientClass} flex items-center justify-center font-black tracking-tight shrink-0 shadow-sm border border-white/10 ${className}`}
        title={companyName}
      >
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} bg-slate-900 border border-slate-200/80 flex items-center justify-center font-bold text-slate-800 shrink-0 overflow-hidden shadow-sm ${className}`}
      title={companyName}
    >
      <img
        src={currentSrc}
        alt={companyName}
        onError={handleError}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
