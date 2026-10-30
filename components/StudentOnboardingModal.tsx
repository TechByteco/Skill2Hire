'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Code2,
  Shield,
  Layers,
  Check,
  Zap,
  Flame,
  Brain,
  Cpu,
  Lock,
  Globe,
  Database
} from 'lucide-react';

interface StudentOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  currentStudent?: any;
  onComplete: (updatedStudent: any) => void;
}

const CAREER_ROLES = [
  { id: 'AI & Machine Learning Engineer', label: 'AI & Machine Learning Engineer', icon: Brain, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { id: 'Data Scientist', label: 'Data Scientist & Analyst', icon: Database, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'Cybersecurity Analyst', label: 'Cybersecurity Analyst & SOC Lead', icon: Lock, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { id: 'Full Stack Developer', label: 'Full Stack Software Engineer', icon: Globe, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { id: 'Cloud DevOps Associate', label: 'Cloud DevOps & SRE Engineer', icon: Cpu, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { id: 'Software Developer', label: 'Backend Systems & API Developer', icon: Code2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
];

const PROGRAMMING_LANGUAGES = [
  'Python',
  'JavaScript',
  'TypeScript',
  'C++',
  'Java',
  'SQL',
  'Go',
  'Rust',
  'R',
  'Docker & Linux'
];

const DOMAINS = [
  {
    id: 'Data Science & AI',
    title: 'Data Science & AI',
    desc: 'Predictive analytics, deep learning neural nets, LLMs, computer vision, and big data ETL pipelines.',
    icon: Brain,
    badge: 'High Demand',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  },
  {
    id: 'Cybersecurity & InfoSec',
    title: 'Cybersecurity & InfoSec',
    desc: 'Vulnerability assessment, network defense, threat hunting, secure coding, and ethical hacking.',
    icon: Lock,
    badge: 'Critical Need',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
  },
  {
    id: 'Cloud & DevOps',
    title: 'Cloud & DevOps',
    desc: 'CI/CD automation, Kubernetes container orchestration, AWS/GCP cloud architectures, and Terraform.',
    icon: Cpu,
    badge: 'Industry Standard',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  {
    id: 'Web & Mobile Development',
    title: 'Web & Mobile Development',
    desc: 'High-performance React/Next.js SaaS web apps, mobile cross-platform applications, and REST/GraphQL APIs.',
    icon: Globe,
    badge: 'Popular',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
  },
  {
    id: 'Systems & Embedded Systems',
    title: 'Systems & Embedded Systems',
    desc: 'Low-latency C/C++ memory architecture, OS kernel internals, IoT microcontrollers, and robotics.',
    icon: Zap,
    badge: 'Core Tech',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  }
];

export default function StudentOnboardingModal({
  isOpen,
  onClose,
  studentId,
  currentStudent,
  onComplete
}: StudentOnboardingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    currentStudent?.interestedRoles || ['AI & Machine Learning Engineer', 'Full Stack Developer']
  );
  const [selectedLangs, setSelectedLangs] = useState<string[]>(
    currentStudent?.programmingLanguages || ['Python', 'SQL', 'TypeScript']
  );
  const [selectedDomains, setSelectedDomains] = useState<string[]>(
    currentStudent?.interestedDomains || ['Data Science & AI', 'Cybersecurity & InfoSec']
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const toggleRole = (roleId: string) => {
    if (selectedRoles.includes(roleId)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter(r => r !== roleId));
      }
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const toggleLang = (lang: string) => {
    if (selectedLangs.includes(lang)) {
      if (selectedLangs.length > 1) {
        setSelectedLangs(selectedLangs.filter(l => l !== lang));
      }
    } else {
      setSelectedLangs([...selectedLangs, lang]);
    }
  };

  const toggleDomain = (domainId: string) => {
    if (selectedDomains.includes(domainId)) {
      if (selectedDomains.length > 1) {
        setSelectedDomains(selectedDomains.filter(d => d !== domainId));
      }
    } else {
      setSelectedDomains([...selectedDomains, domainId]);
    }
  };

  const handleSaveAndOptimize = async () => {
    setIsSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interestedRoles: selectedRoles,
          programmingLanguages: selectedLangs,
          interestedDomains: selectedDomains,
          onboardingCompleted: true
        })
      });

      const data = await res.json();
      if (data.success && data.student) {
        onComplete(data.student);
        onClose();
      } else {
        setError(data.error || 'Failed to save interests. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Error saving career interests.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 text-slate-100">
        
        {/* Top Header & Step Tracker */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Career Track Setup
              </span>
              <span className="text-xs text-slate-400 font-mono">Step {step} of 3</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {step === 1 && 'Select Your Target Job Roles'}
              {step === 2 && 'Your Programming Languages & Skills'}
              {step === 3 && 'Choose Your Specialized Domains'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* STEP 1: JOB ROLES */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Pick the roles you want to pursue. Skill2Hire will calibrate your match scores, roadmap milestones, and interview simulations accordingly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CAREER_ROLES.map((role) => {
                const isSelected = selectedRoles.includes(role.id);
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => toggleRole(role.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 relative ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl border ${role.color} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0 pr-5">
                      <h4 className={`text-xs font-black leading-snug ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                        {role.label}
                      </h4>
                      <span className="text-[10px] text-slate-400 block mt-1">Verified industry competencies</span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: PROGRAMMING LANGUAGES */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Select languages you already know or plan to master. We will calibrate code tests, universal compiler templates, and live challenges to these technologies.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {PROGRAMMING_LANGUAGES.map((lang) => {
                const isSelected = selectedLangs.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLang(lang)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 scale-105'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <span>{lang}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="text-cyan-400 font-bold block">💡 Pro-tip for Placements:</span>
              <p>Top companies like Google, Microsoft, and Amazon prioritize candidates proficient in at least one object-oriented language (Python/Java/C++) and SQL for backend data logic.</p>
            </div>
          </div>
        )}

        {/* STEP 3: SPECIALIZED DOMAINS */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Choose your specialized focus areas. We will match you with peer study circles, open-source AI projects, and tailored job openings in these domains.
            </p>

            <div className="space-y-3">
              {DOMAINS.map((domain) => {
                const isSelected = selectedDomains.includes(domain.id);
                const Icon = domain.icon;
                return (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => toggleDomain(domain.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 relative ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-950/50 to-indigo-950/50 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pr-6 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-xs sm:text-sm font-black ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                          {domain.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${domain.badgeColor}`}>
                          {domain.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{domain.desc}</p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((step + 1) as any)}
              className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-cyan-400/20 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveAndOptimize}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-400/25 transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>{isSaving ? 'Personalizing...' : 'Save & Optimize My Platform'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
